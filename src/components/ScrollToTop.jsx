import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Calculate scroll progress and visibility
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    setScrollProgress(progress);
    setIsVisible(scrollTop > 300);
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circle properties
  const size = 56;
  const strokeWidth = 4; // Increased stroke width
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Theme colors
  const trackColor = isDark ? '#374151' : '#E5E7EB'; // Darker track for dark mode
  const gradientId = `progressGradient-${isDark ? 'dark' : 'light'}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          {/* Progress circle container */}
          <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg
              className="absolute inset-0 -rotate-90 transform"
              width={size}
              height={size}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeWidth}
                className="transition-colors duration-300"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isDark ? '#d8b4fe' : '#be0eec'} /> {/* Lighter purple for dark mode visibility */}
                  <stop offset="100%" stopColor={isDark ? '#c084fc' : '#9e3dc1'} />
                </linearGradient>
              </defs>
            </svg>

            {/* Main button */}
            <div className="absolute inset-1.5 overflow-hidden rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center">
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-lhilit-2 to-lhilit-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dhilit-2 dark:to-dhilit-1"></div>

              {/* Arrow icon */}
              <motion.svg
                className="relative h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </motion.svg>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;