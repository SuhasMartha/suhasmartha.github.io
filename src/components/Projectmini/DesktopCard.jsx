import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

const DesktopCard = ({ project }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: [-5, -12],
        rotate: [0, -2, 2, -1, 1, 0],
        scale: 1.02,
      }}
      transition={{
        y: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        rotate: {
          duration: 0.5,
          ease: "backOut",
        },
        scale: {
          duration: 0.2,
        },
      }}
      className="relative w-full h-full min-h-[180px] rounded-2xl isolate overflow-hidden group cursor-pointer"
    >
      {/* Background with Blur */}
      <div className="absolute inset-0 bg-2ndry-2/10 dark:bg-primary-4/30 backdrop-blur-xl transition-all duration-500 rounded-2xl border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700/50"></div>

      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 40%)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 pl-10">

        {/* Decorative Vertical Line */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 h-3/4 w-1 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-700 rounded-full opacity-50 group-hover:h-[85%] group-hover:from-lhilit-1 group-hover:opacity-100 transition-all duration-500"></div>

        <div className="flex flex-col justify-center flex-grow pl-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-lhilit-1 dark:group-hover:text-dhilit-1 transition-colors duration-300 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
            {project.description}
          </p>
        </div>

        {/* Tools List */}
        <div className="mt-6 flex flex-wrap gap-2 pl-4">
          {project.softUsed.map((tech, index) => (
            <span
              key={index}
              className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 bg-white/40 dark:bg-black/20 group-hover:border-lhilit-1/30 dark:group-hover:border-dhilit-1/30 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCard;
