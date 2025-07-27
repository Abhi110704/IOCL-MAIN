@@ .. @@
   // This function assumes the `user` object from your `useAuth` hook is available in this scope.
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     if (!validateForm()) {
       return;
     }

     // Add a check to ensure a user is logged in before submitting.
     if (!user) {
       alert('Error: You must be logged in to register an intern.');
       return;
     }

     setIsSubmitting(true);

-    // Create the data object to be sent to the API.
-    // We are adding `internId` here to satisfy the backend validation error.
+    // Create the data object to be sent to the API
     const internData = {
-      internId: user._id, // Add the logged-in user's ID to satisfy the backend.
-      name: formData.fullName,
+      name: formData.fullName,
       email: formData.email,
       phone: formData.phone,
       institute: formData.collegeName,
       course: formData.course,
       semester: formData.semester,
       rollNumber: formData.rollNumber,
       department: formData.department,
       startDate: formData.startDate,
       endDate: formData.endDate,
       address: formData.address,
-      referredBy: user.name, // Consistently use the logged-in user's info
-      referredByEmpId: user.empId, // Consistently use the logged-in user's info
-      photo: formData.photo,
-      resume: formData.resume,
-      collegeId: formData.collegeId,
-      lastSemesterResult: formData.lastSemesterResult,
-      noc: formData.noc,
-      idProof: formData.idProof,
-      otherDocument: formData.otherDocument,
+      referredBy: formData.referredBy,
+      referredByEmpId: formData.referredByEmpId,
+      documents: {
+        photo: formData.photo?.name || '',
+        resume: formData.resume?.name || '',
+        collegeId: formData.collegeId?.name || '',
+        lastSemesterResult: formData.lastSemesterResult?.name || '',
+        noc: formData.noc?.name || '',
+        idProof: formData.idProof?.name || '',
+        otherDocument: formData.otherDocument?.name || '',
+      },
     };

     try {
       // Call the API with the complete intern data
       const response = await internAPI.createApplication(internData);

       if (response.success && response.data) {
         // Use a more modern, non-blocking notification instead of alert()
         // For now, we'll keep alert() as per the original code.
-        alert(`Intern registered successfully!\nIntern ID: ${response.data.intern.internId}`);
+        alert(`Intern registered successfully!\nIntern ID: ${response.data.intern.internId}`);
         
         // Reset the form fields after successful submission
         setFormData({
           fullName: '',
           email: '',
           phone: '',
           collegeName: '',
           course: '',
           semester: '',
           rollNumber: '',
           department: '',
           startDate: '',
           endDate: '',
           address: '',
           photo: null,
           resume: null,
           collegeId: null,
           lastSemesterResult: null,
           noc: null,
           idProof: null,
           otherDocument: null,
           referredBy: user.name,
           referredByEmpId: user.empId,
         });

         // Clear the file input fields
         const fileInputs = ['photo', 'resume', 'collegeId', 'lastSemesterResult', 'noc', 'idProof', 'otherDocument'];
         fileInputs.forEach(inputId => {
           const input = document.getElementById(inputId) as HTMLInputElement;
           if (input) input.value = '';
         });

       } else {
         alert(`Error: ${response.error || 'Failed to submit application.'}`);
       }
     } catch (error) {
       console.error('Submission error:', error);
       alert('An error occurred. Please check the console and backend logs for details.');
     } finally {
       setIsSubmitting(false);
     }
   };