import { Router } from 'express';
import { Task, Assignment, Mentor, Intern } from '../models';
import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateTaskSchema, ApiError } from '../types';
import { logger } from '../config/logger';
import { z } from 'zod';

const router = Router();

// Query schema for filtering tasks
const GetTasksQuerySchema = z.object({
  internId: z.string().optional(),
  mentorId: z.string().optional(),
  status: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/',
  authenticate,
  authorize('ADMIN', 'MENTOR'),
  validateBody(CreateTaskSchema),
  asyncHandler(async (req, res) => {
    const { internId, title, description, dueDate, priority } = req.body;

    // Get mentor ID
    let mentorId: string;
    if (req.user!.role === 'ADMIN') {
      // For admin, we need to get the mentor ID from the request or assignment
      const assignment = await Assignment.findOne({
        internId,
        isActive: true,
      }).populate('mentor');
      
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
    const intern = await Intern.findById(internId);

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    // Create task
    const task = new Task({
      internId,
      mentorId,
      title,
      description,
      dueDate,
      priority,
    });
    await task.save();

    await task.populate([
      { path: 'intern', select: 'name internId' },
      { path: 'mentor', select: 'name empId' },
    ]);
    logger.info(`Task created: ${task.title} for intern ${intern.name}`);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  })
);

/**
 * GET /api/tasks
 * Get tasks with filtering
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { internId, mentorId, status, page, limit } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (internId) {
      where.internId = internId;
    }
    
    if (status) {
      where.status = status;
    }

    // For mentors, only show their tasks
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (mentor) {
        where.mentorId = mentor._id;
      }
    }

    if (mentorId && req.user?.role === 'ADMIN') {
      where.mentorId = mentorId;
    }

    // For interns, only show their tasks
    if (req.user?.role === 'INTERN') {
      const intern = await Intern.findOne({ internId: req.user.empId });

      if (intern) {
        where.internId = intern._id;
      }
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      Task.find(where)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate({ path: 'intern', select: 'name internId' })
        .populate({ path: 'mentor', select: 'name empId' }),
      Task.countDocuments(where),
    ]);


    res.json({
      success: true,
      data: {
        tasks,
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
 * GET /api/tasks/:id
 * Get task by ID
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({ path: 'intern', select: 'name internId' })
      .populate({ path: 'mentor', select: 'name empId' });

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || task.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await Intern.findOne({ internId: req.user.empId });

      if (!intern || task.internId.toString() !== intern._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: task,
    });
  })
);

/**
 * PUT /api/tasks/:id
 * Update task status or details
 */
router.put('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Get current task
    const currentTask = await Task.findById(id)
      .populate('intern')
      .populate('mentor');

    if (!currentTask) {
      throw new ApiError('Task not found', 404);
    }

    // Check permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || currentTask.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await Intern.findOne({ internId: req.user.empId });

      if (!intern || currentTask.internId.toString() !== intern._id.toString()) {
        throw new ApiError('Access denied', 403);
      }

      // Interns can only update status
      const allowedFields = ['status'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      updateData = filteredData;
    }

    // Update task
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'intern', select: 'name internId' })
      .populate({ path: 'mentor', select: 'name empId' });

    if (!task) {
      throw new ApiError('Task not found', 404);
    }
    logger.info(`Task updated: ${task.title} - Status: ${task.status}`);

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  })
);

/**
 * DELETE /api/tasks/:id
 * Delete task (mentors and admins only)
 */
router.delete('/:id',
  authenticate,
  authorize('ADMIN', 'MENTOR'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get current task
    const currentTask = await Task.findById(id);

    if (!currentTask) {
      throw new ApiError('Task not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || currentTask.mentorId.toString() !== mentor._id.toString()) {
        throw new ApiError('Access denied', 403);
      }
    }

    await Task.findByIdAndDelete(id);

    logger.info(`Task deleted: ${currentTask.title}`);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  })
);

export default router;