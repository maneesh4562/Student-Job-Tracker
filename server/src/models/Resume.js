const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFile: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  },
  extractedText: {
    type: String,
    required: true
  },
  analysis: {
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    skills: [{
      name: String,
      confidence: Number,
      category: String
    }],
    experience: {
      years: Number,
      level: String // junior, mid, senior
    },
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    contact: {
      email: String,
      phone: String,
      location: String
    },
    recommendations: [String]
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  processingTime: Number, // in milliseconds
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ 'analysis.skills.name': 1 });

module.exports = mongoose.model('Resume', resumeSchema); 