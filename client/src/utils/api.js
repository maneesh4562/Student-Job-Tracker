const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to set auth token
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Helper method to remove auth token
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Helper method to make requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Resume APIs
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/resume/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getResume(resumeId) {
    return this.request(`/resume/${resumeId}`);
  }

  async getUserResumes() {
    return this.request('/resume/user/me');
  }

  async searchResumes(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/resume/search?${queryString}`);
  }

  async deleteResume(resumeId) {
    return this.request(`/resume/${resumeId}`, {
      method: 'DELETE',
    });
  }

  // Job APIs
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async getJob(jobId) {
    return this.request(`/jobs/${jobId}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getJobMatches(resumeId) {
    return this.request(`/jobs/match/${resumeId}`);
  }

  async applyForJob(jobId, resumeId) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ resumeId }),
    });
  }

  async getExternalJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs/external?${queryString}`);
  }

  async getJobMatchesBySkills(skills, location = '', limit = 10) {
    const params = {
      skills: Array.isArray(skills) ? skills.join(',') : skills,
      location,
      limit
    };
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs/match-skills?${queryString}`);
  }

  // User APIs
  async getDashboard() {
    return this.request('/users/dashboard');
  }

  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserApplications() {
    return this.request('/users/applications');
  }

  async getJobApplications(jobId) {
    return this.request(`/users/job-applications/${jobId}`);
  }

  async updateApplicationStatus(jobId, userId, status) {
    return this.request(`/users/job-applications/${jobId}/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { includeAuth: false });
  }
}

export default new ApiService(); 