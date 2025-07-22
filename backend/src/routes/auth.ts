@@ .. @@
 import { Router } from 'express';
-import bcrypt from 'bcrypt';
+import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
-import { prisma } from '../config/database';
+import { User } from '../models';
 import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '../config/env';
@@ .. @@
     const { username, password } = req.body;

     // Find user by username or empId
-    const user = await prisma.user.findFirst({
-      where: {
-        OR: [
-          { username },
-          { empId: username },
-        ],
-      },
-    });
+    const user = await User.findOne({
+      $or: [
+        { username },
+        { empId: username },
+      ],
+    });

     if (!user) {
       throw new ApiError('Invalid credentials', 401);
     }

     // Verify password
-    const isPasswordValid = await bcrypt.compare(password, user.password);
+    const isPasswordValid = await user.comparePassword(password);
     if (!isPasswordValid) {
       throw new ApiError('Invalid credentials', 401);
     }

     // Generate JWT token
     const token = jwt.sign(
       { 
-        userId: user.id,
+        userId: user._id.toString(),
         empId: user.empId,
         role: user.role,
       },
@@ .. @@
     );

     // Remove password from response
-    const { password: _, ...userWithoutPassword } = user;
+    const userWithoutPassword = user.toJSON();

     logger.info(`User ${user.username} logged in successfully`);
@@ .. @@
   authenticate,
   asyncHandler(async (req, res) => {
-    const user = await prisma.user.findUnique({
-      where: { id: req.user!.id },
-      select: {
-        id: true,
-        username: true,
-        empId: true,
-        name: true,
-        email: true,
-        phone: true,
-        department: true,
-        role: true,
-        isFirstLogin: true,
-        createdAt: true,
-        updatedAt: true,
-      },
-    });
+    const user = await User.findById(req.user!.id).select('-password');

     if (!user) {
       throw new ApiError('User not found', 404);
     }
@@ .. @@
     const userId = req.user!.id;

     // Get current user
-    const user = await prisma.user.findUnique({
-      where: { id: userId },
-    });
+    const user = await User.findById(userId);

     if (!user) {
       throw new ApiError('User not found', 404);
     }

     // Verify current password
-    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
+    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
     if (!isCurrentPasswordValid) {
       throw new ApiError('Current password is incorrect', 400);
     }

-    // Hash new password
-    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
-
     // Update password and mark first login as false
-    await prisma.user.update({
-      where: { id: userId },
-      data: {
-        password: hashedNewPassword,
-        isFirstLogin: false,
-      },
-    });
+    user.password = newPassword;
+    user.isFirstLogin = false;
+    await user.save();

     logger.info(`User ${user.username} reset their password`);