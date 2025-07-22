import { Router } from 'express';
import { Intern, Application, Assignment, Mentor } from '../models';
import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN']), 
  asyncHandler(async (req, res) => {
    const internData = req.body;

    // Generate unique intern ID
    const internId = `IOCL-${Date.now().toString().slice(-6)}`;

    // Create intern record
    const intern = new Intern({
      ...internData,
      internId,
      documents: internData.documents || {},
    });
    await intern.save();

    // Create initial application record
    const application = new Application({
      internId: intern._id,
      status: 'SUBMITTED',
    });
    await application.save();

    logger.info(`New intern created: ${intern.name} (${intern.internId})`);

    res.status(201).json({
      success: true,
      data: intern,
    });
  })
);

router.get('/', authenticate, 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, status, mentorId } = req.query;
    const skip = (page - 1) * limit;

    let where = {};

    if (search) {
      where.$or = [
        { name: { $regex: search, $options: 'i' } },
        { internId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // For mentors, only show their assigned interns
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (mentor) {
        const assignments = await Assignment.find({
          mentorId: mentor._id,
          isActive: true,
        }).select('internId');

        where._id = {
          $in: assignments.map(a => a.internId),
        };
      }
    }

    if (mentorId && req.user?.role === 'ADMIN') {
      const assignments = await Assignment.find({
        mentorId,
        isActive: true,
      }).select('internId');

      where._id = {
        $in: assignments.map(a => a.internId),
      };
    }

    // Get interns with pagination
    const [interns, total] = await Promise.all([
      Intern.find(where)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: 'assignments',
          match: { isActive: true },
          populate: {
            path: 'mentor',
            select: 'name empId department',
          },
        })
        .populate({
          path: 'applications',
          options: { sort: { createdAt: -1 }, limit: 1 },
        }),
      Intern.countDocuments(where),
    ]);

    res.json({
      success: true,
      data: {
        interns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

router.get('/:id', authenticate, authorizeMentorAccess,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const intern = await Intern.findById(id)
      .populate({
        path: 'assignments',
        match: { isActive: true },
        populate: {
          path: 'mentor',
          select: 'name empId department email phone',
        },
      })
      .populate({
        path: 'applications',
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'feedback',
        populate: {
          path: 'mentor',
          select: 'name empId',
        },
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'tasks',
        populate: {
          path: 'mentor',
          select: 'name empId',
        },
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'projects',
        populate: {
          path: 'mentor',
          select: 'name empId',
        },
        options: { sort: { submittedAt: -1 } },
      })
      .populate({
        path: 'meetings',
        populate: {
          path: 'mentor',
          select: 'name empId',
        },
        options: { sort: { date: -1 } },
      });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    res.json({
      success: true,
      data: intern,
    });
  })
);

router.put('/:id', authenticate, authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated
    delete updateData.internId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const intern = await Intern.findByIdAndUpdate(id, updateData, { new: true });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    logger.info(`Intern updated: ${intern.name} (${intern.internId})`);

    res.json({
      success: true,
      data: intern,
    });
  })
);

router.delete('/:id', authenticate, authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Soft delete by updating status
    const intern = await Intern.findByIdAndUpdate(
      id,
      { status: 'REJECTED' },
      { new: true }
    );

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    logger.info(`Intern deleted: ${intern.name} (${intern.internId})`);

    res.json({
      success: true,
      message: 'Intern deleted successfully',
    });
  })
);

router.get('/:id/documents', authenticate, authorizeMentorAccess,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const intern = await Intern.findById(id).select('name internId documents');

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    res.json({
      success: true,
      data: {
        internId: intern.internId,
        name: intern.name,
        documents: intern.documents,
      },
    });
  })
);

export default router;