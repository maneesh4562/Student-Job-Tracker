# AI Resume Analyzer - NLP Service

Python FastAPI microservice for resume analysis and ATS scoring using NLP techniques.

## Features

- **Text Extraction**: Extract text from PDF, DOC, and DOCX files
- **Skill Extraction**: Identify and categorize technical skills with confidence scores
- **ATS Scoring**: Calculate ATS compatibility scores based on keywords and formatting
- **Contact Extraction**: Extract email, phone, and location information
- **Experience Analysis**: Determine years of experience and skill level
- **Education Parsing**: Extract degree and institution information
- **Recommendations**: Generate improvement suggestions for resumes

## Tech Stack

- **FastAPI** - Modern Python web framework
- **spaCy** - Industrial-strength NLP library
- **NLTK** - Natural Language Toolkit
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX file processing
- **scikit-learn** - Machine learning utilities
- **pandas** - Data manipulation

## API Endpoints

### Health Check
- `GET /` - Service information
- `GET /health` - Health check endpoint

### Analysis
- `POST /analyze-text` - Analyze resume text
- `POST /analyze-file` - Analyze uploaded resume file
- `POST /extract-skills` - Extract skills from text
- `GET /skills` - Get supported skills list

## Getting Started

### Prerequisites

- Python 3.8+
- pip or conda

### Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

3. Start the service:
```bash
python main.py
```

The service will start on `http://localhost:8000`

### Using Docker

```bash
# Build the image
docker build -t nlp-service .

# Run the container
docker run -p 8000:8000 nlp-service
```

## API Usage

### Analyze Text

```bash
curl -X POST "http://localhost:8000/analyze-text" \
     -H "Content-Type: application/json" \
     -d '{
       "text": "John Doe\nSoftware Engineer\n5 years of experience with Python, React, and Node.js..."
     }'
```

### Analyze File

```bash
curl -X POST "http://localhost:8000/analyze-file" \
     -F "file=@resume.pdf"
```

### Response Format

```json
{
  "ats_score": 85.0,
  "skills": [
    {
      "name": "Python",
      "confidence": 0.95,
      "category": "programming_languages"
    },
    {
      "name": "React",
      "confidence": 0.88,
      "category": "frameworks"
    }
  ],
  "experience": {
    "years": 5,
    "level": "senior"
  },
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of Technology",
      "year": 2018
    }
  ],
  "contact": {
    "email": "john.doe@email.com",
    "phone": "1234567890",
    "location": "San Francisco, CA"
  },
  "recommendations": [
    "Add more specific achievements with quantifiable results",
    "Include relevant keywords from job descriptions"
  ],
  "processing_time": 0.5
}
```

## Skills Database

The service includes a comprehensive skills database organized by categories:

- **Programming Languages**: Python, JavaScript, Java, C++, etc.
- **Frameworks**: React, Angular, Vue, Node.js, Django, etc.
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis, etc.
- **Cloud Platforms**: AWS, Azure, GCP, Docker, Kubernetes, etc.
- **Tools**: Git, Jenkins, Jira, Figma, etc.

## ATS Scoring Algorithm

The ATS scoring system evaluates resumes based on:

1. **Action Verbs** (20 points max)
   - developed, implemented, designed, managed, led, etc.

2. **Quantifiable Achievements** (30 points max)
   - increased, decreased, improved, achieved, etc.

3. **Proper Formatting** (30 points max)
   - Experience section, Education section, Skills section
   - Contact information, bullet points

4. **Structure** (20 points max)
   - Clear sections, proper formatting

## Configuration

Environment variables can be set in a `.env` file:

```
NLP_MODEL=en_core_web_sm
CONFIDENCE_THRESHOLD=0.3
MAX_FILE_SIZE=5242880  # 5MB
```

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Code Structure

```
nlp-service/
├── main.py              # FastAPI application
├── resume_analyzer.py   # Core NLP analysis logic
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── tests/              # Test files
```

## Integration with Backend

The NLP service is designed to be called by the Node.js backend:

```javascript
// Example backend integration
const response = await axios.post('http://localhost:8000/analyze-file', formData);
const analysis = response.data;
```

## Performance

- **Text Analysis**: ~0.5 seconds for typical resumes
- **File Processing**: ~1-2 seconds including text extraction
- **Concurrent Requests**: Supports multiple simultaneous analyses
- **Memory Usage**: ~200MB for spaCy model

## TODO

- [ ] Add more sophisticated skill extraction using ML models
- [ ] Implement job description parsing for better matching
- [ ] Add support for more file formats (RTF, TXT)
- [ ] Improve education and experience extraction accuracy
- [ ] Add sentiment analysis for recommendation generation
- [ ] Implement caching for repeated analyses
- [ ] Add comprehensive test coverage
- [ ] Add API rate limiting
- [ ] Add monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 