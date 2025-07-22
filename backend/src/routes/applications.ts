@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Application, Intern, User } from '../models';
 import { authenticate, authorize } from '../middleware/auth';
@@ .. @@
     const { internId } = req.body;

     // Check if intern exists
-    const intern = await prisma.intern.findUnique({
-      where: { id: internId },
-    });
+    const intern = await Intern.findById(internId);

     if (!intern) {
       throw new ApiError('Intern not found', 404);
     }

     // Check if application already exists
-    const existingApplication = await prisma.application.findFirst({
-      where: { internId },
-    });
+    const existingApplication = await Application.findOne({ internId });

     if (existingApplication) {
       throw new ApiError('Application already exists for this intern', 409);
     }

     // Create application
-    const application = await prisma.application.create({
-      data: {
-        internId,
-        status: 'SUBMITTED',
-        reviewedBy: req.user!.id,
-      },
-      include: {
-        intern: {
-          select: {
-            name: true,
-            internId: true,
-            department: true,
-          },
-        },
-      },
-    });
+    const application = new Application({
+      internId,
+      status: 'SUBMITTED',
+      reviewedBy: req.user!.id,
+    });
+    await application.save();

+    await application.populate({
+      path: 'intern',
+      select: 'name internId department',
+    });

     // Emit status update
     emitStatusUpdate({
@@ .. @@
     if (department) {
-      where.intern = {
+      where['intern.department'] = department;
+    }

+    // For employees, only show their submitted applications
+    if (req.user?.role === 'EMPLOYEE') {
+      where['intern.referredByEmpId'] = req.user.empId;
+    }

+    const applications = await Application.find(where)
+      .sort({ createdAt: -1 })
+      .populate({
+        path: 'intern',
+        select: 'internId name email phone institute course semester department startDate endDate referredBy referredByEmpId documents',
+      })
+      .populate({
+        path: 'reviewer',
+        select: 'name empId',
+      });

+    // Filter by department if specified
+    const filteredApplications = applications.filter(app => {
+      if (department && app.intern.department !== department) {
+        return false;
+      }
+      if (req.user?.role === 'EMPLOYEE' && app.intern.referredByEmpId !== req.user.empId) {
+        return false;
+      }
+      return true;
+    });

+    res.json({
+      success: true,
+      data: filteredApplications,
+    });
+  })
+);
@@ .. @@
   asyncHandler(async (req, res) => {
     const { id } = req.params;

-    const application = await prisma.application.findUnique({
-      where: { id },
-      include: {
-        intern: true,
-        reviewer: {
-          select: {
-            name: true,
-            empId: true,
-          },
-        },
-      },
-    });
+    const application = await Application.findById(id)
+      .populate('intern')
+      .populate({
+        path: 'reviewer',
+        select: 'name empId',
+      });

     if (!application) {
       throw new ApiError('Application not found', 404);
     }

     // Check access permissions
     if (req.user?.role === 'EMPLOYEE') {
       if (application.intern.referredByEmpId !== req.user.empId) {
         throw new ApiError('Access denied', 403);
       }
     }
@@ .. @@
    const { status, reviewNotes } = req.body;

     // Update application
-    const application = await prisma.application.update({
-      where: { id },
-      data: {
+    const application = await Application.findByIdAndUpdate(
+      id,
+      {
         status,
         reviewNotes,
         reviewedBy: req.user!.id,
       },
-      include: {
-        intern: {
-          select: {
-            id: true,
-            name: true,
-            internId: true,
-            department: true,
-          },
-        },
-      },
-    });
+      { new: true }
+    ).populate({
+      path: 'intern',
+      select: 'name internId department',
+    });

+    if (!application) {
+      throw new ApiError('Application not found', 404);
+    }

     // Update intern status if application is approved
     if (status === 'APPROVED') {
-      await prisma.intern.update({
-        where: { id: application.internId },
-        data: { status: 'APPROVED' },
-      });
+      await Intern.findByIdAndUpdate(application.internId, { status: 'APPROVED' });
     } else if (status === 'REJECTED') {
-      await prisma.intern.update({
-        where: { id: application.internId },
-        data: { status: 'REJECTED' },
-      });
+      await Intern.findByIdAndUpdate(application.internId, { status: 'REJECTED' });
     }
@@ .. @@
   authorize('ADMIN'),
   asyncHandler(async (req, res) => {
-    const applications = await prisma.application.findMany({
-      where: { status: 'SUBMITTED' },
-      include: {
-        intern: {
-          select: {
-            id: true,
-            internId: true,
-            name: true,
-            email: true,
-            phone: true,
-            institute: true,
-            course: true,
-            semester: true,
-            department: true,
-            startDate: true,
-            endDate: true,
-            referredBy: true,
-            referredByEmpId: true,
-            documents: true,
-          },
-        },
-      },
-      orderBy: { createdAt: 'asc' },
-    });
+    const applications = await Application.find({ status: 'SUBMITTED' })
+      .sort({ createdAt: 1 })
+      .populate({
+        path: 'intern',
+        select: 'internId name email phone institute course semester department startDate endDate referredBy referredByEmpId documents',
+      });
@@ .. @@
   asyncHandler(async (req, res) => {
     const { internId } = req.params;

-    const application = await prisma.application.findFirst({
-      where: { internId },
-      include: {
-        intern: {
-          select: {
-            internId: true,
-            name: true,
-            department: true,
-            startDate: true,
-            endDate: true,
-          },
-        },
-        reviewer: {
-          select: {
-            name: true,
-            empId: true,
-          },
-        },
-      },
-      orderBy: { createdAt: 'desc' },
-    });
+    const application = await Application.findOne({ internId })
+      .sort({ createdAt: -1 })
+      .populate({
+        path: 'intern',
+        select: 'internId name department startDate endDate',
+      })
+      .populate({
+        path: 'reviewer',
+        select: 'name empId',
+      });

     if (!application) {
       throw new ApiError('Application not found', 404);
     }

     // Check access permissions for interns
     if (req.user?.role === 'INTERN') {
       if (req.user.empId !== application.intern.internId) {
         throw new ApiError('Access denied', 403);
       }
     }