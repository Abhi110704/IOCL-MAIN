import { Router } from 'express';
import { Application, Intern, User } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/',
  authenticate,
  authorize('EMPLOYEE', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const { internId } = req.body;

    // Check if intern exists
    const intern = await Intern.findById(internId);

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({ internId });

    if (existingApplication) {
      throw new ApiError('Application already exists for this intern', 409);
    }

    // Create application
    const application = new Application({
      internId,
      status: 'SUBMITTED',
      reviewedBy: req.user!.id,
    });
    await application.save();

    await application.populate({
      path: 'intern',
      select: 'name internId department',
    });

    // Emit status update
    emitStatusUpdate({
      type: 'APPLICATION_CREATED',
      data: application,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  })
);

router.get('/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { department } = req.query;
    const where = {};

    if (department) {
      where['intern.department'] = department;
    }

    // For employees, only show their submitted applications
    if (req.user?.role === 'EMPLOYEE') {
      where['intern.referredByEmpId'] = req.user.empId;
    }

    const applications = await Application.find(where)
      .sort({ createdAt: -1 })
      .populate({
        path: 'intern',
        select: 'internId name email phone institute course semester department startDate endDate referredBy referredByEmpId documents',
      })
      .populate({
        path: 'reviewer',
        select: 'name empId',
      });

    // Filter by department if specified
    const filteredApplications = applications.filter(app => {
      if (department && app.intern.department !== department) {
        return false;
      }
      if (req.user?.role === 'EMPLOYEE' && app.intern.referredByEmpId !== req.user.empId) {
        return false;
      }
      return true;
    });

    res.json({
      success: true,
      data: filteredApplications,
    });
  })
);

router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('intern')
      .populate({
        path: 'reviewer',
        select: 'name empId',
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

router.patch('/:id/review',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    // Update application
    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes,
        reviewedBy: req.user!.id,
      },
      { new: true }
    ).populate({
      path: 'intern',
      select: 'name internId department',
    });

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

    // Update intern status if application is approved
    if (status === 'APPROVED') {
      await Intern.findByIdAndUpdate(application.internId, { status: 'APPROVED' });
    } else if (status === 'REJECTED') {
      await Intern.findByIdAndUpdate(application.internId, { status: 'REJECTED' });
    }

    // Emit status update
    emitStatusUpdate({
      type: 'APPLICATION_REVIEWED',
      data: application,
    });

    res.json({
      success: true,
      data: application,
    });
  })
);

router.get('/pending/queue',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ status: 'SUBMITTED' })
      .sort({ createdAt: 1 })
      .populate({
        path: 'intern',
        select: 'internId name email phone institute course semester department startDate endDate referredBy referredByEmpId documents',
      });

    res.json({
      success: true,
      data: applications,
    });
  })
);

router.get('/intern/:internId',
  authenticate,
  asyncHandler(async (req, res) => {
    const { internId } = req.params;

    const application = await Application.findOne({ internId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'intern',
        select: 'internId name department startDate endDate',
      })
      .populate({
        path: 'reviewer',
        select: 'name empId',
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