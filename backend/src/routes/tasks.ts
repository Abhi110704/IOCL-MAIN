@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Task, Assignment, Mentor, Intern } from '../models';
 import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
@@ .. @@
     let mentorId: string;
     if (req.user!.role === 'ADMIN') {
       // For admin, we need to get the mentor ID from the request or assignment
-      const assignment = await prisma.assignment.findFirst({
-        where: { internId, isActive: true },
-        include: { mentor: true },
-      });
+      const assignment = await Assignment.findOne({
+        internId,
+        isActive: true,
+      }).populate('mentor');
       
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
-    const intern = await prisma.intern.findUnique({
-      where: { id: internId },
-    });
+    const intern = await Intern.findById(internId);

     if (!intern) {
       throw new ApiError('Intern not found', 404);
     }

     // Create task
-    const task = await prisma.task.create({
-      data: {
-        internId,
-        mentorId,
-        title,
-        description,
-        dueDate,
-        priority,
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
+    const task = new Task({
+      internId,
+      mentorId,
+      title,
+      description,
+      dueDate,
+      priority,
+    });
+    await task.save();

+    await task.populate([
+      { path: 'intern', select: 'name internId' },
+      { path: 'mentor', select: 'name empId' },
+    ]);

     logger.info(`Task created: ${task.title} for intern ${intern.name}`);
@@ .. @@
     // For mentors, only show their tasks
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
     // For interns, only show their tasks
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

     // Get tasks with pagination
     const [tasks, total] = await Promise.all([
-      prisma.task.findMany({
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
-      prisma.task.count({ where }),
+      Task.find(where)
+        .skip(skip)
+        .limit(limit)
+        .sort({ createdAt: -1 })
+        .populate({ path: 'intern', select: 'name internId' })
+        .populate({ path: 'mentor', select: 'name empId' }),
+      Task.countDocuments(where),
     ]);
@@ .. @@
   asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const task = await prisma.task.findUnique({
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
+    const task = await Task.findById(id)
+      .populate({ path: 'intern', select: 'name internId' })
+      .populate({ path: 'mentor', select: 'name empId' });

     if (!task) {
       throw new ApiError('Task not found', 404);
     }

     // Check access permissions
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || task.mentorId !== mentor.id) {
+      if (!mentor || task.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

-      if (!intern || task.internId !== intern.id) {
+      if (!intern || task.internId.toString() !== intern._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }
@@ .. @@
     const updateData = req.body;

     // Get current task
-    const currentTask = await prisma.task.findUnique({
-      where: { id },
-      include: {
-        intern: true,
-        mentor: true,
-      },
-    });
+    const currentTask = await Task.findById(id)
+      .populate('intern')
+      .populate('mentor');

     if (!currentTask) {
       throw new ApiError('Task not found', 404);
     }

     // Check permissions
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || currentTask.mentorId !== mentor.id) {
+      if (!mentor || currentTask.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

     if (req.user?.role === 'INTERN') {
-      const intern = await prisma.intern.findFirst({
-        where: { internId: req.user.empId },
-      });
+      const intern = await Intern.findOne({ internId: req.user.empId });

-      if (!intern || currentTask.internId !== intern.id) {
+      if (!intern || currentTask.internId.toString() !== intern._id.toString()) {
         throw new ApiError('Access denied', 403);
       }

       // Interns can only update status
@@ .. @@
    }

     // Update task
-    const task = await prisma.task.update({
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
+    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
+      .populate({ path: 'intern', select: 'name internId' })
+      .populate({ path: 'mentor', select: 'name empId' });

+    if (!task) {
+      throw new ApiError('Task not found', 404);
+    }

     logger.info(`Task updated: ${task.title} - Status: ${task.status}`);
@@ .. @@
    const { id } = req.params;

     // Get current task
-    const currentTask = await prisma.task.findUnique({
-      where: { id },
-    });
+    const currentTask = await Task.findById(id);

     if (!currentTask) {
       throw new ApiError('Task not found', 404);
     }

     // Check permissions for mentors
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || currentTask.mentorId !== mentor.id) {
+      if (!mentor || currentTask.mentorId.toString() !== mentor._id.toString()) {
         throw new ApiError('Access denied', 403);
       }
     }

-    await prisma.task.delete({
-      where: { id },
-    });
+    await Task.findByIdAndDelete(id);

     logger.info(`Task deleted: ${currentTask.title}`);