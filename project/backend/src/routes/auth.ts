import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
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
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { empId: username },
        ],
      },
    });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        empId: user.empId,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

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
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        empId: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        role: true,
        isFirstLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new ApiError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password and mark first login as false
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        isFirstLogin: false,
      },
    });

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