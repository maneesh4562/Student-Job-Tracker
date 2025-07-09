const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role === 'jobseeker') {
      // Job seeker dashboard
      const resumes = await Resume.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5);

      const totalResumes = await Resume.countDocuments({ user: userId });
      const completedResumes = await Resume.countDocuments({ 
        user: userId, 
        status: 'completed' 
      });

      // Get recent job applications
      const recentApplications = await Job.aggregate([
        {
          $match: {
            'applications.user': userId
          }
        },
        {
          $unwind: '$applications'
        },
        {
          $match: {
            'applications.user': userId
          }
        },
        {
          $sort: { 'applications.appliedAt': -1 }
        },
        {
          $limit: 5
        },
        {
          $project: {
            jobTitle: '$title',
            companyName: '$company.name',
            applicationStatus: '$applications.status',
            matchScore: '$applications.matchScore',
            appliedAt: '$applications.appliedAt'
          }
        }
      ]);

      res.json({
        user: req.user,
        stats: {
          totalResumes,
          completedResumes,
          averageATSScore: resumes.length > 0 
            ? resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length 
            : 0
        },
        recentResumes: resumes,
        recentApplications
      });

    } else if (req.user.role === 'recruiter') {
      // Recruiter dashboard
      const postedJobs = await Job.find({ postedBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

      const totalJobs = await Job.countDocuments({ postedBy: userId });
      const activeJobs = await Job.countDocuments({ 
        postedBy: userId, 
        status: 'active' 
      });

      // Get recent applications for posted jobs
      const recentApplications = await Job.aggregate([
        {
          $match: {
            postedBy: userId
          }
        },
        {
          $unwind: '$applications'
        },
        {
          $sort: { 'applications.appliedAt': -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'users',
            localField: 'applications.user',
            foreignField: '_id',
            as: 'applicant'
          }
        },
        {
          $unwind: '$applicant'
        },
        {
          $project: {
            jobTitle: '$title',
            applicantName: '$applicant.name',
            applicantEmail: '$applicant.email',
            applicationStatus: '$applications.status',
            matchScore: '$applications.matchScore',
            appliedAt: '$applications.appliedAt'
          }
        }
      ]);

      res.json({
        user: req.user,
        stats: {
          totalJobs,
          activeJobs,
          totalApplications: recentApplications.length
        },
        postedJobs,
        recentApplications
      });

    } else {
      // Admin dashboard
      const totalUsers = await User.countDocuments();
      const totalResumes = await Resume.countDocuments();
      const totalJobs = await Job.countDocuments();

      res.json({
        user: req.user,
        stats: {
          totalUsers,
          totalResumes,
          totalJobs
        }
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.profile.phone = phone;
    if (location) user.profile.location = location;
    if (bio) user.profile.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

// @route   GET /api/users/applications
// @desc    Get user's job applications (for job seekers)
// @access  Private
router.get('/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await Job.aggregate([
      {
        $match: {
          'applications.user': req.user._id
        }
      },
      {
        $unwind: '$applications'
      },
      {
        $match: {
          'applications.user': req.user._id
        }
      },
      {
        $sort: { 'applications.appliedAt': -1 }
      },
      {
        $project: {
          jobTitle: '$title',
          companyName: '$company.name',
          location: '$location',
          applicationStatus: '$applications.status',
          matchScore: '$applications.matchScore',
          appliedAt: '$applications.appliedAt'
        }
      }
    ]);

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/job-applications/:jobId
// @desc    Get applications for a specific job (for recruiters)
// @access  Private
router.get('/job-applications/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const job = await Job.findById(req.params.jobId)
      .populate('applications.user', 'name email profile')
      .populate('applications.resume', 'analysis');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user posted this job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ applications: job.applications });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/job-applications/:jobId/:userId/status
// @desc    Update application status (for recruiters)
// @access  Private
router.put('/job-applications/:jobId/:userId/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user posted this job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find and update application
    const application = job.applications.find(
      app => app.user.toString() === req.params.userId
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await job.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 