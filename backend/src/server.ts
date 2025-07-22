@@ .. @@
 import { PORT, NODE_ENV, CORS_ORIGIN } from './config/env';
 import { logger, morganStream } from './config/logger';
-import { DatabaseConnection } from './config/database';
+import DatabaseConnection from './config/database';
 import { errorHandler, notFoundHandler } from './middleware/errorHandler';