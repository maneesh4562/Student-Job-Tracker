const axios = require('axios');

class JobScraper {
  constructor() {
    this.apis = {
      // Free job APIs (you can add more)
      github: 'https://jobs.github.com/positions.json',
      // Add more APIs as needed
    };
  }

  async scrapeGitHubJobs(params = {}) {
    try {
      const response = await axios.get(this.apis.github, {
        params: {
          description: params.keywords || 'developer',
          location: params.location || '',
          full_time: params.fullTime || false,
          page: params.page || 0
        },
        timeout: 10000
      });

      return response.data.map(job => ({
        title: job.title,
        company: {
          name: job.company,
          logo: job.company_logo,
          website: job.company_url
        },
        location: {
          city: job.location,
          remote: job.location.toLowerCase().includes('remote')
        },
        description: job.description,
        requirements: {
          skills: this.extractSkillsFromDescription(job.description)
        },
        salary: {
          min: null,
          max: null,
          currency: 'USD'
        },
        type: job.type || 'full-time',
        source: 'github',
        externalId: job.id,
        url: job.url,
        createdAt: new Date(job.created_at)
      }));
    } catch (error) {
      console.error('GitHub Jobs API error:', error.message);
      return [];
    }
  }

  extractSkillsFromDescription(description) {
    // Simple skill extraction from job description
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue',
      'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
      'Git', 'Jenkins', 'Jira', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust'
    ];

    const skills = [];
    const descLower = description.toLowerCase();

    commonSkills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    return skills;
  }

  async scrapeMultipleSources(params = {}) {
    const jobs = [];

    // Scrape from GitHub Jobs
    try {
      const githubJobs = await this.scrapeGitHubJobs(params);
      jobs.push(...githubJobs);
    } catch (error) {
      console.error('Failed to scrape GitHub Jobs:', error.message);
    }

    // Add more job sources here
    // Example: LinkedIn, Indeed, etc.

    return jobs;
  }

  async searchJobs(keywords, location, limit = 20) {
    const params = {
      keywords: keywords.join(' '),
      location: location,
      page: 0
    };

    const jobs = await this.scrapeMultipleSources(params);
    return jobs.slice(0, limit);
  }

  // Mock job data for development/testing
  getMockJobs() {
    return [
      {
        title: 'Frontend Developer',
        company: {
          name: 'Tech Corp',
          logo: null,
          website: 'https://techcorp.com'
        },
        location: {
          city: 'San Francisco, CA',
          remote: false
        },
        description: 'We are looking for a skilled Frontend Developer with experience in React and JavaScript.',
        requirements: {
          skills: ['React', 'JavaScript', 'CSS', 'HTML']
        },
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD'
        },
        type: 'full-time',
        source: 'mock',
        externalId: 'mock-1',
        url: 'https://example.com/job1',
        createdAt: new Date()
      },
      {
        title: 'Full Stack Engineer',
        company: {
          name: 'Startup Inc',
          logo: null,
          website: 'https://startupinc.com'
        },
        location: {
          city: 'Remote',
          remote: true
        },
        description: 'Join our team as a Full Stack Engineer working with Node.js and React.',
        requirements: {
          skills: ['Node.js', 'React', 'MongoDB', 'JavaScript']
        },
        salary: {
          min: 70000,
          max: 100000,
          currency: 'USD'
        },
        type: 'full-time',
        source: 'mock',
        externalId: 'mock-2',
        url: 'https://example.com/job2',
        createdAt: new Date()
      },
      {
        title: 'Python Developer',
        company: {
          name: 'Data Solutions',
          logo: null,
          website: 'https://datasolutions.com'
        },
        location: {
          city: 'New York, NY',
          remote: false
        },
        description: 'Looking for a Python developer with experience in data analysis and machine learning.',
        requirements: {
          skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL']
        },
        salary: {
          min: 90000,
          max: 130000,
          currency: 'USD'
        },
        type: 'full-time',
        source: 'mock',
        externalId: 'mock-3',
        url: 'https://example.com/job3',
        createdAt: new Date()
      }
    ];
  }
}

module.exports = new JobScraper(); 