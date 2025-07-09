import re
import time
import io
from typing import List, Dict, Any
import PyPDF2
from docx import Document
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import pandas as pd
import numpy as np

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ResumeAnalyzer:
    def __init__(self):
        """Initialize the resume analyzer with NLP models"""
        self.nlp = spacy.load("en_core_web_sm")
        
        # Common skills database
        self.skills_database = {
            'programming_languages': [
                'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
                'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'powershell'
            ],
            'frameworks': [
                'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
                'spring', 'laravel', 'asp.net', 'fastapi', 'gin', 'echo'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
                'sql server', 'dynamodb', 'cassandra', 'elasticsearch'
            ],
            'cloud_platforms': [
                'aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'linode',
                'kubernetes', 'docker', 'terraform', 'ansible'
            ],
            'tools': [
                'git', 'jenkins', 'jira', 'confluence', 'slack', 'trello',
                'figma', 'sketch', 'photoshop', 'illustrator'
            ]
        }
        
        # ATS keywords for scoring
        self.ats_keywords = {
            'action_verbs': [
                'developed', 'implemented', 'designed', 'managed', 'led', 'created',
                'built', 'maintained', 'optimized', 'improved', 'increased', 'decreased',
                'coordinated', 'collaborated', 'analyzed', 'researched', 'tested'
            ],
            'quantifiable_words': [
                'increased', 'decreased', 'improved', 'reduced', 'achieved',
                'delivered', 'completed', 'managed', 'led', 'supervised'
            ]
        }

    def extract_text_from_pdf(self, content: bytes) -> str:
        """Extract text from PDF content"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def extract_text_from_docx(self, content: bytes) -> str:
        """Extract text from DOCX content"""
        try:
            doc = Document(io.BytesIO(content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Failed to extract text from DOCX: {str(e)}")

    def extract_text_from_file(self, content: bytes, filename: str) -> str:
        """Extract text from various file formats"""
        if filename.lower().endswith('.pdf'):
            return self.extract_text_from_pdf(content)
        elif filename.lower().endswith(('.doc', '.docx')):
            return self.extract_text_from_docx(content)
        else:
            raise Exception("Unsupported file format")

    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information from text"""
        contact = {
            'email': '',
            'phone': '',
            'location': ''
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact['email'] = email_match.group()
        
        # Extract phone
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact['phone'] = ''.join(phone_match.groups())
        
        # Extract location (basic pattern)
        location_pattern = r'([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*),?\s*([A-Z]{2})'
        location_match = re.search(location_pattern, text)
        if location_match:
            contact['location'] = f"{location_match.group(1)}, {location_match.group(2)}"
        
        return contact

    def extract_skills(self, text: str) -> List[Dict[str, Any]]:
        """Extract skills from text with confidence scores"""
        text_lower = text.lower()
        skills = []
        
        # Check each skill category
        for category, skill_list in self.skills_database.items():
            for skill in skill_list:
                if skill.lower() in text_lower:
                    # Calculate confidence based on context
                    confidence = self._calculate_skill_confidence(text_lower, skill.lower())
                    if confidence > 0.3:  # Minimum confidence threshold
                        skills.append({
                            'name': skill.title(),
                            'confidence': confidence,
                            'category': category
                        })
        
        # Remove duplicates and sort by confidence
        unique_skills = {}
        for skill in skills:
            if skill['name'] not in unique_skills or skill['confidence'] > unique_skills[skill['name']]['confidence']:
                unique_skills[skill['name']] = skill
        
        return sorted(unique_skills.values(), key=lambda x: x['confidence'], reverse=True)

    def _calculate_skill_confidence(self, text: str, skill: str) -> float:
        """Calculate confidence score for a skill based on context"""
        confidence = 0.0
        
        # Base confidence if skill is mentioned
        if skill in text:
            confidence += 0.5
        
        # Higher confidence if skill appears multiple times
        count = text.count(skill)
        if count > 1:
            confidence += min(0.3, count * 0.1)
        
        # Higher confidence if skill appears near experience keywords
        experience_keywords = ['experience', 'worked', 'developed', 'implemented', 'used']
        for keyword in experience_keywords:
            if keyword in text and skill in text:
                # Check if they appear in the same sentence
                sentences = sent_tokenize(text)
                for sentence in sentences:
                    if skill in sentence.lower() and keyword in sentence.lower():
                        confidence += 0.2
                        break
        
        return min(confidence, 1.0)

    def extract_experience(self, text: str) -> Dict[str, Any]:
        """Extract experience information from text"""
        # Simple pattern matching for years of experience
        years_pattern = r'(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience'
        years_match = re.search(years_pattern, text.lower())
        
        years = 0
        if years_match:
            years = int(years_match.group(1))
        
        # Determine experience level
        level = 'junior'
        if years >= 5:
            level = 'senior'
        elif years >= 2:
            level = 'mid'
        
        return {
            'years': years,
            'level': level
        }

    def extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information from text"""
        education = []
        
        # Common degree patterns
        degree_patterns = [
            r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|Ph\.D\.)\s*(?:of\s*)?(?:Science|Arts|Engineering|Technology|Computer Science)',
            r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|Ph\.D\.)\s*(?:in\s*)?(?:Computer Science|Engineering|Technology|Information Technology)'
        ]
        
        for pattern in degree_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Try to extract institution and year
                sentence = self._get_sentence_with_match(text, match.start())
                
                # Extract institution (simplified)
                institution = self._extract_institution(sentence)
                
                # Extract year
                year_match = re.search(r'20\d{2}', sentence)
                year = int(year_match.group()) if year_match else None
                
                education.append({
                    'degree': match.group(),
                    'institution': institution,
                    'year': year
                })
        
        return education

    def _get_sentence_with_match(self, text: str, match_pos: int) -> str:
        """Get the sentence containing a match"""
        sentences = sent_tokenize(text)
        for sentence in sentences:
            if match_pos <= len(sentence):
                return sentence
        return ""

    def _extract_institution(self, sentence: str) -> str:
        """Extract institution name from sentence"""
        # Simple pattern for university names
        university_patterns = [
            r'(?:University|College|Institute)\s+of\s+[A-Z][a-z]+',
            r'[A-Z][a-z]+\s+(?:University|College|Institute)'
        ]
        
        for pattern in university_patterns:
            match = re.search(pattern, sentence)
            if match:
                return match.group()
        
        return "Unknown Institution"

    def calculate_ats_score(self, text: str) -> float:
        """Calculate ATS compatibility score"""
        score = 0.0
        text_lower = text.lower()
        
        # Check for action verbs
        action_verb_count = sum(1 for verb in self.ats_keywords['action_verbs'] if verb in text_lower)
        score += min(action_verb_count * 2, 20)  # Max 20 points for action verbs
        
        # Check for quantifiable achievements
        quantifiable_count = sum(1 for word in self.ats_keywords['quantifiable_words'] if word in text_lower)
        score += min(quantifiable_count * 3, 30)  # Max 30 points for quantifiable words
        
        # Check for proper formatting (basic checks)
        if 'experience' in text_lower:
            score += 10
        if 'education' in text_lower:
            score += 10
        if 'skills' in text_lower:
            score += 10
        
        # Check for contact information
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
            score += 10
        
        # Check for bullet points or structured format
        if re.search(r'[•·▪▫◦‣⁃]', text) or re.search(r'^\s*[-*+]\s', text, re.MULTILINE):
            score += 10
        
        return min(score, 100)  # Cap at 100

    def generate_recommendations(self, text: str, ats_score: float) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        text_lower = text.lower()
        
        if ats_score < 70:
            recommendations.append("Add more action verbs to describe your achievements")
            recommendations.append("Include quantifiable results and metrics")
        
        if not re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
            recommendations.append("Add your email address to the resume")
        
        if 'experience' not in text_lower:
            recommendations.append("Add a clear 'Experience' section")
        
        if 'education' not in text_lower:
            recommendations.append("Add a clear 'Education' section")
        
        if 'skills' not in text_lower:
            recommendations.append("Add a dedicated 'Skills' section")
        
        if not re.search(r'[•·▪▫◦‣⁃]', text) and not re.search(r'^\s*[-*+]\s', text, re.MULTILINE):
            recommendations.append("Use bullet points to improve readability")
        
        if len(recommendations) == 0:
            recommendations.append("Your resume looks good! Consider adding more specific achievements")
        
        return recommendations

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze resume text and return comprehensive results"""
        start_time = time.time()
        
        # Extract information
        contact = self.extract_contact_info(text)
        skills = self.extract_skills(text)
        experience = self.extract_experience(text)
        education = self.extract_education(text)
        ats_score = self.calculate_ats_score(text)
        recommendations = self.generate_recommendations(text, ats_score)
        
        processing_time = time.time() - start_time
        
        return {
            'ats_score': ats_score,
            'skills': skills,
            'experience': experience,
            'education': education,
            'contact': contact,
            'recommendations': recommendations,
            'processing_time': processing_time
        }

    def analyze_file(self, content: bytes, filename: str) -> Dict[str, Any]:
        """Analyze resume file and return comprehensive results"""
        # Extract text from file
        text = self.extract_text_from_file(content, filename)
        
        # Analyze the extracted text
        return self.analyze_text(text)

    def get_supported_skills(self) -> List[str]:
        """Get list of all supported skills"""
        all_skills = []
        for category, skills in self.skills_database.items():
            all_skills.extend(skills)
        return sorted(all_skills) 