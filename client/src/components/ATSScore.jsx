import { CheckCircle, AlertCircle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const ATSScore = ({ score = 0, skills = [], recommendations = [] }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return 'stroke-green-600';
    if (score >= 60) return 'stroke-yellow-600';
    return 'stroke-red-600';
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ATS Score</h2>
          <p className="text-gray-600">Your resume's compatibility score</p>
        </div>
      </div>
      
      {/* Score Circle */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={`${(score / 100) * 440} 440`}
              className={getScoreRingColor(score)}
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 440" }}
              animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className="text-sm text-gray-500 font-medium">ATS Score</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Score Status */}
      <motion.div 
        className={`text-center p-4 rounded-xl mb-8 ${getScoreBgColor(score)} border-2 border-opacity-20 ${
          score >= 80 ? 'border-green-300' : score >= 60 ? 'border-yellow-300' : 'border-red-300'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {score >= 80 ? (
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-green-800 text-lg">Excellent ATS Compatibility</span>
          </motion.div>
        ) : score >= 60 ? (
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <span className="font-semibold text-yellow-800 text-lg">Good ATS Compatibility</span>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-red-800 text-lg">Needs Improvement</span>
          </motion.div>
        )}
      </motion.div>

      {/* Skills Found */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-lg">Skills Detected</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <motion.span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-xl font-medium border border-blue-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Recommendations</h3>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ATSScore; 