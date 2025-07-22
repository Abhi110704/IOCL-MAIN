@@ .. @@
 import { Router } from 'express';
-import { prisma } from '../config/database';
+import { Mentor, Assignment, Intern } from '../models';
 import { authenticate, authorize } from '../middleware/auth';
@@ .. @@
     if (availability) {
       where.availability = availability;
     }

-    const mentors = await prisma.mentor.findMany({
-      where,
-      include: {
-        assignments: {
-          where: { isActive: true },
-          include: {
-            intern: {
-              select: {
-                name: true,
-                internId: true,
-                startDate: true,
-                endDate: true,
-              },
-            },
-          },
-        },
-        _count: {
-          select: {
-            assignments: {
-              where: { isActive: true },
-            },
-          },
-        },
-      },
-      orderBy: { name: 'asc' },
-    });
+    const mentors = await Mentor.find(where)
+      .sort({ name: 1 })
+      .populate({
+        path: 'assignments',
+        match: { isActive: true },
+        populate: {
+          path: 'intern',
+          select: 'name internId startDate endDate',
+        },
+      });

     // Calculate current intern count and update availability
-    const mentorsWithUpdatedInfo = await Promise.all(
-      mentors.map(async (mentor) => {
-        const currentInterns = mentor._count.assignments;
-        
-        // Update current intern count if it's different
-        if (mentor.currentInterns !== currentInterns) {
-          await prisma.mentor.update({
-            where: { id: mentor.id },
-            data: { currentInterns },
-          });
-        }
+    const mentorsWithUpdatedInfo = await Promise.all(
+      mentors.map(async (mentor) => {
+        const currentInterns = await Assignment.countDocuments({
+          mentorId: mentor._id,
+          isActive: true,
+        });
+        
+        // Update current intern count if it's different
+        if (mentor.currentInterns !== currentInterns) {
+          await Mentor.findByIdAndUpdate(mentor._id, { currentInterns });
+        }

         // Determine availability based on capacity
         let availability = mentor.availability;
@@ .. @@
         return {
           ...mentor,
           currentInterns,
           availability,
-          internDurations: mentor.assignments.map(assignment => ({
+          internDurations: mentor.assignments?.map(assignment => ({
             internName: assignment.intern.name,
             internId: assignment.intern.internId,
             startDate: assignment.intern.startDate.toISOString().split('T')[0],
             endDate: assignment.intern.endDate.toISOString().split('T')[0],
-          })),
+          })) || [],
         };
       })
     );
@@ .. @@
   asyncHandler(async (req, res) => {
     const { department } = req.params;

-    const mentors = await prisma.mentor.findMany({
-      where: {
+    const mentors = await Mentor.find({
         department,
         availability: {
-          in: ['AVAILABLE', 'BUSY'],
+          $in: ['AVAILABLE', 'BUSY'],
         },
-      },
-      include: {
-        assignments: {
-          where: { isActive: true },
-          include: {
-            intern: {
-              select: {
-                name: true,
-                internId: true,
-                startDate: true,
-                endDate: true,
-              },
-            },
-          },
-        },
-        _count: {
-          select: {
-            assignments: {
-              where: { isActive: true },
-            },
-          },
-        },
-      },
-      orderBy: [
-        { currentInterns: 'asc' },
-        { name: 'asc' },
-      ],
-    });
+      })
+      .sort({ currentInterns: 1, name: 1 })
+      .populate({
+        path: 'assignments',
+        match: { isActive: true },
+        populate: {
+          path: 'intern',
+          select: 'name internId startDate endDate',
+        },
+      });

     // Filter mentors who have capacity
-    const availableMentors = mentors
-      .filter(mentor => mentor._count.assignments < mentor.maxCapacity)
-      .map(mentor => ({
-        ...mentor,
-        currentInterns: mentor._count.assignments,
-        internDurations: mentor.assignments.map(assignment => ({
+    const availableMentors = [];
+    
+    for (const mentor of mentors) {
+      const currentInterns = await Assignment.countDocuments({
+        mentorId: mentor._id,
+        isActive: true,
+      });
+      
+      if (currentInterns < mentor.maxCapacity) {
+        availableMentors.push({
+          ...mentor.toObject(),
+          currentInterns,
+          internDurations: mentor.assignments?.map(assignment => ({
+            internName: assignment.intern.name,
+            internId: assignment.intern.internId,
+            startDate: assignment.intern.startDate.toISOString().split('T')[0],
+            endDate: assignment.intern.endDate.toISOString().split('T')[0],
+          })) || [],
+        });
+      }
+    }
+
+    res.json({
+      success: true,
+      data: availableMentors,
+    });
+  })
+);
@@ .. @@
     const mentorData = req.body;

     // Check if mentor with empId already exists
-    const existingMentor = await prisma.mentor.findUnique({
-      where: { empId: mentorData.empId },
-    });
+    const existingMentor = await Mentor.findOne({ empId: mentorData.empId });

     if (existingMentor) {
       throw new ApiError('Mentor with this employee ID already exists', 409);
     }

-    const mentor = await prisma.mentor.create({
-      data: mentorData,
-    });
+    const mentor = new Mentor(mentorData);
+    await mentor.save();

     logger.info(`New mentor created: ${mentor.name} (${mentor.empId})`);
@@ .. @@
     delete updateData.createdAt;
     delete updateData.updatedAt;

-    const mentor = await prisma.mentor.update({
-      where: { id },
-      data: updateData,
-    });
+    const mentor = await Mentor.findByIdAndUpdate(id, updateData, { new: true });

+    if (!mentor) {
+      throw new ApiError('Mentor not found', 404);
+    }

     logger.info(`Mentor updated: ${mentor.name} (${mentor.empId})`);
@@ .. @@
     const { id } = req.params;

     // Check for active assignments
-    const activeAssignments = await prisma.assignment.count({
-      where: { mentorId: id, isActive: true },
-    });
+    const activeAssignments = await Assignment.countDocuments({
+      mentorId: id,
+      isActive: true,
+    });

     if (activeAssignments > 0) {
       throw new ApiError('Cannot delete mentor with active assignments', 400);
     }

-    const mentor = await prisma.mentor.delete({
-      where: { id },
-    });
+    const mentor = await Mentor.findByIdAndDelete(id);

+    if (!mentor) {
+      throw new ApiError('Mentor not found', 404);
+    }

     logger.info(`Mentor deleted: ${mentor.name} (${mentor.empId})`);
@@ .. @@
     const { internId, mentorId, department } = req.body;

     // Check if intern exists and is approved
-    const intern = await prisma.intern.findUnique({
-      where: { id: internId },
-    });
+    const intern = await Intern.findById(internId);

     if (!intern) {
       throw new ApiError('Intern not found', 404);
     }

     if (intern.status !== 'APPROVED') {
       throw new ApiError('Intern must be approved before mentor assignment', 400);
     }

     // Check if mentor exists and has capacity
-    const mentor = await prisma.mentor.findUnique({
-      where: { id: mentorId },
-      include: {
-        _count: {
-          select: {
-            assignments: {
-              where: { isActive: true },
-            },
-          },
-        },
-      },
-    });
+    const mentor = await Mentor.findById(mentorId);

     if (!mentor) {
       throw new ApiError('Mentor not found', 404);
     }

-    if (mentor._count.assignments >= mentor.maxCapacity) {
+    const currentAssignments = await Assignment.countDocuments({
+      mentorId: mentor._id,
+      isActive: true,
+    });

+    if (currentAssignments >= mentor.maxCapacity) {
       throw new ApiError('Mentor has reached maximum capacity', 400);
     }

     // Check if assignment already exists
-    const existingAssignment = await prisma.assignment.findFirst({
-      where: { internId, isActive: true },
-    });
+    const existingAssignment = await Assignment.findOne({
+      internId,
+      isActive: true,
+    });

     if (existingAssignment) {
       throw new ApiError('Intern already has an active mentor assignment', 409);
     }

     // Create assignment
-    const assignment = await prisma.assignment.create({
-      data: {
-        internId,
-        mentorId,
-        department,
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
+    const assignment = new Assignment({
+      internId,
+      mentorId,
+      department,
+    });
+    await assignment.save();

+    await assignment.populate([
+      { path: 'intern', select: 'name internId' },
+      { path: 'mentor', select: 'name empId' },
+    ]);

     // Update intern status to active
-    await prisma.intern.update({
-      where: { id: internId },
-      data: { status: 'ACTIVE' },
-    });
+    await Intern.findByIdAndUpdate(internId, { status: 'ACTIVE' });

     // Update mentor's current intern count
-    await prisma.mentor.update({
-      where: { id: mentorId },
-      data: {
-        currentInterns: mentor._count.assignments + 1,
-      },
-    });
+    await Mentor.findByIdAndUpdate(mentorId, {
+      currentInterns: currentAssignments + 1,
+    });

     logger.info(`Mentor assigned: ${mentor.name} -> ${intern.name} (${intern.internId})`);
@@ .. @@
    // Check if user is the mentor or admin
     if (req.user?.role === 'MENTOR') {
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

-      if (!mentor || mentor.id !== id) {
+      if (!mentor || mentor._id.toString() !== id) {
         throw new ApiError('Access denied', 403);
       }
     } else if (req.user?.role !== 'ADMIN') {
       throw new ApiError('Access denied', 403);
     }

-    const assignments = await prisma.assignment.findMany({
-      where: { mentorId: id, isActive: true },
-      include: {
-        intern: {
-          include: {
-            tasks: {
-              where: { mentorId: id },
-              orderBy: { createdAt: 'desc' },
-            },
-            feedback: {
-              where: { mentorId: id },
-              orderBy: { createdAt: 'desc' },
-            },
-            projects: {
-              where: { mentorId: id },
-              orderBy: { submittedAt: 'desc' },
-            },
-            meetings: {
-              where: { mentorId: id },
-              orderBy: { date: 'desc' },
-            },
-          },
-        },
-      },
-      orderBy: { assignedAt: 'desc' },
-    });
+    const assignments = await Assignment.find({
+      mentorId: id,
+      isActive: true,
+    })
+      .sort({ assignedAt: -1 })
+      .populate({
+        path: 'intern',
+        populate: [
+          {
+            path: 'tasks',
+            match: { mentorId: id },
+            options: { sort: { createdAt: -1 } },
+          },
+          {
+            path: 'feedback',
+            match: { mentorId: id },
+            options: { sort: { createdAt: -1 } },
+          },
+          {
+            path: 'projects',
+            match: { mentorId: id },
+            options: { sort: { submittedAt: -1 } },
+          },
+          {
+            path: 'meetings',
+            match: { mentorId: id },
+            options: { sort: { date: -1 } },
+          },
+        ],
+      });

     const interns = assignments.map(assignment => ({
       ...assignment.intern,
       assignedAt: assignment.assignedAt,
     }));