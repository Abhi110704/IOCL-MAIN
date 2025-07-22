@@ .. @@
 // Environment validation schema
 const envSchema = z.object({
   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
   PORT: z.string().transform(Number).default('3001'),
   
   // Database
-  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
+  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
   
   // JWT
   JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
@@ .. @@
 // Export individual variables for convenience
 export const {
   NODE_ENV,
   PORT,
-  DATABASE_URL,
+  MONGO_URI,
   JWT_SECRET,
   JWT_EXPIRES_IN,
   AWS_ACCESS_KEY_ID,