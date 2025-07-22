@@ .. @@
 # IOCL Intern Onboarding Portal - Backend

-A comprehensive backend API for the Indian Oil Corporation Limited (IOCL) Intern Onboarding Portal built with TypeScript, Express.js, Prisma, and PostgreSQL.
+A comprehensive backend API for the Indian Oil Corporation Limited (IOCL) Intern Onboarding Portal built with TypeScript, Express.js, Mongoose, and MongoDB.

 ## 🚀 Features

 - **Authentication & Authorization**: JWT-based auth with role-based access control
-- **Database Integration**: PostgreSQL with Prisma ORM and TypeScript support
+- **Database Integration**: MongoDB with Mongoose ODM and TypeScript support
 - **File Upload**: Secure file handling with AWS S3 integration
 - **Real-time Updates**: WebSocket support for status synchronization
 - **API Documentation**: Comprehensive RESTful API endpoints
@@ .. @@
 - Node.js >= 18.0.0
 - npm >= 8.0.0
-- PostgreSQL >= 13
+- MongoDB >= 4.4
 - AWS S3 account (optional, for file storage)

 ## 🛠️ Installation
@@ .. @@
    Update the `.env` file with your configuration:
    ```env
    # Database
-   DATABASE_URL="postgresql://username:password@localhost:5432/iocl_intern_portal"
+   MONGO_URI="mongodb://localhost:27017/iocl_intern_portal"
    
    # JWT
    JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
@@ .. @@
4. **Database Setup**
    ```bash
-   # Generate Prisma client
-   npm run db:generate
-   
-   # Run database migrations
-   npm run db:migrate
-   
    # Seed initial data
    npm run db:seed
    ```
@@ .. @@
### Database Commands
```bash
-# Generate Prisma client
-npm run db:generate
-
-# Push schema changes to database
-npm run db:push
-
-# Create and run migrations
-npm run db:migrate
-
-# Deploy migrations to production
-npm run db:deploy
-
 # Seed database with initial data
 npm run db:seed
-
-# Open Prisma Studio
-npm run db:studio
 ```

 ### Testing
@@ .. @@
 ## 🗄️ Database Schema

 ### Users
 - Authentication and user management
 - Role-based access control (Admin, Employee, Intern, Mentor)

 ### Interns
@@ .. @@
 ### Environment Variables for Production

 ```env
 NODE_ENV=production
-DATABASE_URL="your-production-database-url"
+MONGO_URI="your-production-mongodb-uri"
 JWT_SECRET="your-production-jwt-secret"
 AWS_ACCESS_KEY_ID="your-aws-access-key"
 AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
@@ .. @@
 - **JWT Authentication**: Secure token-based authentication
 - **Role-based Access Control**: Different permissions for different user roles
 - **Input Validation**: Zod-based request validation
 - **Rate Limiting**: Protection against brute force attacks
 - **CORS Configuration**: Controlled cross-origin requests
 - **Helmet Security**: Security headers and protection
-- **SQL Injection Protection**: Prisma ORM prevents SQL injection
+- **NoSQL Injection Protection**: Mongoose ODM prevents NoSQL injection
 - **File Upload Security**: File type and size validation
@@ .. @@
 - **Unit Tests**: Individual function and method testing
 - **Integration Tests**: API endpoint testing
 - **Authentication Tests**: JWT and role-based access testing
-- **Database Tests**: Prisma operations testing
+- **Database Tests**: Mongoose operations testing