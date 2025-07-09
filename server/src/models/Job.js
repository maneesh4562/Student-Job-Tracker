const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    size: String // startup, small, medium, large
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    skills: [String],
    experience: {
      min: Number,
      max: Number,
      level: String // junior, mid, senior, lead
    },
    education: String
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  benefits: [String],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    matchScore: Number,
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  source: {
    type: String,
    enum: ['manual', 'api', 'scraped'],
    default: 'manual'
  },
  externalId: String, // For jobs from external APIs
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for faster queries
jobSchema.index({ title: 'text', 'company.name': 'text', description: 'text' });
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });

module.exports = mongoose.model('Job', jobSchema); 