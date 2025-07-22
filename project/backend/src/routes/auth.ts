import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '../config/env';
import { validateBody } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { LoginSchema, PasswordResetSchema, ApiError, AuthResponse } from '../types';
import { logger } from '../config/logger';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', 
  validateBody(LoginSchema),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Find user by username or empId
    const user = await User.findOne({
      $or: [
        { username },
        { empId: username },
      ],
    });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        empId: user.empId,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const userWithoutPassword = user.toJSON();

    logger.info(`User ${user.username} logged in successfully`);

    const response: AuthResponse = {
      token,
      user: userWithoutPassword,
    };

    res.json({
      success: true,
      data: response,
      message: 'Login successful',
    });
  })
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    logger.info(`User ${req.user?.username} logged out`);
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  })
);

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id).select('-password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  })
);

/**
 * POST /api/auth/reset-password
 * Reset user password (first login or change password)
 */
router.post('/reset-password',
  authenticate,
  validateBody(PasswordResetSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    // Get current user
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new ApiError('Current password is incorrect', 400);
    }

    // Update password and mark first login as false
    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    logger.info(`User ${user.username} reset their password`);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  })
);

/**
 * POST /api/auth/verify-token
 * Verify JWT token validity
 */
router.post('/verify-token',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: req.user,
      message: 'Token is valid',
    });
  })
);

export default router;