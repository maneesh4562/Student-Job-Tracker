import { useState, useEffect } from 'react';
import { MapPin, Building, DollarSign, Star, Briefcase, ExternalLink, Bookmark, TrendingUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';


const JobMatches = ({ jobs: propJobs = [], resumeData = null }) => {
  const [jobs, setJobs] = useState(propJobs);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const fetchJobMatches = async () => {
    if (!resumeData) return;
    
    setLoading(true);
    try {
      // Try to get job matches based on resume skills
      const skills = resumeData.skills || [];
      if (skills.length > 0) {
        const response = await api.getJobMatchesBySkills(skills, '', 10);
        setJobs(response.jobs || []);
        if (response.jobs && response.jobs.length > 0) {
          toast.success(`Found ${response.jobs.length} matching jobs!`);
        } else {
          toast.info('No exact matches found. Showing general job listings.');
          // Fallback to general job search
          const fallbackResponse = await api.getExternalJobs({ limit: 10 });
          setJobs(fallbackResponse.jobs || []);
        }
      } else {
        // Fallback to general job search
        const response = await api.getExternalJobs({ limit: 10 });
        setJobs(response.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch job matches:', error);
      toast.error('Failed to load job matches');
      // Use fallback mock data
      setJobs(propJobs);
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    setRefreshing(true);
    await fetchJobMatches();
    setRefreshing(false);
    toast.success('Job matches refreshed!');
  };

  useEffect(() => {
    if (resumeData && resumeData.skills) {
      fetchJobMatches();
    }
  }, [resumeData]);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Matches</h2>
            <p className="text-gray-600">Opportunities tailored to your skills</p>
          </div>
        </div>
        {resumeData && (
          <motion.button
            onClick={refreshJobs}
            disabled={refreshing || loading}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        )}
      </div>
      
      {jobs.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No job matches found</h3>
          <p className="text-gray-500">Upload your resume to see matching opportunities</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <motion.div 
              key={job.id} 
              className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-gradient-to-r from-white to-gray-50/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                <motion.span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchColor(job.matchScore)} border`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {job.matchScore}% match
                </motion.span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{job.company?.name || job.company || 'Company'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">{job.location?.city || job.location || 'Location'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">
                    {job.salary?.min && job.salary?.max 
                      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                      : job.salary || 'Salary not specified'
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-medium">{job.type || 'Full-time'}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-gray-700">Required Skills:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(job.requirements?.skills || job.skills || []).map((skill, index) => (
                    <motion.span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-lg font-medium border ${
                        job.matchingSkills?.includes(skill)
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                      {job.matchingSkills?.includes(skill) && (
                        <span className="ml-1 text-green-600">✓</span>
                      )}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply Now</span>
                </motion.button>
                <motion.button 
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {jobs.length > 0 && (
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center justify-center space-x-2 mx-auto px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Matches</span>
            <ExternalLink className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobMatches; 