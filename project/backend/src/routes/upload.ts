import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';
import { validateFile } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiError } from '../types';
import { logger } from '../config/logger';
import { UPLOAD_DIR, MAX_FILE_SIZE } from '../config/env';

const router = Router();

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type, applicationId, submissionId } = req.body;
    
    let uploadPath = UPLOAD_DIR;
    
    if (type && applicationId) {
      uploadPath = path.join(UPLOAD_DIR, 'applications', applicationId);
    } else if (submissionId) {
      uploadPath = path.join(UPLOAD_DIR, 'projects', submissionId);
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { type } = req.body;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    
    let filename = `${timestamp}${ext}`;
    
    if (type) {
      filename = `${type}-${timestamp}${ext}`;
    }
    
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF files and common image formats
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError('Invalid file type. Only PDF and image files are allowed.', 400));
    }
  },
});

/**
 * POST /api/upload
 * Upload files (documents, images)
 */
router.post('/',
  authenticate,
  upload.single('file'),
  validateFile({
    required: true,
    maxSize: MAX_FILE_SIZE,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
  }),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }

    const { type, applicationId, submissionId } = req.body;
    
    // Generate file URL
    let fileUrl = `/uploads/${req.file.filename}`;
    
    if (type && applicationId) {
      fileUrl = `/uploads/applications/${applicationId}/${req.file.filename}`;
    } else if (submissionId) {
      fileUrl = `/uploads/projects/${submissionId}/${req.file.filename}`;
    }

    logger.info(`File uploaded: ${req.file.originalname} by user ${req.user?.id}`);

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      message: 'File uploaded successfully',
    });
  })
);

/**
 * GET /api/upload/:filename
 * Serve uploaded files
 */
router.get('/:filename',
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const mimeType = getMimeType(path.extname(filename));
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  })
);

/**
 * GET /api/upload/applications/:applicationId/:filename
 * Serve application documents
 */
router.get('/applications/:applicationId/:filename',
  authenticate,
  asyncHandler(async (req, res) => {
    const { applicationId, filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, 'applications', applicationId, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }
    
    // TODO: Add permission check - user should have access to this application
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const mimeType = getMimeType(path.extname(filename));
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  })
);

/**
 * GET /api/upload/projects/:submissionId/:filename
 * Serve project files
 */
router.get('/projects/:submissionId/:filename',
  authenticate,
  asyncHandler(async (req, res) => {
    const { submissionId, filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, 'projects', submissionId, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }
    
    // TODO: Add permission check - user should have access to this project
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const mimeType = getMimeType(path.extname(filename));
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  })
);

/**
 * DELETE /api/upload/:filename
 * Delete uploaded file
 */
router.delete('/:filename',
  authenticate,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    logger.info(`File deleted: ${filename} by user ${req.user?.id}`);
    
    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  })
);

// Helper function to get MIME type from file extension
function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

export default router;