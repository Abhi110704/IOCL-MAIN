import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateFeedbackSchema, ApiError } from '../types';
import { logger } from '../config/logger';
import { z } from 'zod';

const router = Router();

// Query schema for filtering feedback
const GetFeedbackQuerySchema = z.object({
  internId: z.string().optional(),
  mentorId: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

/**
 * POST /api/feedback
 * Create feedback for an intern
 */
router.post('/',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  validateBody(CreateFeedbackSchema),
  asyncHandler(async (req, res) => {
    const { internId, rating, communication, technical, teamwork, initiative, comments } = req.body;

    // Get mentor ID
    let mentorId: string;
    if (req.user!.role === 'ADMIN') {
      // For admin, get the mentor from assignment
      const assignment = await prisma.assignment.findFirst({
        where: { internId, isActive: true },
      });
      
      if (!assignment) {
        throw new ApiError('No active mentor assignment found for this intern', 404);
      }
      
      mentorId = assignment.mentorId;
    } else {
      // For mentor, get their mentor record
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user!.empId },
      });
      
      if (!mentor) {
        throw new ApiError('Mentor record not found', 404);
      }
      
      mentorId = mentor.id;
    }

    // Verify intern exists and is assigned to this mentor
    const assignment = await prisma.assignment.findFirst({
      where: { internId, mentorId, isActive: true },
      include: { intern: true },
    });

    if (!assignment) {
      throw new ApiError('Intern not assigned to this mentor', 403);
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        internId,
        mentorId,
        rating,
        communication,
        technical,
        teamwork,
        initiative,
        comments,
      },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
          },
        },
        mentor: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
    });

    logger.info(`Feedback created for intern: ${assignment.intern.name} by ${feedback.mentor.name}`);

    res.status(201).json({
      success: true,
      data: {
        ...feedback,
        internName: feedback.intern.name,
        mentor: feedback.mentor.name,
        date: feedback.createdAt.toISOString().split('T')[0],
      },
      message: 'Feedback submitted successfully',
    });
  })
);

/**
 * GET /api/feedback
 * Get feedback with filtering
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { internId, mentorId, page, limit } = req.query as any;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (internId) {
      where.internId = internId;
    }

    // For mentors, only show their feedback
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (mentor) {
        where.mentorId = mentor.id;
      }
    }

    if (mentorId && req.user?.role === 'ADMIN') {
      where.mentorId = mentorId;
    }

    // For interns, only show their feedback
    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (intern) {
        where.internId = intern.id;
      }
    }

    // Get feedback with pagination
    const [feedbackList, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        include: {
          intern: {
            select: {
              name: true,
              internId: true,
            },
          },
          mentor: {
            select: {
              name: true,
              empId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.feedback.count({ where }),
    ]);

    // Transform data for frontend
    const transformedFeedback = feedbackList.map(feedback => ({
      ...feedback,
      internName: feedback.intern.name,
      mentor: feedback.mentor.name,
      date: feedback.createdAt.toISOString().split('T')[0],
    }));

    res.json({
      success: true,
      data: {
        feedback: transformedFeedback,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

/**
 * GET /api/feedback/:id
 * Get feedback by ID
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
          },
        },
        mentor: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || feedback.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (!intern || feedback.internId !== intern.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: {
        ...feedback,
        internName: feedback.intern.name,
        mentor: feedback.mentor.name,
        date: feedback.createdAt.toISOString().split('T')[0],
      },
    });
  })
);

/**
 * PUT /api/feedback/:id
 * Update feedback (mentors and admins only)
 */
router.put('/:id',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Get current feedback
    const currentFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!currentFeedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || currentFeedback.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.internId;
    delete updateData.mentorId;
    delete updateData.createdAt;

    const feedback = await prisma.feedback.update({
      where: { id },
      data: updateData,
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
          },
        },
        mentor: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
    });

    logger.info(`Feedback updated for intern: ${feedback.intern.name}`);

    res.json({
      success: true,
      data: {
        ...feedback,
        internName: feedback.intern.name,
        mentor: feedback.mentor.name,
        date: feedback.createdAt.toISOString().split('T')[0],
      },
      message: 'Feedback updated successfully',
    });
  })
);

/**
 * DELETE /api/feedback/:id
 * Delete feedback (mentors and admins only)
 */
router.delete('/:id',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get current feedback
    const currentFeedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
          },
        },
      },
    });

    if (!currentFeedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || currentFeedback.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    await prisma.feedback.delete({
      where: { id },
    });

    logger.info(`Feedback deleted for intern: ${currentFeedback.intern.name}`);

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  })
);

export default router;