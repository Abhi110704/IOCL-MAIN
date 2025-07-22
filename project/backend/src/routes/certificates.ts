import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { Application, Project, Intern } from '../models';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../types';
import { logger } from '../config/logger';

const router = Router();

/**
 * GET /api/certificates/approval-letter/:applicationId
 * Generate approval letter PDF
 */
router.get('/approval-letter/:applicationId',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    // Get application with intern details
    const application = await Application.findById(applicationId)
      .populate('intern');

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

    if (application.status !== 'APPROVED') {
      throw new ApiError('Application must be approved to generate approval letter', 400);
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="approval-letter-${application.intern.internId}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add letterhead
    doc.fontSize(20).text('INDIAN OIL CORPORATION LIMITED', { align: 'center' });
    doc.fontSize(14).text('Pipelines Division, Noida', { align: 'center' });
    doc.moveDown(2);

    // Add reference and date
    const currentDate = new Date().toLocaleDateString('en-IN');
    doc.fontSize(12);
    doc.text(`Ref. No: PL/TRG/15`, 50, doc.y);
    doc.text(`Date: ${currentDate}`, 400, doc.y - 15);
    doc.moveDown(2);

    // Add recipient
    doc.text('To');
    doc.text(`${application.intern.name}'s Institute`);
    doc.moveDown(1);

    // Add subject
    doc.fontSize(14).text('Sub: Approval for Industrial Internship', { underline: true, align: 'center' });
    doc.moveDown(1);

    // Add salutation
    doc.fontSize(12).text('Sir/Ma\'am,');
    doc.moveDown(1);

    // Add main content
    doc.text(`We are pleased to inform you that IndianOil Management has accorded the approval for Mr./Ms. ${application.intern.name}, to undertake industrial internship from ${new Date(application.intern.startDate).toLocaleDateString('en-IN')} to ${new Date(application.intern.endDate).toLocaleDateString('en-IN')} at Indian Oil Corporation Ltd., Pipelines Division, Noida. During the internship, the student will be assigned a Project under the ${application.intern.department} Department, subject to the following conditions:`);
    doc.moveDown(1);

    // Add conditions
    const conditions = [
      'That this arrangement shall be purely temporary in nature and the student will not be allowed to continue beyond the specified end date.',
      'The student will arrange on their own, requisite facility for virtual meeting.',
      'That the student concerned should not have any claim for employment in Corporation during / after completion of training.',
      'That the student concerned shall not be entitled to any benefit, whatsoever from the Corporation.',
      'That the training of the student concerned shall be governed by the rules prescribed in this regard by the management for timings, accessibility of records, discipline etc.',
      'That the Corporation shall not be responsible for delay in completion of aforesaid training.',
      'That the student shall submit a copy of his/her project with the respective officer, under whose supervision he/she shall undergo his/her training.',
      'That the student shall not be allowed to include / write anything in study report, which is detrimental to the interest of the Corporation.',
      'That the student concerned should bear all type of expenses related to his/her project.',
      'If, at any stage, it is found that student is indulging in activities, which are detrimental to the interest of the Corporation, the student shall not be allowed to continue with his/her training.',
      'Copyright in any document whether in form of project report, research document or otherwise, developed by the Intern during period of his/her internship and connected to his/her internship with IOCL shall be owned exclusively by IOCL and IOCL shall be free to use the same in any manner whatsoever. However, Intern shall have a right to use the same for non-commercial academic purposes.'
    ];

    conditions.forEach((condition, index) => {
      doc.text(`${index + 1}. ${condition}`, { indent: 20 });
      doc.moveDown(0.5);
    });

    doc.moveDown(1);
    doc.text('Thanking you.');
    doc.moveDown(2);

    // Add signature section
    doc.text(`Date: ${currentDate}`, 50, doc.y);
    doc.text('(Digitally/uploaded signature of L&D section head with designation)', 300, doc.y - 15);

    // Finalize PDF
    doc.end();

    logger.info(`Approval letter generated for application: ${applicationId}`);
  })
);

/**
 * GET /api/certificates/completion-certificate/:submissionId
 * Generate completion certificate PDF
 */
