import React from "react";

import python from "./Images/python.png";
import sql from "./Images/sql.png";
import bi from "./Images/bi.png";
import tensor from "./Images/tensor.png";
import react from "./Images/reactlogo.svg";
import aws from "./Images/aws.png";
import { motion } from "framer-motion";

const SkillsFront = ({ container, container2 }) => {
  // Accept both duration and delay for staggered animation
  const skillanime = (duration, delay) => ({
    initial: { y: -10 },
    animate: {
      y: [10, -10],
      transition: {
        duration: duration,
        delay: delay,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  });

  const logos = [
    {
      tool: "Python",
      image: python,
    },
    {
      tool: "SQL",
      image: sql,
    },
    {
      tool: "React",
      image: react,
    },
    {
      tool: "AWS",
      image: aws,
    },
    {
      tool: "Tensor Flow",
      image: tensor,
    },
    {
      tool: "Power BI",
      image: bi,
    },
  ];

  return (
    <>
      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -150 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
      >
        {logos.map((logo, index) => (
          <motion.section
            key={index}
            variants={skillanime(2 + index * 0.7)}
            initial="initial"
            animate="animate"
            className="skillLogo"
          >
            <div className="group relative">
              <img
                src={logo.image}
                alt={logo.tool}
                className="hover:bg-primary-3 rounded-md"
              />
            </div>
          </motion.section>
        ))}
      </motion.div>
    </>
  );
};

export default SkillsFront;
