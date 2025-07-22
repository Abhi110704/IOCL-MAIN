@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Project, Assignment, Mentor, Intern } from '../models';
 import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
@@ .. @@
    // For interns, use their own ID
     let actualInternId = internId;
     if (req.user!.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user!.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user!.empId });
       
       if (!intern) {
         throw new ApiError('Intern record not found', 404);
       }
       
-      actualInternId = intern.id;
+      actualInternId = intern._id.toString();
     }

     // Get mentor assignment
-    const assignment = await prisma.assignment.findFirst({
-      where: { internId: actualInternId, isActive: true },
-      include: {
-        mentor: true,
-        intern: true,
-      },
-    });
+    const assignment = await Assignment.findOne({
+      internId: actualInternId,
+      isActive: true,
+    }).populate(['mentor', 'intern']);

     if (!assignment) {
       throw new ApiError('No active mentor assignment found', 404);
     }

     // Create project submission
-    const project = await prisma.project.create({
-      data: {
-        internId: actualInternId,
-        mentorId: assignment.mentorId,
-        title,
-        description,
-      },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
-            department: true,
-          },
-        },
-        mentor: {
-          select: {
-            name: true,
-            empId: true,
-          },
-        },
-      },
-    });
+    const project = new Project({
+      internId: actualInternId,
+      mentorId: assignment.mentorId,
+      title,
+      description,
+    });
+    await project.save();

+    await project.populate([
+      { path: 'intern', select: 'name internId department' },
+      { path: 'mentor', select: 'name empId' },
+    ]);

     logger.info(`Project submitted: ${project.title} by ${assignment.intern.name}`);
@@ .. @@
    // For mentors, only show their projects
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

       if (mentor) {
-        where.mentorId = mentor.id;
+        where.mentorId = mentor._id;
       }
     }

     if (mentorId && req.user?.role === 'ADMIN') {
@@ .. @@
    // For interns, only show their projects
     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

       if (intern) {
-        where.internId = intern.id;
+        where.internId = intern._id;
       }
     }

     // Get projects with pagination
     const [projects, total] = await Promise.all([
-      prisma.project.findMany({
-        where,
-        skip,
-        take: limit,
-        include: {
-          intern: {
-            select: {
-              name: true,
-              internId: true,
-              department: true,
-            },
-          },
-          mentor: {
-            select: {
-              name: true,
-              empId: true,
-            },
-          },
-        },
-        orderBy: { submittedAt: 'desc' },
-      }),
-      prisma.project.count({ where }),
+      Project.find(where)
+        .skip(skip)
+        .limit(limit)
+        .sort({ submittedAt: -1 })
+        .populate({ path: 'intern', select: 'name internId department' })
+        .populate({ path: 'mentor', select: 'name empId' }),
+      Project.countDocuments(where),
     ]);
@@ .. @@
  asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const project = await prisma.project.findUnique({
-      where: { id },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
-            department: true,
-          },
-        },
-        mentor: {
-          select: {
-            name: true,
-            empId: true,
-          },
-        },
-      },
-    });
+    const project = await Project.findById(id)
+      .populate({ path: 'intern', select: 'name internId department' })
+      .populate({ path: 'mentor', select: 'name empId' });

     if (!project) {
       throw new ApiError('Project not found', 404);
     }

     // Check access permissions
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || project.mentorId !== mentor.id) {
+      if (!mentor || project.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

-      if (!intern || project.internId !== intern.id) {
+      if (!intern || project.internId.toString() !== intern._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }
@@ .. @@
    const { status, feedback, grade } = req.body;

     // Get current project
-    const currentProject = await prisma.project.findUnique({
-      where: { id },
-      include: {
-        intern: true,
-        mentor: true,
-      },
-    });
+    const currentProject = await Project.findById(id)
+      .populate('intern')
+      .populate('mentor');

     if (!currentProject) {
       throw new ApiError('Project not found', 404);
     }

     // Check permissions - only mentors and admins can update status
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || currentProject.mentorId !== mentor.id) {
+      if (!mentor || currentProject.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     } else if (req.user?.role !== 'ADMIN') {
@@ .. @@
      updateData.reviewedAt = new Date();
     }

-    const project = await prisma.project.update({
-      where: { id },
-      data: updateData,
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
-            department: true,
-          },
-        },
-        mentor: {
-          select: {
-            name: true,
-            empId: true,
-          },
-        },
-      },
-    });
+    const project = await Project.findByIdAndUpdate(id, updateData, { new: true })
+      .populate({ path: 'intern', select: 'name internId department' })
+      .populate({ path: 'mentor', select: 'name empId' });

+    if (!project) {
+      throw new ApiError('Project not found', 404);
+    }

     logger.info(`Project ${status}: ${project.title} by ${project.intern.name}`);
@@ .. @@
    const { id } = req.params;

     // Get project
-    const project = await prisma.project.findUnique({
-      where: { id },
-      include: { intern: true },
-    });
+    const project = await Project.findById(id).populate('intern');

     if (!project) {
       throw new ApiError('Project not found', 404);
     }

     // Check permissions - only the intern who owns the project can upload
     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

-      if (!intern || project.internId !== intern.id) {
+      if (!intern || project.internId.toString() !== intern._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     } else if (req.user?.role !== 'ADMIN') {
@@ .. @@
    const fileUrl = `/uploads/projects/${id}/project-report.pdf`;

     // Update project with file URL
-    const updatedProject = await prisma.project.update({
-      where: { id },
-      data: { fileUrl },
-    });
+    const updatedProject = await Project.findByIdAndUpdate(
+      id,
+      { fileUrl },
+      { new: true }
+    );

     logger.info(`Project file uploaded: ${project.title}`);