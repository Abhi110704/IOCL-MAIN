import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateProjectSchema, ApiError } from '../types';
import { logger } from '../config/logger';
import { z } from 'zod';

const router = Router();

// Query schema for filtering projects
const GetProjectsQuerySchema = z.object({
  internId: z.string().optional(),
  mentorId: z.string().optional(),
  status: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

/**
 * POST /api/projects
 * Create a new project submission
 */
router.post('/',
  authenticate,
  authorize('INTERN', 'ADMIN'),
  validateBody(CreateProjectSchema),
  asyncHandler(async (req, res) => {
    const { internId, title, description } = req.body;

    // For interns, use their own ID
    let actualInternId = internId;
    if (req.user!.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user!.empId },
      });
      
      if (!intern) {
        throw new ApiError('Intern record not found', 404);
      }
      
      actualInternId = intern.id;
    }

    // Get mentor assignment
    const assignment = await prisma.assignment.findFirst({
      where: { internId: actualInternId, isActive: true },
      include: {
        mentor: true,
        intern: true,
      },
    });

    if (!assignment) {
      throw new ApiError('No active mentor assignment found', 404);
    }

    // Create project submission
    const project = await prisma.project.create({
      data: {
        internId: actualInternId,
        mentorId: assignment.mentorId,
        title,
        description,
      },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
            department: true,
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

    logger.info(`Project submitted: ${project.title} by ${assignment.intern.name}`);

    res.status(201).json({
      success: true,
      data: {
        ...project,
        internName: project.intern.name,
        department: project.intern.department,
        projectTitle: project.title,
        submissionDate: project.submittedAt.toISOString().split('T')[0],
      },
      message: 'Project submitted successfully',
    });
  })
);

/**
 * GET /api/projects
 * Get project submissions with filtering
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

    // For mentors, only show their projects
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

    // For interns, only show their projects
    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (intern) {
        where.internId = intern.id;
      }
    }

    // Get projects with pagination
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          intern: {
            select: {
              name: true,
              internId: true,
              department: true,
            },
          },
          mentor: {
            select: {
              name: true,
              empId: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    // Transform data for frontend
    const transformedProjects = projects.map(project => ({
      ...project,
      internName: project.intern.name,
      department: project.intern.department,
      projectTitle: project.title,
      submissionDate: project.submittedAt.toISOString().split('T')[0],
    }));

    res.json({
      success: true,
      data: {
        projects: transformedProjects,
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
 * GET /api/projects/:id
 * Get project by ID
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
            department: true,
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

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || project.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (!intern || project.internId !== intern.id) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: {
        ...project,
        internName: project.intern.name,
        department: project.intern.department,
        projectTitle: project.title,
        submissionDate: project.submittedAt.toISOString().split('T')[0],
      },
    });
  })
);

/**
 * PUT /api/projects/:id
 * Update project status or details
 */
router.put('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, feedback, grade } = req.body;

    // Get current project
    const currentProject = await prisma.project.findUnique({
      where: { id },
      include: {
        intern: true,
        mentor: true,
      },
    });

    if (!currentProject) {
      throw new ApiError('Project not found', 404);
    }

    // Check permissions - only mentors and admins can update status
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (!mentor || currentProject.mentorId !== mentor.id) {
        throw new ApiError('Access denied', 403);
      }
    } else if (req.user?.role !== 'ADMIN') {
      throw new ApiError('Access denied', 403);
    }

    // Update project
    const updateData: any = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;
    if (grade) updateData.grade = grade;
    if (status === 'APPROVED' || status === 'REJECTED') {
      updateData.reviewedAt = new Date();
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
            department: true,
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

    logger.info(`Project ${status}: ${project.title} by ${project.intern.name}`);

    res.json({
      success: true,
      data: {
        ...project,
        internName: project.intern.name,
        department: project.intern.department,
        projectTitle: project.title,
        submissionDate: project.submittedAt.toISOString().split('T')[0],
      },
      message: `Project ${status?.toLowerCase()} successfully`,
    });
  })
);

/**
 * POST /api/projects/:id/upload
 * Upload project file
 */
router.post('/:id/upload',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get project
    const project = await prisma.project.findUnique({
      where: { id },
      include: { intern: true },
    });

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    // Check permissions - only the intern who owns the project can upload
    if (req.user?.role === 'INTERN') {
      const intern = await prisma.intern.findFirst({
        where: { internId: req.user.empId },
      });

      if (!intern || project.internId !== intern.id) {
        throw new ApiError('Access denied', 403);
      }
    } else if (req.user?.role !== 'ADMIN') {
      throw new ApiError('Access denied', 403);
    }

    // For now, simulate file upload
    const fileUrl = `/uploads/projects/${id}/project-report.pdf`;

    // Update project with file URL
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { fileUrl },
    });

    logger.info(`Project file uploaded: ${project.title}`);

    res.json({
      success: true,
      data: { url: fileUrl },
      message: 'Project file uploaded successfully',
    });
  })
);

export default router;