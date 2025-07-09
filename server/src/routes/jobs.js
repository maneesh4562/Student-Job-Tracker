const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const jobScraper = require('../utils/jobScraper');

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Recruiters only)
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      benefits,
      type,
      tags
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      benefits,
      type,
      tags,
      postedBy: req.user._id
    });

    await job.save();

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Server error during job creation' });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      skills,
      limit = 10,
      page = 1
    } = req.query;

    const query = { status: 'active' };

    // Add search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Add location filter
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Add type filter
    if (type) {
      query.type = type;
    }

    // Add skills filter
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query['requirements.skills'] = { $in: skillArray };
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name company.name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/jobs/match/:resumeId
// @desc    Get job matches for a resume
// @access  Private
router.get('/match/:resumeId', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get resume skills
    const resumeSkills = resume.analysis.skills.map(skill => skill.name);

    // Find matching jobs
    const jobs = await Job.find({
      status: 'active',
      'requirements.skills': { $in: resumeSkills }
    })
    .populate('postedBy', 'name company.name')
    .limit(10);

    // Calculate match scores
    const jobsWithScores = jobs.map(job => {
      const jobSkills = job.requirements.skills;
      const matchingSkills = resumeSkills.filter(skill => 
        jobSkills.includes(skill)
      );
      const matchScore = Math.round((matchingSkills.length / jobSkills.length) * 100);

      return {
        ...job.toObject(),
        matchScore: Math.min(matchScore, 100)
      };
    });

    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ jobs: jobsWithScores });
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { resumeId } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.find(
      app => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Calculate match score
    const resumeSkills = resume.analysis.skills.map(skill => skill.name);
    const jobSkills = job.requirements.skills;
    const matchingSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
    const matchScore = Math.round((matchingSkills.length / jobSkills.length) * 100);

    // Add application
    job.applications.push({
      user: req.user._id,
      resume: resumeId,
      matchScore: Math.min(matchScore, 100),
      status: 'applied'
    });

    await job.save();

    res.json({
      message: 'Application submitted successfully',
      matchScore: Math.min(matchScore, 100)
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job posting
// @access  Private (Job poster only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user posted this job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job posting
// @access  Private (Job poster only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user posted this job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/jobs/external
// @desc    Get jobs from external sources
// @access  Public
router.get('/external', async (req, res) => {
  try {
    const { keywords, location, limit = 10 } = req.query;
    
    let jobs = [];
    
    if (process.env.NODE_ENV === 'development') {
      // Use mock data in development
      jobs = jobScraper.getMockJobs();
    } else {
      // Use real job scraping in production
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : ['developer'];
      jobs = await jobScraper.searchJobs(keywordArray, location, parseInt(limit));
    }
    
    res.json({ jobs });
  } catch (error) {
    console.error('External jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch external jobs' });
  }
});

// @route   GET /api/jobs/match-skills
// @desc    Get job matches based on skills
// @access  Public
router.get('/match-skills', async (req, res) => {
  try {
    const { skills, location, limit = 10 } = req.query;
    
    if (!skills) {
      return res.status(400).json({ error: 'Skills parameter is required' });
    }
    
    const skillArray = skills.split(',').map(skill => skill.trim());
    
    let jobs = [];
    
    if (process.env.NODE_ENV === 'development') {
      // Use mock data in development with skill matching
      const mockJobs = jobScraper.getMockJobs();
      jobs = mockJobs.map(job => {
        const jobSkills = job.requirements.skills;
        const matchingSkills = skillArray.filter(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        const matchScore = Math.round((matchingSkills.length / Math.max(skillArray.length, jobSkills.length)) * 100);
        
        return {
          ...job,
          matchScore: Math.min(matchScore, 100),
          matchingSkills
        };
      }).filter(job => job.matchScore > 0);
      
      // Sort by match score
      jobs.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      // Use real job scraping in production
      jobs = await jobScraper.searchJobs(skillArray, location, parseInt(limit));
      
      // Calculate match scores for real jobs
      jobs = jobs.map(job => {
        const jobSkills = job.requirements.skills;
        const matchingSkills = skillArray.filter(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        const matchScore = Math.round((matchingSkills.length / Math.max(skillArray.length, jobSkills.length)) * 100);
        
        return {
          ...job,
          matchScore: Math.min(matchScore, 100),
          matchingSkills
        };
      }).filter(job => job.matchScore > 0);
      
      // Sort by match score
      jobs.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    res.json({ 
      jobs: jobs.slice(0, parseInt(limit)),
      totalFound: jobs.length,
      skillsSearched: skillArray
    });
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

module.exports = router; 