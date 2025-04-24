import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LOGO from '../assets/Logo.png';

const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for resources to load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust time as needed (1.5 seconds)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <img 
                src={LOGO} 
                alt="Briskwell Logo" 
                className="h-32 md:h-40 object-contain mb-4" 
              />
              <motion.div 
                className="w-64 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden"
              >
                <motion.div 
                  className="h-full blue-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
};

export default PageLoader;