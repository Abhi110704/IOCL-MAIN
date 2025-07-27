@@ .. @@
 router.post('/',
   authenticate,
   authorize('ADMIN', 'EMPLOYEE'),
   validateBody(CreateApplicationSchema),
   asyncHandler(async (req, res) => {
-    const { internId } = req.body;
+    const internData = req.body;

-    // Check if intern exists
-    const intern = await Intern.findById(internId);
+    // Generate unique intern ID
+    const internId = `IOCL-${Date.now().toString().slice(-6)}`;

-    if (!intern) {
-      throw new ApiError('Intern not found', 404);
-    }
+    // Create intern record first
+    const intern = new Intern({
+      ...internData,
+      internId,
+      documents: internData.documents || {},
+    });
+    await intern.save();

-    // Check if application already exists
-    const existingApplication = await Application.findOne({ internId });
-
-    if (existingApplication) {
-      throw new ApiError('Application already exists for this intern', 409);
-    }
-
     // Create application
     const application = new Application({
-      internId,
+      internId: intern._id,
       status: 'SUBMITTED',
-      reviewedBy: req.user!.id,
     });
     await application.save();

     await application.populate({
       path: 'intern',
       select: 'name internId department',
     });
+
    let filteredApplications = applications.filter(app => {
     emitStatusUpdate({
       type: 'APPLICATION_STATUS',
       id: application.id,
       status: 'SUBMITTED',
     });

     logger.info(`Application submitted for intern: ${intern.name} (${intern.internId})`);


     res.status(201).json({
       success: true,
-      data: application,
+      data: { application, intern },
      data: applications,
     });
   })
 );