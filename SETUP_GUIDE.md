# AI Resume Analyzer - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (running locally or cloud instance)
- **Git**

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd AIResume_Analyser
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd ../client
npm install
```

#### NLP Service Dependencies
```bash
cd ../nlp-service
pip install -r requirements.txt
python3 -m spacy download en_core_web_sm
```

### 3. Environment Configuration

#### Backend (.env in server/)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NLP_SERVICE_URL=http://localhost:8000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

#### NLP Service (.env in nlp-service/)
```env
ENVIRONMENT=development
LOG_LEVEL=debug
MODEL_PATH=en_core_web_sm
MAX_FILE_SIZE=10485760
SUPPORTED_FORMATS=pdf,docx,txt
```

### 4. Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /usr/local/var/mongodb
```

### 5. Start All Services

#### Option A: Using the Startup Script (Recommended)
```bash
./start-project.sh
```

#### Option B: Manual Start

**Terminal 1 - NLP Service:**
```bash
cd nlp-service
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **NLP Service**: http://localhost:8000

## 🧪 Testing the Setup

### Health Checks
```bash
# Test Backend
curl http://localhost:5001/api/health

# Test NLP Service
curl http://localhost:8000/health

# Test Frontend
curl http://localhost:5173
```

### Test User Flow
1. Open http://localhost:5173
2. Click "Sign Up" to create an account
3. Upload a resume (PDF/DOCX)
4. View ATS score and analysis
5. Browse job matches

## 📁 Project Structure

```
AIResume_Analyser/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   └── package.json
├── nlp-service/           # Python NLP Service
│   ├── main.py           # FastAPI app
│   ├── resume_analyzer.py # NLP logic
│   └── requirements.txt
├── start-project.sh      # Startup script
├── stop-project.sh       # Stop script
└── README.md
```

## 🔧 Configuration Options

### Port Configuration
- **Frontend**: 5173 (Vite default)
- **Backend**: 5001 (changed from 5000 to avoid conflicts)
- **NLP Service**: 8000

### Database Configuration
- **MongoDB**: Local instance on port 27017
- **Database Name**: ai-resume-analyzer

### File Upload
- **Max Size**: 10MB
- **Supported Formats**: PDF, DOCX, TXT
- **Upload Path**: server/uploads/

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5001
lsof -i :8000
lsof -i :5173

# Kill processes
pkill -f "node"
pkill -f "uvicorn"
pkill -f "vite"
```

#### 2. MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb-community
```

#### 3. Python Dependencies Issues
```bash
# Reinstall Python dependencies
cd nlp-service
pip install -r requirements.txt --force-reinstall

# Download spaCy model
python3 -m spacy download en_core_web_sm
```

#### 4. Node.js Dependencies Issues
```bash
# Clear npm cache and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Logs
Check logs in the `logs/` directory:
- `logs/backend.log` - Backend server logs
- `logs/nlp-service.log` - NLP service logs
- `logs/frontend.log` - Frontend logs

## 🛑 Stopping Services

### Using the Stop Script
```bash
./stop-project.sh
```

### Manual Stop
```bash
# Kill all related processes
pkill -f "uvicorn"
pkill -f "node.*src/index.js"
pkill -f "vite"
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Endpoints
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/user/me` - Get user resumes
- `GET /api/resume/:id` - Get specific resume

### Job Endpoints
- `GET /api/jobs` - Get jobs
- `GET /api/jobs/external` - Get external jobs
- `POST /api/jobs/:id/apply` - Apply for job

### NLP Service Endpoints
- `GET /health` - Health check
- `POST /analyze-file` - Analyze resume file
- `POST /analyze-text` - Analyze text
- `GET /skills` - Get supported skills

## 🔒 Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in server/.env
2. **Environment Variables**: Never commit .env files
3. **File Upload**: Validate file types and sizes
4. **CORS**: Configure CORS for production

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Render/AWS)
```bash
cd server
npm install --production
NODE_ENV=production npm start
```

### NLP Service (Docker)
```bash
cd nlp-service
docker build -t nlp-service .
docker run -p 8000:8000 nlp-service
```

## 📞 Support

If you encounter issues:
1. Check the logs in `logs/` directory
2. Verify all services are running
3. Check environment variables
4. Ensure MongoDB is running
5. Verify all dependencies are installed 