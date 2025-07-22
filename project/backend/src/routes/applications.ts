import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateApplicationSchema, UpdateApplicationSchema, ApiError } from '../types';
import { logger } from '../config/logger';
import { emitStatusUpdate } from '../services/websocket';

const router = Router();

/**
 * POST /api/applications
 * Submit a new application
 */
router.post('/',
  authenticate,
  authorize('ADMIN', 'EMPLOYEE'),
  validateBody(CreateApplicationSchema),
  asyncHandler(async (req, res) => {
    const { internId } = req.body;

    // Check if intern exists
    const intern = await prisma.intern.findUnique({
      where: { id: internId },
    });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    // Check if application already exists
    const existingApplication = await prisma.application.findFirst({
      where: { internId },
    });

    if (existingApplication) {
      throw new ApiError('Application already exists for this intern', 409);
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        internId,
        status: 'SUBMITTED',
        reviewedBy: req.user!.id,
      },
      include: {
        intern: {
          select: {
            name: true,
            internId: true,
            department: true,
          },
        },
      },
    });

    // Emit status update
    emitStatusUpdate({
      type: 'APPLICATION_STATUS',
      id: application.id,
      status: 'SUBMITTED',
    });

    logger.info(`Application submitted for intern: ${intern.name} (${intern.internId})`);

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  })
);

/**
 * GET /api/applications
 * Get all applications with filtering
 */
router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { status, department } = req.query;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    if (department) {
      where.intern = {
        department,
      };
    }

    // For employees, only show their submitted applications
    if (req.user?.role === 'EMPLOYEE') {
      where.intern = {
        ...where.intern,
        referredByEmpId: req.user.empId,
      };
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        intern: {
          select: {
            id: true,
            internId: true,
            name: true,
            email: true,
            phone: true,
            institute: true,
            course: true,
            semester: true,
            department: true,
            startDate: true,
            endDate: true,
            referredBy: true,
            referredByEmpId: true,
            documents: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: applications,
    });
  })
);

/**
 * GET /api/applications/:id
 * Get application by ID
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        intern: true,
        reviewer: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
    });

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

    // Check access permissions
    if (req.user?.role === 'EMPLOYEE') {
      if (application.intern.referredByEmpId !== req.user.empId) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: application,
    });
  })
);

/**
 * PUT /api/applications/:id
 * Update application status (L&D team only)
 */
router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  validateBody(UpdateApplicationSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    // Update application
    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        reviewNotes,
        reviewedBy: req.user!.id,
      },
      include: {
        intern: {
          select: {
            id: true,
            name: true,
            internId: true,
            department: true,
          },
        },
      },
    });

    // Update intern status if application is approved
    if (status === 'APPROVED') {
      await prisma.intern.update({
        where: { id: application.internId },
        data: { status: 'APPROVED' },
      });
    } else if (status === 'REJECTED') {
      await prisma.intern.update({
        where: { id: application.internId },
        data: { status: 'REJECTED' },
      });
    }

    // Emit status update
    emitStatusUpdate({
      type: 'APPLICATION_STATUS',
      id: application.id,
      status,
    });

    logger.info(`Application ${status.toLowerCase()}: ${application.intern.name} (${application.intern.internId})`);

    res.json({
      success: true,
      data: application,
      message: `Application ${status.toLowerCase()} successfully`,
    });
  })
);

/**
 * GET /api/applications/pending
 * Get pending applications for review
 */
router.get('/status/pending',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const applications = await prisma.application.findMany({
      where: { status: 'SUBMITTED' },
      include: {
        intern: {
          select: {
            id: true,
            internId: true,
            name: true,
            email: true,
            phone: true,
            institute: true,
            course: true,
            semester: true,
            department: true,
            startDate: true,
            endDate: true,
            referredBy: true,
            referredByEmpId: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      data: applications,
    });
  })
);

/**
 * GET /api/applications/intern/:internId
 * Get application by intern ID
 */
router.get('/intern/:internId',
  authenticate,
  asyncHandler(async (req, res) => {
    const { internId } = req.params;

    const application = await prisma.application.findFirst({
      where: { internId },
      include: {
        intern: {
          select: {
            internId: true,
            name: true,
            department: true,
            startDate: true,
            endDate: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            empId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

    // Check access permissions for interns
    if (req.user?.role === 'INTERN') {
      if (req.user.empId !== application.intern.internId) {
        throw new ApiError('Access denied', 403);
      }
    }

    res.json({
      success: true,
      data: application,
    });
  })
);

export default router;