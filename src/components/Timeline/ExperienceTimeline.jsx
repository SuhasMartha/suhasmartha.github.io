import React from "react";
import { motion } from "framer-motion";

const ExperienceTimeline = () => {
  const experienceData = [
    {
      id: 1,
      period: "Sept 2025",
      position: "Internship",
      company: "IIT Guwahati, Technology Innovation & Development Foundation",
      location: "Remote",
      type: "Internship",
      description: "Focused on creating modern, responsive web interfaces using React.js and Tailwind CSS. Worked closely with UI/UX designers to implement pixel-perfect designs.",
      status: "current"
    },
    {
      id: 2,
      period: "Jun 2025",
      position: "AI Developer Intern",
      company: "Viswam AI",
      location: "IIIT Hyderabad - Hybrid",
      type: "Internship",
      description: "Developed inclusive AI solutions for low-resource languages (Telugu) under a collaborative initiative by IIIT-H, Meta, Ozonetel, Swecha, and TASK",
      status: "completed"
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
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 dark:bg-green-400";
      case "current":
        return "bg-blue-500 dark:bg-blue-400";
      case "seeking":
        return "bg-yellow-500 dark:bg-yellow-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "current":
        return "Current";
      case "seeking":
        return "Seeking";
      default:
        return "Unknown";
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
      <div className="absolute right-8 top-0 h-full w-0.5 bg-gradient-to-b from-lhilit-1 via-lhilit-2 to-transparent dark:from-dhilit-1 dark:via-dhilit-2"></div>

      <div className="space-y-8">
        {experienceData.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="relative flex items-start justify-end"
          >
            {/* Content card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mr-6 flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Period and status */}
              <div className="mb-3 flex items-center justify-between">
                <div className="inline-block rounded-full bg-lhilit-1 px-3 py-1 text-sm font-semibold text-white dark:bg-dhilit-1">
                  {item.period}
                </div>
                <div className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(item.status)}`}>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Position and company */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {item.position}
              </h3>
              <h4 className="text-lg font-semibold text-lhilit-1 dark:text-dhilit-1">
                {item.company}
              </h4>

              {/* Location and type */}
              <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{item.location}</span>
                <span className="mx-2">•</span>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700">
                  {item.type}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </motion.div>

            {/* Timeline dot */}
            <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center">
              <div className={`h-4 w-4 rounded-full shadow-lg ${getStatusColor(item.status)}`}></div>
              <div className={`absolute h-8 w-8 rounded-full animate-pulse ${getStatusColor(item.status).replace('bg-', 'bg-').replace('dark:bg-', 'dark:bg-')}/20`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceTimeline;