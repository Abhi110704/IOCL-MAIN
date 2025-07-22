import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { JWT_SECRET } from '../config/env';

interface JwtPayload {
  userId: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new ApiError('Access denied. No token provided.', 401);
    }

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
    logger.error('Authentication error:', error);
    next(new ApiError('Invalid token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Access denied. User not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

export const checkMentorAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { internId } = req.params;
    
    if (!req.user) {
      return next(new ApiError('User not authenticated', 401));
    }

    if (req.user.role !== 'mentor') {
      return next(new ApiError('Access denied. Only mentors can access this resource.', 403));
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
      return next(new ApiError('Access denied. You are not assigned to this intern.', 403));
    }

    next();
  } catch (error) {
    logger.error('Mentor access check error:', error);
    next(new ApiError('Error checking mentor access', 500));
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

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
    // Silently continue without authentication
    next();
  }
};