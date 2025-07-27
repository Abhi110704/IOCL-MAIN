@@ .. @@
   // Database
-  MONGO_URI: z.string().min(1, 'mongodb+srv://harsh17215:Har@12345@cluster0.6ggy07q.mongodb.net'),
+  MONGO_URI: z.string().min(1, 'MongoDB URI is required').default('mongodb+srv://harsh17215:Har@12345@cluster0.6ggy07q.mongodb.net'),
   
   // JWT
-  JWT_SECRET: z.string().min(32, 'x7y9z2a4b6c8d0e2f4g6h8i0j2k4l6m8'),
+  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').default('x7y9z2a4b6c8d0e2f4g6h8i0j2k4l6m8'),
   JWT_EXPIRES_IN: z.string().default('1h'),