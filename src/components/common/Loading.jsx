// src/components/common/Loading.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const Loading = ({ 
  message = "Arşiv yükleniyor, lütfen bekleyin...", 
  size = 36,
  fullScreen = false,
  className = "" 
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 bg-[#FFFDFB]/80 backdrop-blur-xs flex flex-col items-center justify-center p-4"
    : "flex flex-col items-center justify-center py-16 px-4 w-full";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${containerClasses} ${className}`}
    >
      <div className="flex flex-col items-center gap-3 text-[#A06A42]">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon name="loader" size={size} spin variant="primary" />
        </motion.div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm font-bold text-[#2B3B2E]/80 tracking-wide text-center"
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Loading;
