from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from resume_analyzer import ResumeAnalyzer

app = FastAPI(
    title="AI Resume Analyzer - NLP Service",
    description="NLP microservice for resume analysis and ATS scoring",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize resume analyzer
analyzer = ResumeAnalyzer()

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    ats_score: float
    skills: List[dict]
    experience: dict
    education: List[dict]
    contact: dict
    recommendations: List[str]
    processing_time: float

@app.get("/")
async def root():
    return {
        "message": "AI Resume Analyzer NLP Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "nlp-resume-analyzer",
        "version": "1.0.0"
    }

@app.post("/analyze-text", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Analyze resume text and return ATS score and extracted information
    """
    try:
        result = analyzer.analyze_text(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-file", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    """
    Analyze uploaded resume file (PDF, DOC, DOCX)
    """
    try:
        # Check file type
        if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOC, or DOCX files."
            )
        
        # Read file content
        content = await file.read()
        
        # Extract text and analyze
        result = analyzer.analyze_file(content, file.filename)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File analysis failed: {str(e)}")

@app.get("/skills")
async def get_skills():
    """
    Get list of supported skills for matching
    """
    try:
        skills = analyzer.get_supported_skills()
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get skills: {str(e)}")

@app.post("/extract-skills")
async def extract_skills(request: AnalysisRequest):
    """
    Extract skills from text
    """
    try:
        skills = analyzer.extract_skills(request.text)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 