router.get('/completion-certificate/:submissionId',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const { submissionId } = req.params;

    // Get project submission with intern and mentor details
    const submission = await Project.findById(submissionId)
      .populate('intern')
      .populate('mentor');

    if (!submission) {
      throw new ApiError('Project submission not found', 404);
    }

    if (submission.status !== 'APPROVED') {
      throw new ApiError('Project must be approved to generate completion certificate', 400);
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="completion-certificate-${submission.intern.internId}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add decorative border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

    // Add letterhead
    doc.fontSize(24).text('INDIAN OIL CORPORATION LIMITED', { align: 'center' });
    doc.fontSize(16).text('Pipelines Division, Noida', { align: 'center' });
    doc.moveDown(2);

    // Add certificate title
    doc.fontSize(22).text('INDUSTRIAL INTERNSHIP COMPLETION CERTIFICATE', { align: 'center', underline: true });
    doc.moveDown(2);

    // Add recipient
    doc.fontSize(14).text('To');
    doc.text(`${submission.intern.name}'s Institute`);
    doc.moveDown(1);

    // Add main content
    doc.text(`This is to certify that the below student has successfully completed the Industrial Internship Project for the period from ${new Date(submission.intern.startDate).toLocaleDateString('en-IN')} to ${new Date(submission.intern.endDate).toLocaleDateString('en-IN')} at Indian Oil Corporation Limited, Pipelines Division, Noida.`);
    doc.moveDown(2);

    // Add details table
    const details = [
      ['Name of the Student', submission.intern.name],
      ['Intern ID', submission.intern.internId],
      ['Department', submission.intern.department],
      ['Project Title', submission.title],
      ['Grade', submission.grade || 'N/A'],
      ['Name of the Industry Mentor', submission.mentor.name],
      ['Email ID of the Industry Mentor', submission.mentor.email],
      ['Contact No of the Industry Mentor', submission.mentor.phone || 'N/A'],
    ];

    // Create table
    const tableTop = doc.y;
    const tableLeft = 80;
    const colWidth = 200;
    const rowHeight = 25;

    // Table headers
    doc.rect(tableLeft, tableTop, colWidth, rowHeight).stroke();
    doc.rect(tableLeft + colWidth, tableTop, colWidth, rowHeight).stroke();
    doc.fontSize(12).text('Particulars', tableLeft + 10, tableTop + 8);
    doc.text('Details', tableLeft + colWidth + 10, tableTop + 8);

    // Table rows
    details.forEach((row, index) => {
      const y = tableTop + (index + 1) * rowHeight;
      doc.rect(tableLeft, y, colWidth, rowHeight).stroke();
      doc.rect(tableLeft + colWidth, y, colWidth, rowHeight).stroke();
      doc.text(row[0], tableLeft + 10, y + 8);
      doc.text(row[1], tableLeft + colWidth + 10, y + 8);
    });

    doc.y = tableTop + (details.length + 1) * rowHeight + 20;

    // Add closing statement
    doc.fontSize(14).text('We wish him/her all the best in his/her future endeavors.');
    doc.moveDown(3);

    // Add signature section
    const currentDate = new Date().toLocaleDateString('en-IN');
    doc.text(`Date: ${currentDate}`, 80, doc.y);
    doc.text('OFFICIAL SEAL', 250, doc.y);
    doc.text('(Digitally/uploaded signature of L&D section head with designation)', 350, doc.y);

    // Finalize PDF
    doc.end();

    logger.info(`Completion certificate generated for submission: ${submissionId}`);
  })
);

/**
 * GET /api/certificates/intern/:internId
 * Generate certificate for intern (based on their project status)
 */
router.get('/intern/:internId',
  authenticate,
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

    // Generate completion certificate
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="completion-certificate-${internId}.pdf"`);
    
    doc.pipe(res);

    // Add certificate content (similar to above)
    doc.fontSize(24).text('COMPLETION CERTIFICATE', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(16).text(`This certifies that ${intern.name} has successfully completed the internship program.`);
    doc.moveDown(1);
    doc.text(`Project: ${approvedProject.title}`);
    doc.text(`Grade: ${approvedProject.grade || 'Pass'}`);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);

    doc.end();

    logger.info(`Certificate generated for intern: ${internId}`);
  })
);

export default router;