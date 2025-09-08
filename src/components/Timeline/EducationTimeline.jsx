import React from "react";
import { motion } from "framer-motion";

const EducationTimeline = () => {
  const educationData = [
    {
      id: 1,
      year: "2022 - 2026",
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering (Data Science)",
      institution: "SR Univerity",
      location: "Warangal, Telangana",
      grade: "CGPA: 7.4",
      description: "Specialized in Data Structures, Algorithms, Web Development, and Database Management Systems.",
      
    },
    {
      id: 2,
      year: "2020 - 2022",
      degree: "Intermediate",
      field: "MPC",
      institution: "PAGE Junior College",
      location: "Hyderabad, Telangana",
      grade: "Percentage: 90%",
      description: "Focused on Physics, Chemistry, Mathematics with Computer Science as additional subject.",
      
    },
    {
      id: 3,
      year: "2020",
      degree: "Secondary Schooling",
      field: "",
      institution: "Raman High School",
      location: "Warangal, Telangana",
      grade: "CGPA: 10",
      description: "Strong foundation in core subjects.",
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-lhilit-1 via-lhilit-2 to-transparent dark:from-dhilit-1 dark:via-dhilit-2"></div>

      <div className="space-y-8">
        {educationData.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-lhilit-1 dark:bg-dhilit-1 shadow-lg"></div>
              <div className="absolute h-8 w-8 rounded-full bg-lhilit-1/20 dark:bg-dhilit-1/20 animate-pulse"></div>
            </div>

            {/* Content card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="ml-6 flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Year badge */}
              <div className="mb-3 inline-block rounded-full bg-lhilit-1 px-3 py-1 text-sm font-semibold text-white dark:bg-dhilit-1">
                {item.year}
              </div>

              {/* Degree and field */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {item.degree}
              </h3>
              <h4 className="text-lg font-semibold text-lhilit-1 dark:text-dhilit-1">
                {item.field}
              </h4>

              {/* Institution */}
              <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{item.institution}</span>
                <span className="mx-2">•</span>
                <span>{item.location}</span>
              </div>

              {/* Grade */}
              <div className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                {item.grade}
              </div>

              {/* Description */}
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EducationTimeline;