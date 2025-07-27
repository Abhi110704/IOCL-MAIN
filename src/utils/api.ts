@@ .. @@
 // Intern Management APIs
 export const internAPI = {
   createApplication: async (applicationData: {
     name: string;
     email: string;
     phone: string;
     institute: string;
     course: string;
     semester: string;
     rollNumber: string;
     department: string;
     startDate: string;
     endDate: string;
     address: string;
     referredBy: string;
     referredByEmpId: string;
     documents?: Record<string, string>;
-  }): Promise<ApiResponse<InternApplication>> => {
-    return await apiCall<InternApplication>('/applications', { // Changed to /applications
+  }): Promise<ApiResponse<{ application: InternApplication; intern: any }>> => {
+    return await apiCall<{ application: InternApplication; intern: any }>('/applications', {
       method: 'POST',
       body: JSON.stringify(applicationData),
     });
   },