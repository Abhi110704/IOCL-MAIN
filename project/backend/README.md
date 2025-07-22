# IOCL Intern Onboarding Portal - Backend

A comprehensive backend API for the Indian Oil Corporation Limited (IOCL) Intern Onboarding Portal built with TypeScript, Express.js, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Database Integration**: PostgreSQL with Prisma ORM and TypeScript support
- **File Upload**: Secure file handling with AWS S3 integration
- **Real-time Updates**: WebSocket support for status synchronization
- **API Documentation**: Comprehensive RESTful API endpoints
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston-based structured logging
- **Testing**: Jest test suite with TypeScript support

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 13
- AWS S3 account (optional, for file storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/iocl_intern_portal"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
   JWT_EXPIRES_IN="7d"
   
   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   S3_BUCKET="your-s3-bucket-name"
   
   # Server
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Deploy migrations to production
npm run db:deploy

# Seed database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "string",
      "username": "string",
      "role": "ADMIN | EMPLOYEE | INTERN | MENTOR",
      "name": "string",
      "empId": "string"
    }
  }
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

#### POST /api/auth/reset-password
Reset user password (requires authentication).

### Intern Management

#### POST /api/interns
Create a new intern record (Admin/Employee only).

#### GET /api/interns
Get list of interns with filtering and pagination.

**Query Parameters:**
- `department`: Filter by department
- `status`: Filter by status
- `mentorId`: Filter by mentor ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### GET /api/interns/:id
Get intern details by ID.

### Application Management

#### POST /api/applications
Submit a new application.

#### GET /api/applications
Get all applications with filtering.

#### PUT /api/applications/:id
Update application status (L&D team only).

### Mentor Management

#### GET /api/mentors
Get all mentors with filtering.

#### POST /api/mentors
Create a new mentor (Admin only).

#### POST /api/mentors/assign
Assign mentor to intern (Admin only).

### File Upload

#### POST /api/upload
Upload files (documents, images).

**Form Data:**
- `file`: File to upload
- `type`: File type (resume, photo, etc.)

### Certificates

#### GET /api/certificates/:internId
Generate and download completion certificate.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Database connection
│   │   ├── env.ts       # Environment variables
│   │   └── logger.ts    # Logging configuration
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── validation.ts # Request validation
│   │   └── errorHandler.ts # Error handling
│   ├── routes/          # API route handlers
│   │   ├── auth.ts      # Authentication routes
│   │   ├── interns.ts   # Intern management
│   │   ├── applications.ts # Application handling
│   │   ├── mentors.ts   # Mentor management
│   │   ├── tasks.ts     # Task management
│   │   ├── projects.ts  # Project submissions
│   │   ├── feedback.ts  # Feedback system
│   │   ├── upload.ts    # File uploads
│   │   └── certificates.ts # Certificate generation
│   ├── services/        # Business logic services
│   │   ├── websocket.ts # Real-time updates
│   │   ├── email.ts     # Email notifications
│   │   └── storage.ts   # File storage
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # All type definitions
│   └── server.ts        # Main server file
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Database seeding
├── tests/               # Test files
├── logs/                # Log files
└── uploads/             # Local file uploads
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Input Validation**: Zod-based request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers and protection
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **File Upload Security**: File type and size validation

## 🗄️ Database Schema

### Users
- Authentication and user management
- Role-based access control (Admin, Employee, Intern, Mentor)

### Interns
- Intern personal and academic information
- Document storage and status tracking

### Mentors
- Mentor profiles and capacity management
- Department-wise organization

### Applications
- Application submission and review workflow
- Status tracking and approval process

### Assignments
- Mentor-intern assignments
- Department-based allocation

### Tasks
- Task assignment and tracking
- Priority and status management

### Projects
- Project submission and evaluation
- Mentor feedback and grading

### Feedback
- Multi-criteria feedback system
- Rating and comments

### Meetings
- Meeting scheduling and management
- Agenda and notes tracking

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
S3_BUCKET="your-production-s3-bucket"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Netlify Functions Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Configure environment variables in Netlify dashboard
   - Set up database connection
   - Deploy using Netlify CLI or Git integration

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Individual function and method testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT and role-based access testing
- **Database Tests**: Prisma operations testing

Run tests with:
```bash
npm test
```

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@iocl.in
- Documentation: [API Documentation](http://localhost:3001/api)
- Health Check: [http://localhost:3001/health](http://localhost:3001/health)

---

**IOCL Intern Onboarding Portal Backend** - Empowering the next generation of energy professionals through technology.