import { Router } from 'express';
import { Feedback, Assignment, Mentor, Intern } from '../models';
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
      const assignment = await Assignment.findOne({
        internId,
        isActive: true,
      });
      
      if (!assignment) {
        throw new ApiError('No active mentor assignment found for this intern', 404);
      }
      
      mentorId = assignment.mentorId.toString();
    } else {
      // For mentor, get their mentor record
      const mentor = await Mentor.findOne({ empId: req.user!.empId });
      
      if (!mentor) {
        throw new ApiError('Mentor record not found', 404);
      }
      
      mentorId = mentor._id.toString();
    }

    // Verify intern exists and is assigned to this mentor
    const assignment = await Assignment.findOne({
      internId,
      mentorId,
      isActive: true,
    }).populate('intern');

    if (!assignment) {
      throw new ApiError('Intern not assigned to this mentor', 403);
    }

    // Create feedback
    const feedback = new Feedback({
      internId,
      mentorId,
      rating,
      communication,
      technical,
      teamwork,
      initiative,
      comments,
    });
    await feedback.save();

    await feedback.populate([
      { path: 'intern', select: 'name internId' },
      { path: 'mentor', select: 'name empId' },
    ]);
    logger.info(`Feedback created for intern: ${assignment.intern.name} by ${feedback.mentor.name}`);

    res.status(201).json({
      success: true,
      data: feedback,
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
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (internId) {
      where.internId = internId;
    }

    // For mentors, only show their feedback
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (mentor) {
        where.mentorId = mentor._id;
      }
    }

    if (mentorId && req.user?.role === 'ADMIN') {
      where.mentorId = mentorId;
    }

    // For interns, only show their feedback
    if (req.user?.role === 'INTERN') {
      const intern = await Intern.findOne({ internId: req.user.empId });

      if (intern) {
        where.internId = intern._id;
      }
    }

    // Get feedback with pagination
    const [feedbackList, total] = await Promise.all([
      Feedback.find(where)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate({ path: 'intern', select: 'name internId' })
        .populate({ path: 'mentor', select: 'name empId' }),
      Feedback.countDocuments(where),
    ]);


    res.json({
      success: true,
      data: {
        feedback: feedbackList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
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

    const feedback = await Feedback.findById(id)
      .populate({ path: 'intern', select: 'name internId' })
      .populate({ path: 'mentor', select: 'name empId' });

    if (!feedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || feedback.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await Intern.findOne({ internId: req.user.empId });

      if (!intern || feedback.internId.toString() !== intern._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: feedback,
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
    const currentFeedback = await Feedback.findById(id);

    if (!currentFeedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || currentFeedback.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    // Remove fields that shouldn't be updated
    delete updateData.internId;
    delete updateData.mentorId;
    delete updateData.createdAt;

    const feedback = await Feedback.findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'intern', select: 'name internId' })
      .populate({ path: 'mentor', select: 'name empId' });

    if (!feedback) {
      throw new ApiError('Feedback not found', 404);
    }
    logger.info(`Feedback updated for intern: ${feedback.intern.name}`);

    res.json({
      success: true,
      data: feedback,
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
    const currentFeedback = await Feedback.findById(id)
      .populate({ path: 'intern', select: 'name internId' });

    if (!currentFeedback) {
      throw new ApiError('Feedback not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || currentFeedback.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    await Feedback.findByIdAndDelete(id);

    logger.info(`Feedback deleted for intern: ${currentFeedback.intern.name}`);

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  })
);

export default router;