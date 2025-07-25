import React, { useEffect } from "react";
import Titles from "../components/TitlesOther";
import TitlesS from "../components/TitlesSlash";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import AboutMini from "../components/AboutMini";
import Skillset from "../components/Skillset";
import Footer from "../components/Footer";
import EducationTimeline from "../components/Timeline/EducationTimeline";
import ExperienceTimeline from "../components/Timeline/ExperienceTimeline";
import AchievementsGallery from "../components/Gallery/AchievementsGallery";
import { motion } from "framer-motion";
import MouseHover from "../components/MouseHover";
import FunFacts from "../components/FunFacts";

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const scrollToHash = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
      requestAnimationFrame(scrollToHash);
    }
  }, [location]);

  const container = (delay) => ({
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: delay },
    },
  });
  const container2 = (delay) => ({
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: delay },
    },
  });

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="relative z-0"></div>
      <MouseHover />
      <Navbar />
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-25"></div>
      <div className="mycontainer scroll-smooth pb-10">
        <TitlesS htitle="about" />
        <motion.p variants={container2(0.5)} initial="hidden" animate="visible">
          Quick about me...
        </motion.p>
        <AboutMini container={container} container2={container2} />
        
        {/* Education Section */}
        <section className="headsectdiv" id="education">
          <Titles htitle="education" />
        </section>
        <EducationTimeline />

        {/* Skills Section */}
        <section className="headsectdiv" id="skills">
          <Titles htitle="skills" />
        </section>
        <Skillset />

        {/* Experience Section */}
        <section className="headsectdiv" id="experience">
          <Titles htitle="experience" />
        </section>
        <ExperienceTimeline />

        {/* Fun Facts Section */}
        <section className="headsectdiv py-5">
          <Titles htitle="funfact" />
        </section>
        <FunFacts />
        
        &nbsp;
        <hr />
        <div className="py-8"></div>
        <Footer />
      </div>
      <div className="pb-12"></div>
    </>
  );
};

export default About;