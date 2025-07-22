import { Router } from 'express';
import { Mentor, Assignment, Intern } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all mentors with filtering
router.get(
  '/',
  authenticate,
  authorize(['ADMIN', 'HR']),
  asyncHandler(async (req, res) => {
    const { department, availability } = req.query;
    const where = {};

    if (department) {
      where.department = department;
    }

    if (availability) {
      where.availability = availability;
    }

    const mentors = await Mentor.find(where)
      .sort({ name: 1 })
      .populate({
        path: 'assignments',
        match: { isActive: true },
        populate: {
          path: 'intern',
          select: 'name internId startDate endDate',
        },
      });

    // Calculate current intern count and update availability
    const mentorsWithUpdatedInfo = await Promise.all(
      mentors.map(async (mentor) => {
        const currentInterns = await Assignment.countDocuments({
          mentorId: mentor._id,
          isActive: true,
        });
        
        // Update current intern count if it's different
        if (mentor.currentInterns !== currentInterns) {
          await Mentor.findByIdAndUpdate(mentor._id, { currentInterns });
        }

        // Determine availability based on capacity
        let availability = mentor.availability;
        if (currentInterns >= mentor.maxCapacity) {
          availability = 'FULL';
        } else if (currentInterns > 0) {
          availability = 'BUSY';
        } else {
          availability = 'AVAILABLE';
        }

        return {
          ...mentor,
          currentInterns,
          availability,
          internDurations: mentor.assignments?.map(assignment => ({
            internName: assignment.intern.name,
            internId: assignment.intern.internId,
            startDate: assignment.intern.startDate.toISOString().split('T')[0],
            endDate: assignment.intern.endDate.toISOString().split('T')[0],
          })) || [],
        };
      })
    );

    res.json({
      success: true,
      data: mentorsWithUpdatedInfo,
    });
  })
);

// Get available mentors by department
router.get(
  '/available/:department',
  authenticate,
  authorize(['ADMIN', 'HR']),
  asyncHandler(async (req, res) => {
    const { department } = req.params;

    const mentors = await Mentor.find({
        department,
        availability: {
          $in: ['AVAILABLE', 'BUSY'],
        },
      })
      .sort({ currentInterns: 1, name: 1 })
      .populate({
        path: 'assignments',
        match: { isActive: true },
        populate: {
          path: 'intern',
          select: 'name internId startDate endDate',
        },
      });

    // Filter mentors who have capacity
    const availableMentors = [];
    
    for (const mentor of mentors) {
      const currentInterns = await Assignment.countDocuments({
        mentorId: mentor._id,
        isActive: true,
      });
      
      if (currentInterns < mentor.maxCapacity) {
        availableMentors.push({
          ...mentor.toObject(),
          currentInterns,
          internDurations: mentor.assignments?.map(assignment => ({
            internName: assignment.intern.name,
            internId: assignment.intern.internId,
            startDate: assignment.intern.startDate.toISOString().split('T')[0],
            endDate: assignment.intern.endDate.toISOString().split('T')[0],
          })) || [],
        });
      }
    }

    res.json({
      success: true,
      data: availableMentors,
    });
  })
);

// Create new mentor
router.post(
  '/',
  authenticate,
  authorize(['ADMIN', 'HR']),
  asyncHandler(async (req, res) => {
    const mentorData = req.body;

    // Check if mentor with empId already exists
    const existingMentor = await Mentor.findOne({ empId: mentorData.empId });

    if (existingMentor) {
      throw new ApiError('Mentor with this employee ID already exists', 409);
    }

    const mentor = new Mentor(mentorData);
    await mentor.save();

    logger.info(`New mentor created: ${mentor.name} (${mentor.empId})`);

    res.status(201).json({
      success: true,
      data: mentor,
    });
  })
);

// Update mentor
router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN', 'HR']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const mentor = await Mentor.findByIdAndUpdate(id, updateData, { new: true });

    if (!mentor) {
      throw new ApiError('Mentor not found', 404);
    }

    logger.info(`Mentor updated: ${mentor.name} (${mentor.empId})`);

    res.json({
      success: true,
      data: mentor,
    });
  })
);

// Delete mentor
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check for active assignments
    const activeAssignments = await Assignment.countDocuments({
      mentorId: id,
      isActive: true,
    });

    if (activeAssignments > 0) {
      throw new ApiError('Cannot delete mentor with active assignments', 400);
    }

    const mentor = await Mentor.findByIdAndDelete(id);

    if (!mentor) {
      throw new ApiError('Mentor not found', 404);
    }

    logger.info(`Mentor deleted: ${mentor.name} (${mentor.empId})`);

    res.json({
      success: true,
      message: 'Mentor deleted successfully',
    });
  })
);

// Assign mentor to intern
router.post(
  '/assign',
  authenticate,
  authorize(['ADMIN', 'HR']),
  asyncHandler(async (req, res) => {
    const { internId, mentorId, department } = req.body;

    // Check if intern exists and is approved
    const intern = await Intern.findById(internId);

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    if (intern.status !== 'APPROVED') {
      throw new ApiError('Intern must be approved before mentor assignment', 400);
    }

    // Check if mentor exists and has capacity
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      throw new ApiError('Mentor not found', 404);
    }

    const currentAssignments = await Assignment.countDocuments({
      mentorId: mentor._id,
      isActive: true,
    });

    if (currentAssignments >= mentor.maxCapacity) {
      throw new ApiError('Mentor has reached maximum capacity', 400);
    }

    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({
      internId,
      isActive: true,
    });

    if (existingAssignment) {
      throw new ApiError('Intern already has an active mentor assignment', 409);
    }

    // Create assignment
    const assignment = new Assignment({
      internId,
      mentorId,
      department,
    });
    await assignment.save();

    await assignment.populate([
      { path: 'intern', select: 'name internId' },
      { path: 'mentor', select: 'name empId' },
    ]);

    // Update intern status to active
    await Intern.findByIdAndUpdate(internId, { status: 'ACTIVE' });

    // Update mentor's current intern count
    await Mentor.findByIdAndUpdate(mentorId, {
      currentInterns: currentAssignments + 1,
    });

    logger.info(`Mentor assigned: ${mentor.name} -> ${intern.name} (${intern.internId})`);

    res.status(201).json({
      success: true,
      data: assignment,
    });
  })
);

// Get mentor's assigned interns
router.get(
  '/:id/interns',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if user is the mentor or admin
    if (req.user?.role === 'MENTOR') {
      const mentor = await Mentor.findOne({ empId: req.user.empId });

      if (!mentor || mentor._id.toString() !== id) {
        throw new ApiError('Access denied', 403);
      }
    } else if (req.user?.role !== 'ADMIN') {
      throw new ApiError('Access denied', 403);
    }

    const assignments = await Assignment.find({
      mentorId: id,
      isActive: true,
    })
      .sort({ assignedAt: -1 })
      .populate({
        path: 'intern',
        populate: [
          {
            path: 'tasks',
            match: { mentorId: id },
            options: { sort: { createdAt: -1 } },
          },
          {
            path: 'feedback',
            match: { mentorId: id },
            options: { sort: { createdAt: -1 } },
          },
          {
            path: 'projects',
            match: { mentorId: id },
            options: { sort: { submittedAt: -1 } },
          },
          {
            path: 'meetings',
            match: { mentorId: id },
            options: { sort: { date: -1 } },
          },
        ],
      });

    const interns = assignments.map(assignment => ({
      ...assignment.intern,
      assignedAt: assignment.assignedAt,
    }));

    res.json({
      success: true,
      data: interns,
    });
  })
);

export default router;