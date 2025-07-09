import { useState } from 'react';
import { Upload, FileText, Target, Briefcase, TrendingUp, Sparkles, BarChart3, Users, Zap } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import ATSScore from '../components/ATSScore';
import JobMatches from '../components/JobMatches';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [userRole] = useState('jobseeker'); // TODO: Get from auth context
  const [resumeData, setResumeData] = useState(null);
  const isLoading = false; // TODO: Manage loading state when implementing resume upload

  // Mock data for demonstration
  const mockResumeData = {
    atsScore: 85,
    skills: ['React', 'JavaScript', 'Node.js', 'Python', 'MongoDB'],
    experience: '3 years',
    education: 'Bachelor\'s in Computer Science',
    recommendations: [
      'Add more specific achievements',
      'Include quantifiable results',
      'Optimize keywords for ATS'
    ]
  };

  const mockJobMatches = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      matchScore: 92,
      skills: ['React', 'JavaScript', 'CSS'],
      salary: '$80k - $120k'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      location: 'Remote',
      matchScore: 88,
      skills: ['React', 'Node.js', 'MongoDB'],
      salary: '$70k - $100k'
    },
    {
      id: 3,
      title: 'Software Engineer',
      company: 'Big Tech',
      location: 'Seattle, WA',
      matchScore: 85,
      skills: ['JavaScript', 'Python', 'React'],
      salary: '$90k - $130k'
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userRole === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}!
            </h1>
            <p className="text-gray-600 text-lg">
              {userRole === 'jobseeker' 
                ? 'Upload your resume to get started with AI-powered analysis and job matching.'
                : 'Manage your job postings and view applicant analytics.'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {userRole === 'jobseeker' ? (
        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Resume Upload Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ResumeUpload 
              onResumeUploaded={(data) => setResumeData(data)}
              isLoading={isLoading}
            />
          </motion.div>

          {/* ATS Score Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ATSScore 
              score={resumeData?.atsScore || mockResumeData.atsScore}
              skills={resumeData?.skills || mockResumeData.skills}
              recommendations={resumeData?.recommendations || mockResumeData.recommendations}
            />
          </motion.div>

          {/* Job Matches Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <JobMatches 
              jobs={mockJobMatches} 
              resumeData={resumeData}
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Recruiter Dashboard */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
                <p className="text-gray-600">Manage your active job listings</p>
              </div>
            </div>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">Senior Frontend Developer</h3>
                  <p className="text-sm text-gray-600">Posted 2 days ago</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  Active
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">Full Stack Engineer</h3>
                  <p className="text-sm text-gray-600">Posted 1 week ago</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  Active
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                <p className="text-gray-600">Review new applications</p>
              </div>
            </div>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">Frontend Developer</p>
                  <p className="text-xs text-gray-500">Applied 1 hour ago</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  New
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">Jane Smith</h3>
                  <p className="text-sm text-gray-600">Full Stack Engineer</p>
                  <p className="text-xs text-gray-500">Applied 3 hours ago</p>
                </div>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                  Reviewing
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Analytics Section */}
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600">Track your performance metrics</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, title: 'ATS Score', value: '85%', color: 'blue', bg: 'from-blue-500 to-blue-600' },
            { icon: Briefcase, title: 'Job Matches', value: '12', color: 'green', bg: 'from-green-500 to-green-600' },
            { icon: FileText, title: 'Skills Found', value: '8', color: 'purple', bg: 'from-purple-500 to-purple-600' },
            { icon: Target, title: 'Improvements', value: '3', color: 'orange', bg: 'from-orange-500 to-orange-600' }
          ].map((metric, index) => (
            <motion.div 
              key={metric.title}
              className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${metric.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <metric.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{metric.title}</h3>
              <p className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 