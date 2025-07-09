import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ResumeUpload = ({ onResumeUploaded, isLoading }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Real upload with progress tracking
      setUploadProgress(0);
      setUploadStage('Uploading resume...');
      
      try {
        // Upload file to backend
        const uploadResponse = await api.uploadResume(file);
        
        setUploadProgress(50);
        setUploadStage('Analyzing with AI...');
        
        // The backend should handle NLP processing and return results
        const analysisData = uploadResponse;
        
        setUploadProgress(100);
        setUploadStage('Analysis complete!');
        
        // Pass the real analysis data to parent component
        onResumeUploaded(analysisData);
        
        toast.success('Resume analyzed successfully!');
        
        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0);
          setUploadStage('');
        }, 1000);
        
      } catch (error) {
        console.error('Resume upload failed:', error);
        toast.error(error.message || 'Failed to upload and analyze resume');
        setUploadProgress(0);
        setUploadStage('');
      }
    }
  }, [onResumeUploaded]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const removeFile = () => {
    acceptedFiles.splice(0, 1);
  };

  const handleAnalyzeClick = async () => {
    if (acceptedFiles.length > 0) {
      await onDrop(acceptedFiles);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>
          <p className="text-gray-600">Get AI-powered analysis and ATS scoring</p>
        </div>
      </div>
      
      {acceptedFiles.length === 0 ? (
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
          
          {isDragActive ? (
            <motion.p 
              className="text-blue-600 font-semibold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Drop your resume here...
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-700 mb-3 text-lg font-medium">
                Drag & drop your resume here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </motion.div>
          )}
        </motion.div>
              ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-between p-6 border-2 border-green-200 rounded-xl bg-green-50"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{acceptedFiles[0].name}</p>
                  <p className="text-sm text-gray-500">
                    {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
            
            {/* Upload Progress */}
            <AnimatePresence>
              {(isLoading || uploadProgress > 0) && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">{uploadStage || 'Processing...'}</p>
                        <p className="text-sm text-blue-600">AI is analyzing your resume</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-blue-700 text-center">{uploadProgress}%</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Upload Button */}
            <motion.button
              onClick={handleAnalyzeClick}
              disabled={isLoading || uploadProgress > 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-5 h-5" />
              <span>{isLoading || uploadProgress > 0 ? 'Processing...' : 'Analyze Resume'}</span>
            </motion.button>
          </motion.div>
        )}
        
        {/* Tips Section */}
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Tips for better ATS scoring:</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use standard section headings (Experience, Education, Skills)</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Include relevant keywords from job descriptions</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use bullet points for achievements</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Keep formatting simple and clean</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    );
};

export default ResumeUpload; 