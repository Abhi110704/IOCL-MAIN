@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Intern, Application, Assignment, Mentor } from '../models';
 import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
@@ .. @@
     // Generate unique intern ID
     const internId = `IOCL-${Date.now().toString().slice(-6)}`;

     // Create intern record
-    const intern = await prisma.intern.create({
-      data: {
-        ...internData,
-        internId,
-        documents: internData.documents || {},
-      },
-    });
+    const intern = new Intern({
+      ...internData,
+      internId,
+      documents: internData.documents || {},
+    });
+    await intern.save();

     // Create initial application record
-    await prisma.application.create({
-      data: {
-        internId: intern.id,
-        status: 'SUBMITTED',
-      },
-    });
+    const application = new Application({
+      internId: intern._id,
+      status: 'SUBMITTED',
+    });
+    await application.save();

-    logger.info(`New intern created: ${intern.name} (${intern.internId})`);
+    logger.info(`New intern created: ${intern.name} (${intern.internId})`);
@@ .. @@
     // For mentors, only show their assigned interns
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

       if (mentor) {
-        const assignments = await prisma.assignment.findMany({
-          where: { mentorId: mentor.id, isActive: true },
-          select: { internId: true },
-        });
+        const assignments = await Assignment.find({
+          mentorId: mentor._id,
+          isActive: true,
+        }).select('internId');

-        where.id = {
-          in: assignments.map(a => a.internId),
+        where._id = {
+          $in: assignments.map(a => a.internId),
         };
       }
     }

     if (mentorId && req.user?.role === 'ADMIN') {
-      const assignments = await prisma.assignment.findMany({
-        where: { mentorId, isActive: true },
-        select: { internId: true },
-      });
+      const assignments = await Assignment.find({
+        mentorId,
+        isActive: true,
+      }).select('internId');

-      where.id = {
-        in: assignments.map(a => a.internId),
+      where._id = {
+        $in: assignments.map(a => a.internId),
       };
     }

     // Get interns with pagination
-    const [interns, total] = await Promise.all([
-      prisma.intern.findMany({
-        where,
-        skip,
-        take: limit,
-        include: {
-          assignments: {
-            where: { isActive: true },
-            include: {
-              mentor: {
-                select: {
-                  name: true,
-                  empId: true,
-                  department: true,
-                },
-              },
-            },
-          },
-          applications: {
-            orderBy: { createdAt: 'desc' },
-            take: 1,
-          },
-        },
-        orderBy: { createdAt: 'desc' },
-      }),
-      prisma.intern.count({ where }),
-    ]);
+    const [interns, total] = await Promise.all([
+      Intern.find(where)
+        .skip(skip)
+        .limit(limit)
+        .sort({ createdAt: -1 })
+        .populate({
+          path: 'assignments',
+          match: { isActive: true },
+          populate: {
+            path: 'mentor',
+            select: 'name empId department',
+          },
+        })
+        .populate({
+          path: 'applications',
+          options: { sort: { createdAt: -1 }, limit: 1 },
+        }),
+      Intern.countDocuments(where),
+    ]);
@@ .. @@
   asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const intern = await prisma.intern.findUnique({
-      where: { id },
-      include: {
-        assignments: {
-          where: { isActive: true },
-          include: {
-            mentor: {
-              select: {
-                name: true,
-                empId: true,
-                department: true,
-                email: true,
-                phone: true,
-              },
-            },
-          },
-        },
-        applications: {
-          orderBy: { createdAt: 'desc' },
-        },
-        feedback: {
-          include: {
-            mentor: {
-              select: {
-                name: true,
-                empId: true,
-              },
-            },
-          },
-          orderBy: { createdAt: 'desc' },
-        },
-        tasks: {
-          include: {
-            mentor: {
-              select: {
-                name: true,
-                empId: true,
-              },
-            },
-          },
-          orderBy: { createdAt: 'desc' },
-        },
-        projects: {
-          include: {
-            mentor: {
-              select: {
-                name: true,
-                empId: true,
-              },
-            },
-          },
-          orderBy: { submittedAt: 'desc' },
-        },
-        meetings: {
-          include: {
-            mentor: {
-              select: {
-                name: true,
-                empId: true,
-              },
-            },
-          },
-          orderBy: { date: 'desc' },
-        },
-      },
-    });
+    const intern = await Intern.findById(id)
+      .populate({
+        path: 'assignments',
+        match: { isActive: true },
+        populate: {
+          path: 'mentor',
+          select: 'name empId department email phone',
+        },
+      })
+      .populate({
+        path: 'applications',
+        options: { sort: { createdAt: -1 } },
+      })
+      .populate({
+        path: 'feedback',
+        populate: {
+          path: 'mentor',
+          select: 'name empId',
+        },
+        options: { sort: { createdAt: -1 } },
+      })
+      .populate({
+        path: 'tasks',
+        populate: {
+          path: 'mentor',
+          select: 'name empId',
+        },
+        options: { sort: { createdAt: -1 } },
+      })
+      .populate({
+        path: 'projects',
+        populate: {
+          path: 'mentor',
+          select: 'name empId',
+        },
+        options: { sort: { submittedAt: -1 } },
+      })
+      .populate({
+        path: 'meetings',
+        populate: {
+          path: 'mentor',
+          select: 'name empId',
+        },
+        options: { sort: { date: -1 } },
+      });

     if (!intern) {
       throw new ApiError('Intern not found', 404);
     }
@@ .. @@
     delete updateData.createdAt;
     delete updateData.updatedAt;

-    const intern = await prisma.intern.update({
-      where: { id },
-      data: updateData,
-    });
+    const intern = await Intern.findByIdAndUpdate(id, updateData, { new: true });

+    if (!intern) {
+      throw new ApiError('Intern not found', 404);
+    }

     logger.info(`Intern updated: ${intern.name} (${intern.internId})`);
@@ .. @@
     const { id } = req.params;

     // Soft delete by updating status
-    const intern = await prisma.intern.update({
-      where: { id },
-      data: { status: 'REJECTED' },
-    });
+    const intern = await Intern.findByIdAndUpdate(
+      id,
+      { status: 'REJECTED' },
+      { new: true }
+    );

+    if (!intern) {
+      throw new ApiError('Intern not found', 404);
+    }

     logger.info(`Intern deleted: ${intern.name} (${intern.internId})`);
@@ .. @@
   asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const intern = await prisma.intern.findUnique({
-      where: { id },
-      select: {
-        id: true,
-        name: true,
-        internId: true,
-        documents: true,
-      },
-    });
+    const intern = await Intern.findById(id).select('name internId documents');

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