@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Feedback, Assignment, Mentor, Intern } from '../models';
 import { authenticate, authorize } from '../middleware/auth';
@@ .. @@
    let mentorId: string;
     if (req.user!.role === 'ADMIN') {
       // For admin, get the mentor from assignment
-      const assignment = await prisma.assignment.findFirst({
-        where: { internId, isActive: true },
-      });
+      const assignment = await Assignment.findOne({
+        internId,
+        isActive: true,
+      });
       
       if (!assignment) {
         throw new ApiError('No active mentor assignment found for this intern', 404);
       }
       
-      mentorId = assignment.mentorId;
+      mentorId = assignment.mentorId.toString();
     } else {
       // For mentor, get their mentor record
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user!.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user!.empId });
       
       if (!mentor) {
         throw new ApiError('Mentor record not found', 404);
       }
       
-      mentorId = mentor.id;
+      mentorId = mentor._id.toString();
     }

     // Verify intern exists and is assigned to this mentor
-    const assignment = await prisma.assignment.findFirst({
-      where: { internId, mentorId, isActive: true },
-      include: { intern: true },
-    });
+    const assignment = await Assignment.findOne({
+      internId,
+      mentorId,
+      isActive: true,
+    }).populate('intern');

     if (!assignment) {
       throw new ApiError('Intern not assigned to this mentor', 403);
     }

     // Create feedback
-    const feedback = await prisma.feedback.create({
-      data: {
-        internId,
-        mentorId,
-        rating,
-        communication,
-        technical,
-        teamwork,
-        initiative,
-        comments,
-      },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
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
+    const feedback = new Feedback({
+      internId,
+      mentorId,
+      rating,
+      communication,
+      technical,
+      teamwork,
+      initiative,
+      comments,
+    });
+    await feedback.save();

+    await feedback.populate([
+      { path: 'intern', select: 'name internId' },
+      { path: 'mentor', select: 'name empId' },
+    ]);

     logger.info(`Feedback created for intern: ${assignment.intern.name} by ${feedback.mentor.name}`);
@@ .. @@
    // For mentors, only show their feedback
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
    // For interns, only show their feedback
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

     // Get feedback with pagination
     const [feedbackList, total] = await Promise.all([
-      prisma.feedback.findMany({
-        where,
-        skip,
-        take: limit,
-        include: {
-          intern: {
-            select: {
-              name: true,
-              internId: true,
-            },
-          },
-          mentor: {
-            select: {
-              name: true,
-              empId: true,
-            },
-          },
-        },
-        orderBy: { createdAt: 'desc' },
-      }),
-      prisma.feedback.count({ where }),
+      Feedback.find(where)
+        .skip(skip)
+        .limit(limit)
+        .sort({ createdAt: -1 })
+        .populate({ path: 'intern', select: 'name internId' })
+        .populate({ path: 'mentor', select: 'name empId' }),
+      Feedback.countDocuments(where),
     ]);
@@ .. @@
  asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const feedback = await prisma.feedback.findUnique({
-      where: { id },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
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
+    const feedback = await Feedback.findById(id)
+      .populate({ path: 'intern', select: 'name internId' })
+      .populate({ path: 'mentor', select: 'name empId' });

     if (!feedback) {
       throw new ApiError('Feedback not found', 404);
     }

     // Check access permissions
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || feedback.mentorId !== mentor.id) {
+      if (!mentor || feedback.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

-      if (!intern || feedback.internId !== intern.id) {
+      if (!intern || feedback.internId.toString() !== intern._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }
@@ .. @@
    const updateData = req.body;

     // Get current feedback
-    const currentFeedback = await prisma.feedback.findUnique({
-      where: { id },
-    });
+    const currentFeedback = await Feedback.findById(id);

     if (!currentFeedback) {
       throw new ApiError('Feedback not found', 404);
     }

     // Check permissions for mentors
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || currentFeedback.mentorId !== mentor.id) {
+      if (!mentor || currentFeedback.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

     // Remove fields that shouldn't be updated
@@ .. @@
    delete updateData.createdAt;

-    const feedback = await prisma.feedback.update({
-      where: { id },
-      data: updateData,
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
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
+    const feedback = await Feedback.findByIdAndUpdate(id, updateData, { new: true })
+      .populate({ path: 'intern', select: 'name internId' })
+      .populate({ path: 'mentor', select: 'name empId' });

+    if (!feedback) {
+      throw new ApiError('Feedback not found', 404);
+    }

     logger.info(`Feedback updated for intern: ${feedback.intern.name}`);
@@ .. @@
   const { id } = req.params;

     // Get current feedback
-    const currentFeedback = await prisma.feedback.findUnique({
-      where: { id },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
-          },
-        },
-      },
-    });
+    const currentFeedback = await Feedback.findById(id)
+      .populate({ path: 'intern', select: 'name internId' });

     if (!currentFeedback) {
       throw new ApiError('Feedback not found', 404);
     }

     // Check permissions for mentors
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || currentFeedback.mentorId !== mentor.id) {
+      if (!mentor || currentFeedback.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

-    await prisma.feedback.delete({
-      where: { id },
-    });
+    await Feedback.findByIdAndDelete(id);

     logger.info(`Feedback deleted for intern: ${currentFeedback.intern.name}`);