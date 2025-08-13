import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AchievementsGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sample data - replace with your actual achievements
  const achievements = [
    {
      id: 1,
      type: "certificate",
      title: "Full Stack Development Certification",
      description: "Completed comprehensive MERN stack development course",
      image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2024",
      category: "Education",
      link: "#" // Link to PDF or certificate
    },
    {
      id: 2,
      type: "project",
      title: "Portfolio Website v2.0",
      description: "Modern responsive portfolio built with React & Tailwind",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2024",
      category: "Project",
      link: "https://github.com/nashnc/portfolio"
    },
    {
      id: 3,
      type: "achievement",
      title: "Hackathon Winner",
      description: "First place in college tech fest web development competition",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2023",
      category: "Competition",
      link: "#"
    },
    {
      id: 4,
      type: "certificate",
      title: "JavaScript ES6+ Certification",
      description: "Advanced JavaScript concepts and modern features",
      image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2023",
      category: "Education",
      link: "#"
    },
    {
      id: 5,
      type: "project",
      title: "OTT Streaming Platform",
      description: "Full-stack streaming application with user authentication",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2024",
      category: "Project",
      link: "https://github.com/nashnc/ottStreamingPlatform"
    },
    {
      id: 6,
      type: "achievement",
      title: "Dean's List",
      description: "Academic excellence recognition for 3 consecutive semesters",
      image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "2022-2023",
      category: "Academic",
      link: "#"
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === achievements.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, achievements.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? achievements.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === achievements.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "education":
        return "bg-blue-500 dark:bg-blue-400";
      case "project":
        return "bg-green-500 dark:bg-green-400";
      case "competition":
        return "bg-purple-500 dark:bg-purple-400";
      case "academic":
        return "bg-yellow-500 dark:bg-yellow-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "certificate":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
        );
      case "project":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        );
      case "achievement":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Main Gallery Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-2xl dark:from-gray-800 dark:to-gray-900">
        
        {/* Header with Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Achievements Gallery
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} / {achievements.length}
              </span>
            </div>
          </div>
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center rounded-full bg-lhilit-1 p-2 text-white transition-all duration-300 hover:bg-lhilit-2 dark:bg-dhilit-1 dark:hover:bg-dhilit-2"
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="relative h-96 overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex"
            >
              {/* Image Section */}
              <div className="relative w-1/2 overflow-hidden rounded-l-xl">
                <img
                  src={achievements[currentIndex].image}
                  alt={achievements[currentIndex].title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Type Icon */}
                <div className="absolute top-4 left-4 flex items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-sm">
                  {getTypeIcon(achievements[currentIndex].type)}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex w-1/2 flex-col justify-center bg-white p-8 dark:bg-gray-800">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${getCategoryColor(achievements[currentIndex].category)}`}>
                    {achievements[currentIndex].category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {achievements[currentIndex].title}
                </h4>

                {/* Description */}
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {achievements[currentIndex].description}
                </p>

                {/* Date */}
                <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-500">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {achievements[currentIndex].date}
                </div>

                {/* View Button */}
                <a
                  href={achievements[currentIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-lhilit-1 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-lhilit-2 dark:bg-dhilit-1 dark:hover:bg-dhilit-2"
                >
                  View Details
                  <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-6 flex justify-center space-x-2">
          {achievements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-lhilit-1 dark:bg-dhilit-1"
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-lhilit-1 dark:bg-dhilit-1"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentIndex + 1) / achievements.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Grid Preview of All Items */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {achievements.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${
              index === currentIndex
                ? "ring-2 ring-lhilit-1 dark:ring-dhilit-1"
                : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-20 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-1 left-1 right-1">
              <p className="truncate text-xs font-medium text-white">
                {item.title}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsGallery;