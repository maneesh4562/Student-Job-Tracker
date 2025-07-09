# AI Resume Analyzer & Job Matcher

A full-stack application for AI-powered resume analysis, ATS scoring, and intelligent job matching.

## 🚀 Features

### For Job Seekers
- **Resume Upload**: Drag & drop PDF, DOC, DOCX files
- **ATS Scoring**: AI-powered resume analysis with scoring
- **Skill Extraction**: Automatic detection of technical skills
- **Job Matching**: Intelligent job recommendations based on skills
- **Dashboard**: Track applications and resume performance

### For Recruiters
- **Job Posting**: Create and manage job listings
- **Resume Search**: Find candidates by skills and experience
- **Application Management**: Review and manage applications
- **Analytics**: Track application metrics and candidate quality

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   NLP Service   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   Database      │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for API state management
- **React Dropzone** for file uploads
- **Chart.js** for data visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### NLP Service
- **FastAPI** (Python)
- **spaCy** for NLP processing
- **NLTK** for text analysis
- **PyPDF2** for PDF extraction
- **python-docx** for DOCX processing

## 📦 Project Structure

```
AIResume_Analyser/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   └── config/        # Configuration files
│   └── package.json
├── nlp-service/           # Python NLP microservice
│   ├── main.py           # FastAPI application
│   ├── resume_analyzer.py # NLP analysis logic
│   └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AIResume_Analyser
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 3. Setup Backend

```bash
cd server
npm install

# Create .env file
echo "NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NLP_SERVICE_URL=http://localhost:8000" > .env

npm run dev
```

Backend will be available at `http://localhost:5000`

### 4. Setup NLP Service

```bash
cd nlp-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

NLP service will be available at `http://localhost:8000`

### 5. Start MongoDB

```bash
# If running locally
mongod

# Or use MongoDB Atlas (cloud)
```

## 📚 API Documentation

### Authentication Endpoints

```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Resume Endpoints

```bash
# Upload resume
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Get user's resumes
GET /api/resume/user/me
Authorization: Bearer <token>
```

### Job Endpoints

```bash
# Get all jobs
GET /api/jobs

# Create job (recruiters only)
POST /api/jobs
Authorization: Bearer <token>
{
  "title": "Frontend Developer",
  "company": {"name": "Tech Corp"},
  "description": "We are looking for...",
  "requirements": {"skills": ["React", "JavaScript"]}
}

# Apply for job
POST /api/jobs/:id/apply
Authorization: Bearer <token>
{
  "resumeId": "resume_id_here"
}
```

### NLP Service Endpoints

```bash
# Analyze text
POST http://localhost:8000/analyze-text
{
  "text": "Resume text here..."
}

# Analyze file
POST http://localhost:8000/analyze-file
Content-Type: multipart/form-data
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NLP_SERVICE_URL=http://localhost:8000
```

#### NLP Service (.env)
```
NLP_MODEL=en_core_web_sm
CONFIDENCE_THRESHOLD=0.3
MAX_FILE_SIZE=5242880
```

## 🧪 Testing

### Frontend
```bash
cd client
npm test
```

### Backend
```bash
cd server
npm test
```

### NLP Service
```bash
cd nlp-service
pytest
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/AWS)
```bash
cd server
npm start
# Deploy to Render or AWS
```

### NLP Service (Docker)
```bash
cd nlp-service
docker build -t nlp-service .
docker run -p 8000:8000 nlp-service
```

## 📊 Features in Detail

### Resume Analysis
- **Text Extraction**: PDF, DOC, DOCX support
- **Skill Detection**: 100+ technical skills with confidence scores
- **ATS Scoring**: Algorithm-based compatibility scoring
- **Contact Extraction**: Email, phone, location parsing
- **Experience Analysis**: Years and level detection
- **Education Parsing**: Degree and institution extraction

### Job Matching
- **Skill-based Matching**: Intelligent skill comparison
- **Experience Filtering**: Match by experience level
- **Location Matching**: Geographic preference matching
- **Score Calculation**: Percentage-based match scores

### User Management
- **Role-based Access**: Job seekers, recruiters, admins
- **Profile Management**: User profiles and preferences
- **Application Tracking**: Job application status
- **Dashboard Analytics**: Performance metrics

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Role-based authorization
- File upload validation
- CORS configuration
- Security headers with Helmet

## 📈 Performance

- **Frontend**: < 2s initial load time
- **Backend**: < 100ms API response time
- **NLP Service**: < 2s analysis time
- **Database**: Indexed queries for fast retrieval

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@airesumeanalyzer.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] AI-powered interview preparation
- [ ] Integration with job boards
- [ ] Multi-language support
- [ ] Advanced ML models for better matching
- [ ] Real-time collaboration features

---

**Built with ❤️ using modern web technologies** 