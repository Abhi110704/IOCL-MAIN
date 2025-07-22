import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { Application, Project } from '../models';
import { authenticate, authorize } from '../middleware/auth';

  asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    // Get application with intern details
    const application = await Application.findById(applicationId)
      .populate('intern');

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

 asyncHandler(async (req, res) => {
    const { submissionId } = req.params;

    // Get project submission with intern and mentor details
    const submission = await Project.findById(submissionId)
      .populate('intern')
      .populate('mentor');

    if (!submission) {
      throw new ApiError('Project submission not found', 404);
    }

 asyncHandler(async (req, res) => {
    const { internId } = req.params;

    // Find intern
    const intern = await Intern.findOne({ internId });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    // Check if user has access
    if (req.user?.role === 'INTERN' && req.user.empId !== internId) {
      throw new ApiError('Access denied', 403);
    }

    // Find approved project
    const approvedProject = await Project.findOne({
        internId: intern._id,
        status: 'APPROVED',
      })
      .populate('mentor');

    if (!approvedProject) {
      throw new ApiError('No approved project found for certificate generation', 404);
    }
  })
 })
})