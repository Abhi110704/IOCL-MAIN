@@ .. @@
 import { Request, Response, NextFunction } from 'express';
 import jwt from 'jsonwebtoken';
-import { prisma } from '../config/database';
+import { User } from '../models';
 import { JWT_SECRET } from '../config/env';
@@ .. @@
    // Verify JWT token
     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
     
     // Find user in database
-    const user = await prisma.user.findUnique({
-      where: { id: decoded.userId },
-      select: {
-        id: true,
-        empId: true,
-        role: true,
-        name: true,
-        email: true,
-        department: true,
-      },
-    });
+    const user = await User.findById(decoded.userId).select('-password');

     if (!user) {
       throw new ApiError('User not found', 401);
     }

     // Attach user to request
-    req.user = user;
+    req.user = {
+      id: user._id.toString(),
+      empId: user.empId,
+      role: user.role,
+      name: user.name,
+      email: user.email,
+      department: user.department,
+    };
     next();
   } catch (error) {
@@ .. @@
      }

       // Find mentor record
-      const mentor = await prisma.mentor.findUnique({
-        where: { empId: req.user.empId },
-      });
+      const mentor = await Mentor.findOne({ empId: req.user.empId });

       if (!mentor) {
         return next(new ApiError('Mentor record not found', 404);
       }

       // Check if mentor is assigned to this intern
-      const assignment = await prisma.assignment.findFirst({
-        where: {
+      const assignment = await Assignment.findOne({
           internId,
-          mentorId: mentor.id,
+          mentorId: mentor._id,
           isActive: true,
-        },
-      });
+        });

       if (!assignment) {
         logger.warn(`Mentor ${req.user.id} attempted to access intern ${internId} without assignment`);
@@ .. @@
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
     
-    const user = await prisma.user.findUnique({
-      where: { id: decoded.userId },
-      select: {
-        id: true,
-        empId: true,
-        role: true,
-        name: true,
-        email: true,
-        department: true,
-      },
-    });
+    const user = await User.findById(decoded.userId).select('-password');

     if (user) {
-      req.user = user;
+      req.user = {
+        id: user._id.toString(),
+        empId: user.empId,
+        role: user.role,
+        name: user.name,
+        email: user.email,
+        department: user.department,
+      };
     }