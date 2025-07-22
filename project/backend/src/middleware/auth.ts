import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Mentor, Assignment } from '../models';
import { JWT_SECRET } from '../config/env';
import { ApiError, JwtPayload } from '../types';
import { logger } from '../config/logger';

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    empId?: string;
    role: string;
    name: string;
    email?: string;
    department?: string;
  };
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new ApiError('User not found', 401);
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      empId: user.empId,
      role: user.role,
      name: user.name,
      email: user.email,
      department: user.department,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token:', error.message);
      return next(new ApiError('Invalid access token', 401));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired JWT token:', error.message);
      return next(new ApiError('Access token expired', 401));
    }
    
    next(error);
  }
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return next(new ApiError('Insufficient permissions', 403));
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource or has admin privileges
 */
export const authorizeOwnerOrAdmin = (resourceIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    const resourceId = req.params[resourceIdParam];
    const isOwner = req.user.id === resourceId || req.user.empId === resourceId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      logger.warn(`Unauthorized resource access attempt by user ${req.user.id}`);
      return next(new ApiError('Access denied', 403));
    }

    next();
  };
};

/**
 * Middleware to check mentor access to intern resources
 */
export const authorizeMentorAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    // Admin and L&D team have full access
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // For mentors, check if they have access to the intern
    if (req.user.role === 'MENTOR') {
      const internId = req.params.internId || req.body.internId;
      
      if (!internId) {
        return next(new ApiError('Intern ID is required', 400));
      }

      // Find mentor record
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor) {
        return next(new ApiError('Mentor record not found', 404));
      }

      // Check if mentor is assigned to this intern
      const assignment = await Assignment.findOne({
          internId,
          mentorId: mentor._id,
          isActive: true,
        });

      if (!assignment) {
        logger.warn(`Mentor ${req.user.id} attempted to access intern ${internId} without assignment`);
        return next(new ApiError('Access denied to this intern', 403));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware (doesn't throw error if no token)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      req.user = {
        id: user._id.toString(),
        empId: user.empId,
        role: user.role,
        name: user.name,
        email: user.email,
        department: user.department,
      };
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};