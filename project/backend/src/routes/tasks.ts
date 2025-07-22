import { Router } from 'express';
import { prisma } from '../config/database';
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
      const assignment = await prisma.assignment.findFirst({
        where: { internId, isActive: true },
        include: { mentor: true },
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
    const intern = await prisma.intern.findUnique({
      where: { id: internId },
    });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        internId,
        mentorId,
        title,
        description,
        dueDate,
        priority,
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

    logger.info(`Task created: ${task.title} for intern ${intern.name}`);

    res.status(201).json({
      success: true,
      data: {
        ...task,
        internName: task.intern.name,
        assignedBy: task.mentor.name,
      },
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
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (internId) {
      where.internId = internId;
    }
    
    if (status) {
      where.status = status;
    }

    // For mentors, only show their tasks
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

    // For interns, only show their tasks
    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (intern) {
        where.internId = intern.id;
      }
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
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
      prisma.task.count({ where }),
    ]);

    // Transform data for frontend
    const transformedTasks = tasks.map(task => ({
      ...task,
      internName: task.intern.name,
      assignedBy: task.mentor.name,
    }));

    res.json({
      success: true,
      data: {
        tasks: transformedTasks,
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
 * GET /api/tasks/:id
 * Get task by ID
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
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

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || task.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (!intern || task.internId !== intern.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: {
        ...task,
        internName: task.intern.name,
        assignedBy: task.mentor.name,
      },
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
    const currentTask = await prisma.task.findUnique({
      where: { id },
      include: {
        intern: true,
        mentor: true,
      },
    });

    if (!currentTask) {
      throw new ApiError('Task not found', 404);
    }

    // Check permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || currentTask.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (!intern || currentTask.internId !== intern.id) {
        throw new ApiError('Access denied', 403);
      }

      // Interns can only update status
      const allowedFields = ['status'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      updateData = filteredData;
    }

    // Update task
    const task = await prisma.task.update({
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

    logger.info(`Task updated: ${task.title} - Status: ${task.status}`);

    res.json({
      success: true,
      data: {
        ...task,
        internName: task.intern.name,
        assignedBy: task.mentor.name,
      },
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
    const currentTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!currentTask) {
      throw new ApiError('Task not found', 404);
    }

    // Check permissions for mentors
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || currentTask.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    await prisma.task.delete({
      where: { id },
    });

    logger.info(`Task deleted: ${currentTask.title}`);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  })
);

export default router;