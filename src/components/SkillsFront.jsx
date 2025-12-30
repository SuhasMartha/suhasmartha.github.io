import React from "react";

import python from "./Images/python.png";
import sql from "./Images/sql.png";
import bi from "./Images/bi.png";
import tensor from "./Images/tensor.png";
import react from "./Images/reactlogo.svg";
import aws from "./Images/aws.png";
import { motion } from "framer-motion";

const SkillsFront = () => {
  // Duplicate logos to create seamless loop
  const logos = [
    { tool: "Python", image: python },
    { tool: "SQL", image: sql },
    { tool: "React", image: react },
    { tool: "AWS", image: aws },
    { tool: "Tensor Flow", image: tensor },
    { tool: "Power BI", image: bi },
    // Duplicate for loop
    { tool: "Python", image: python },
    { tool: "SQL", image: sql },
    { tool: "React", image: react },
    { tool: "AWS", image: aws },
    { tool: "Tensor Flow", image: tensor },
    { tool: "Power BI", image: bi },
    // and one more set for smoother bigger screens if needed
    { tool: "Python", image: python },
    { tool: "SQL", image: sql },
    { tool: "React", image: react },
    { tool: "AWS", image: aws },
    { tool: "Tensor Flow", image: tensor },
    { tool: "Power BI", image: bi },
  ];

  return (
    <div className="w-full overflow-hidden py-10 relative">
      <motion.div
        className="flex w-max gap-12"
        animate={{ x: ["-33.33%", "0%"] }} // Move Right
        transition={{
          duration: 20, // Adjust speed here
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <img
              src={logo.image}
              alt={logo.tool}
              className="w-full h-full object-contain p-2"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsFront;
