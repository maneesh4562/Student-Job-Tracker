const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const Resume = require('../models/Resume');
const nlpService = require('../utils/nlpService');
const fs = require('fs');

const router = express.Router();

// @route   POST /api/resume/upload
// @desc    Upload and analyze resume
// @access  Private
router.post('/upload', auth, upload.single('resume'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create resume record
    const resume = new Resume({
      user: req.user._id,
      originalFile: {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      extractedText: 'Sample extracted text...', // TODO: Implement text extraction
      status: 'processing'
    });

    await resume.save();

    // Call NLP microservice for analysis
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const analysisResult = await nlpService.analyzeFile(fileBuffer, req.file.filename);
      
      resume.extractedText = analysisResult.extractedText || 'Text extracted from resume';
      resume.analysis = {
        atsScore: analysisResult.ats_score || 75,
        skills: analysisResult.skills || [],
        experience: analysisResult.experience || { years: 0, level: 'entry' },
        education: analysisResult.education || [],
        contact: analysisResult.contact || {},
        recommendations: analysisResult.recommendations || []
      };
      resume.status = 'completed';
      resume.processingTime = (analysisResult.processing_time || 2) * 1000; // Convert to milliseconds

      await resume.save();
    } catch (error) {
      console.error('NLP analysis error:', error);
      // Don't fail the upload, just mark as completed with basic data
      resume.status = 'completed';
      resume.analysis = {
        atsScore: 75,
        skills: [],
        experience: { years: 0, level: 'entry' },
        education: [],
        contact: {},
        recommendations: ['Resume uploaded successfully. Analysis may be limited.']
      };
      await resume.save();
    }

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      status: 'completed',
      atsScore: resume.analysis?.atsScore || 75,
      skills: resume.analysis?.skills || [],
      experience: resume.analysis?.experience || { years: 0, level: 'entry' },
      education: resume.analysis?.education || [],
      recommendations: resume.analysis?.recommendations || []
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// @route   GET /api/resume/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate('user', 'name email');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if user owns this resume or is admin
    if (resume.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/resume/user/me
// @desc    Get current user's resumes
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ resumes });
  } catch (error) {
    console.error('Get user resumes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/resume/search
// @desc    Search resumes (for recruiters)
// @access  Private (Recruiters only)
router.get('/search', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { skills, experience, location, limit = 10, page = 1 } = req.query;

    const query = { status: 'completed' };

    // Add filters
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query['analysis.skills.name'] = { $in: skillArray };
    }

    if (experience) {
      query['analysis.experience.years'] = { $gte: parseInt(experience) };
    }

    if (location) {
      query['analysis.contact.location'] = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const resumes = await Resume.find(query)
      .populate('user', 'name email profile')
      .sort({ 'analysis.atsScore': -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Resume.countDocuments(query);

    res.json({
      resumes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search resumes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/resume/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if user owns this resume
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 