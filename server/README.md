# AI Resume Analyzer - Backend

Node.js/Express backend API for the AI Resume Analyzer application.

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Resume Management**: Upload, analyze, and manage resumes
- **Job Posting**: Create and manage job postings (recruiters)
- **Job Matching**: AI-powered job matching based on skills
- **File Upload**: Secure file upload with validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Morgan** for logging

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Resume Management
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/:id` - Get resume by ID
- `GET /api/resume/user/me` - Get user's resumes
- `GET /api/resume/search` - Search resumes (recruiters)
- `DELETE /api/resume/:id` - Delete resume

### Job Management
- `POST /api/jobs` - Create job posting (recruiters)
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/match/:resumeId` - Get job matches for resume
- `POST /api/jobs/:id/apply` - Apply for job
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting

### User Management
- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/applications` - Get user's applications
- `GET /api/users/job-applications/:jobId` - Get job applications (recruiters)
- `PUT /api/users/job-applications/:jobId/:userId/status` - Update application status

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NLP_SERVICE_URL=http://localhost:8000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Database Models

### User
- Authentication fields (email, password)
- Profile information
- Role-based access (jobseeker, recruiter, admin)

### Resume
- File information
- Extracted text
- Analysis results (ATS score, skills, experience)
- Processing status

### Job
- Job details (title, company, description)
- Requirements and skills
- Applications with match scores
- Status management

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- File upload validation
- Security headers with Helmet
- CORS configuration

## TODO

- [ ] Integrate with Python NLP microservice
- [ ] Add email notifications
- [ ] Implement file storage (AWS S3)
- [ ] Add rate limiting
- [ ] Add input validation middleware
- [ ] Add comprehensive error handling
- [ ] Add API documentation (Swagger)
- [ ] Add unit and integration tests
- [ ] Add logging and monitoring
- [ ] Add caching (Redis)

## API Documentation

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker"
}
```

#### Upload Resume
```bash
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <file>
```

#### Create Job
```bash
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Frontend Developer",
  "company": {
    "name": "Tech Corp"
  },
  "location": {
    "city": "San Francisco",
    "state": "CA"
  },
  "description": "We are looking for...",
  "requirements": {
    "skills": ["React", "JavaScript", "CSS"]
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 