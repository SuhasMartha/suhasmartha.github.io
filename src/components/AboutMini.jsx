import React from "react";
import image from "../assets/DP.jpg";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const AboutMini = ({ htitle, container, container2 }) => {
  const isMobile = useMediaQuery({ maxWidth: 950 });

  return (
    <>
      {htitle !== "homeabout" ? (
        <div className="allow-select text-base md:text-lg">
          <motion.p
            variants={container(0.7)}
            initial="hidden"
            animate="visible"
            className="py-5"
          >
            Hey! You can call me
            <span className="texthilit1"> Suhas</span>!!
          </motion.p>
          <div className="flex justify-center mt-0 mb-2">
            <img
              className="w-175 h-auto"
              src={image}
              alt="profilepic"
            />
          </div>
          <motion.p
            variants={container2(0.9)}
            initial="hidden"
            animate="visible"
            className="relative py-5"
          >
            I'm an <span className="font-bold">aspiring Data Scientist</span>{" "}
            with a strong foundation in the&nbsp;
            <span className="xplain decoration-lhilit-1 dark:decoration-dhilit-1 underline-offset-4 dark:relative dark:underline">
              Python,ML,NLP,TensorFlow & PowerBI
            </span>
            <span>. </span>
            As a recent trainee, I'm eager to apply my
            skills to real-world projects and grow into a confident,
            industry-ready anlayst.
          </motion.p>
          <motion.p
            variants={container(1.3)}
            initial="hidden"
            animate="visible"
            className="py-5"
          >
            I’m someone who believes that technology should be purpose-driven—built not just to impress, but to solve real-world problems and make lives better. My passion lies in exploring how artificial intelligence, machine learning, and data science can be used to create meaningful, inclusive, and scalable solutions.
          </motion.p>
          <motion.p
            {...(isMobile
              ? {
                  whileInView: { opacity: 1, x: 0 },
                  initial: { opacity: 0, x: -100 },
                  transition: { duration: 0.5 },
                }
              : {
                  variants: container2(1.9),
                  initial: "hidden",
                  animate: "visible",
                })}
            className="py-5"
          >
            I’m constantly driven by curiosity, whether it’s understanding how systems work behind the scenes, experimenting with new tools and frameworks, or staying updated on the latest innovations in tech. I find joy in writing clean, efficient code, but what excites me even more is the impact that code can create.
          </motion.p>
          <motion.p
            {...(isMobile
              ? {
                  whileInView: { opacity: 1, x: 0 },
                  initial: { opacity: 0, x: -100 },
                  transition: { duration: 0.5 },
                }
              : {
                  variants: container(1.5),
                  initial: "hidden",
                  animate: "visible",
                })}
            className="py-5"
          >
            As a fresher, I'm constantly learning, building side projects, and
            keeping myself updated with the latest trends and tools in Data Science & AI. I'm excited about opportunities where I can learn from
            experienced teams, contribute meaningfully, and sharpen my skills
            every day.
          </motion.p>
          <motion.p
            {...(isMobile
              ? {
                  whileInView: { opacity: 1, x: 0 },
                  initial: { opacity: 0, x: -100 },
                  transition: { duration: 0.5 },
                }
              : {
                  variants: container2(1.9),
                  initial: "hidden",
                  animate: "visible",
                })}
            className="py-5"
          >
            I value collaboration, lifelong learning, and working on ideas that push boundaries. Whether it's designing intelligent systems, diving deep into patterns hidden in data, or building intuitive user experiences, I’m always up for the challenge.
          </motion.p>
          <motion.p
            {...(isMobile
              ? {
                  whileInView: { opacity: 1, x: 0 },
                  initial: { opacity: 0, x: -100 },
                  transition: { duration: 0.5 },
                }
              : {
                  variants: container2(1.9),
                  initial: "hidden",
                  animate: "visible",
                })}
            className="py-5"
          >
            Let's connect and build something awesome together!
          </motion.p>
        </div>
      ) : (
        <div className="allow-select text-base md:text-lg">
          <motion.p
            variants={container(0.9)}
            initial="hidden"
            animate="visible"
            className="py-5"
          >
            Hey! You can call me
            <span className="texthilit1"> Suhas</span>!!
          </motion.p>
          <motion.p
            {...(isMobile
              ? {
                  whileInView: { opacity: 1, x: 0 },
                  initial: { opacity: 0, x: -100 },
                  transition: { duration: 0.5 },
                }
              : {
                  variants: container2(1.1),
                  initial: "hidden",
                  animate: "visible",
                })}
            className="relative py-5"
          >
            A motivated Data Science Fresher looking to leverage my strong programming skills in Python and R, analytical aptitude, and knowledge of data visualizations to effectively analyze, interpret, and present insights from large datasets in an accurate and meaningful way. Looking to collaborate with a leading data science and AI team to develop innovative models to detect patterns and trends for complex data-driven solutions.
          </motion.p>
          <motion.p
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="py-5"
          >
            Let's connect and build something awesome together!
          </motion.p>
        </div>
      )}
    </>
  );
};

export default AboutMini;