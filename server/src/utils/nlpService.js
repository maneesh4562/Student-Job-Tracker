const axios = require('axios');

class NLPService {
  constructor() {
    this.baseURL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async analyzeText(text) {
    try {
      const response = await this.client.post('/analyze-text', { text });
      return response.data;
    } catch (error) {
      console.error('NLP Service error (analyze-text):', error.message);
      throw new Error('Failed to analyze resume text');
    }
  }

  async analyzeFile(fileBuffer, filename) {
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', fileBuffer, filename);

      const response = await this.client.post('/analyze-file', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      return response.data;
    } catch (error) {
      console.error('NLP Service error (analyze-file):', error.message);
      throw new Error('Failed to analyze resume file');
    }
  }

  async extractSkills(text) {
    try {
      const response = await this.client.post('/extract-skills', { text });
      return response.data.skills;
    } catch (error) {
      console.error('NLP Service error (extract-skills):', error.message);
      throw new Error('Failed to extract skills');
    }
  }

  async getSupportedSkills() {
    try {
      const response = await this.client.get('/skills');
      return response.data.skills;
    } catch (error) {
      console.error('NLP Service error (get-skills):', error.message);
      // Return default skills if service is unavailable
      return [
        'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB',
        'SQL', 'AWS', 'Docker', 'Git', 'TypeScript'
      ];
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('NLP Service health check failed:', error.message);
      return false;
    }
  }
}

module.exports = new NLPService(); 