import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../types';

// Create rate limiter instance
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip, // Use IP address as key
  points: RATE_LIMIT_MAX_REQUESTS, // Number of requests
  duration: Math.floor(RATE_LIMIT_WINDOW_MS / 1000), // Per duration in seconds
});

// Rate limiting middleware
export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });

    res.set('Retry-After', String(secs));
    return next(new ApiError('Too many requests, please try again later', 429));
  }
};

// Setup rate limiting for Express app
export const setupRateLimiting = (app: any) => {
  // Apply rate limiting to all routes
  app.use(rateLimitMiddleware);
  
  // Stricter rate limiting for auth routes
  const authRateLimiter = new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 5, // 5 attempts
    duration: 900, // Per 15 minutes
  });

  app.use('/api/auth', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authRateLimiter.consume(req.ip);
      next();
    } catch (rejRes: any) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
        method: req.method,
      });

      res.set('Retry-After', String(secs));
      return next(new ApiError('Too many authentication attempts, please try again later', 429));
    }
  });
};