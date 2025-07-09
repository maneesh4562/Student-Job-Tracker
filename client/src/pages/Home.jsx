import { Link } from 'react-router-dom';
import { Upload, Target, Users, BarChart3, ArrowRight, CheckCircle, Star, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Zap className="w-4 h-4" />
          <span>AI-Powered Resume Analysis</span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Transform Your Resume
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Get instant ATS scoring, skill extraction, and job matching recommendations. 
          Optimize your resume for better job opportunities with our advanced AI technology.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          )}
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className="flex justify-center space-x-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600">Resumes Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">500+</div>
            <div className="text-gray-600">Jobs Matched</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose Our Platform?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Upload,
              title: "Easy Upload",
              description: "Simply drag and drop your resume to get started",
              color: "blue"
            },
            {
              icon: Target,
              title: "ATS Scoring",
              description: "Get instant feedback on your resume's ATS compatibility",
              color: "purple"
            },
            {
              icon: Users,
              title: "Job Matching",
              description: "Find relevant job opportunities based on your skills",
              color: "green"
            },
            {
              icon: BarChart3,
              title: "Analytics",
              description: "Track your application performance and improvements",
              color: "orange"
            }
          ].map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 rounded-2xl relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10"></div>
        </div>
        
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4" />
            <span>Join 10,000+ Job Seekers</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Career?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of job seekers who have improved their chances with our AI-powered resume analysis
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home; 