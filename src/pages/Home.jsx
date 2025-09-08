"use client";

import React from "react";
import { Link } from "react-router-dom";
import Titles from "../components/TitlesHome";
import HorizontalLine from "../components/HorizontalLine";
import "../styles/Home.css";
import ContactMini from "../components/ContactMini";
import SkillFront from "../components/SkillsFront";
import Footer from "../components/Footer";
import "../styles/ButtonAnimation.css";
import Projectmini from "../components/Projectmini/Projectmini";
import Navbar from "../Navbar";
import AboutMini from "../components/AboutMini";
import Quote from "../components/Quote";
import { motion, useInView } from "framer-motion";

function TypingEffect({
  texts = ["AI & ML Engineer", "Student"],
  speed = 100,
}) {
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopIndex, setLoopIndex] = React.useState(0);
  const [typingSpeed, setTypingSpeed] = React.useState(speed);
  const [blink, setBlink] = React.useState(true);

  React.useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[loopIndex % texts.length];

      setText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
        setTypingSpeed(50);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopIndex((prev) => prev + 1);
        setTypingSpeed(speed);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopIndex, texts, typingSpeed, speed]);

  // Optional blinking cursor
  React.useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className="texthilit1">
      {text}
      <span className="cursor">{blink ? "|" : " "}</span>
    </span>
  );
}

// Social Media Icons Component
const SocialIcons = ({ isDarkMode }) => {
  const color = isDarkMode ? "e5e7eb" : "282C33";

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: `https://img.icons8.com/?size=100&id=447&format=png&color=${color}`,
      url: "https://www.linkedin.com/in/suhas-martha/",
      hoverColor: "hover:bg-blue-600",
    },
    {
      name: "GitHub",
      icon: `https://img.icons8.com/?size=100&id=12598&format=png&color=${color}`,
      url: "https://github.com/SuhasMartha",
      hoverColor: "hover:bg-gray-700",
    },
    {
      name: "Gmail",
      icon: `https://img.icons8.com/?size=100&id=QqtDTGEho4jP&format=png&color=${color}`,
      url: "mailto:suhasmartha@gmail.com",
      hoverColor: "hover:bg-red-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="flex justify-start gap-4 py-6"
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-lg dark:border-gray-600 dark:bg-gray-800 ${social.hoverColor}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
        >
          <img
            src={social.icon}
            alt={social.name}
            className="h-6 w-6 transition-all duration-300 group-hover:brightness-0 group-hover:invert"
          />

          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded-lg bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
            {social.name}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
};

// Resume Download Button Component
const ResumeButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.8 }}
      className="flex justify-start py-4"
    >
      <motion.button
        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl dark:from-dhilit-1 dark:to-dhilit-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Replace with your actual resume file path
          const link = document.createElement("a");
          link.href =
            "https://drive.google.com/file/d/10HmZzXS1ICjiBFbgrmvgxPTswoGnGgs8/view"; // Add your resume file to public folder
          link.download = "Suhas_Resume.pdf";
          link.click();
        }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-lhilit-2 to-lhilit-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dhilit-2 dark:to-dhilit-1"></div>

        {/* Button content */}
        <div className="relative flex items-center gap-2">
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="transition-all duration-300 group-hover:tracking-wider">
            Download Resume
          </span>
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20"></div>
      </motion.button>
    </motion.div>
  );
};

const Home = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Detect dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode(); // Initial check

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

      {/* Main content wrapper */}
      <div className="relative z-0"></div>
      <Navbar />
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-33"></div>
      <div className="mycontainer">
        <header className="">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            {/* Left side - Text content */}
            <div className="order-2 md:order-1">
              <div className="allow-select">
                <motion.h1
                  variants={container(0.5)}
                  initial="hidden"
                  animate="visible"
                  className="head1 whitespace-nowrap"
                >
                  Hello, It's me
                  <div className="text-4xl font-bold">Suhas Martha</div>
                </motion.h1>
                <div className="head1 whitespace-nowrap">
                  And I'm a{" "}
                  <TypingEffect
                    texts={[
                      " Student",
                      " Data Scientist",
                      " AI & Data Engineer",
                    ]}
                  />
                </div>
              </div>

              {/* Social Media Icons - positioned below name */}
              <SocialIcons isDarkMode={isDarkMode} />

              {/* Resume Download Button - positioned below social icons */}
              <ResumeButton />
            </div>
          </div>
        </header>

        <br />

        <div id="aboutme py-5">
          <header className="headsectdiv">
            <Titles htitle="about" />
            <div className="col-span-1"></div>
          </header>
          <AboutMini
            htitle="homeabout"
            container={container}
            container2={container2}
          />
          <div className="contactmebutton relative">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="border-lhilit-1 dark:border-dhilit-1 group relative inline-block border-2 text-sm font-medium"
            >
              <Link to="/about#about" className="size-4">
                <span className="line dark:bg-primary bg-2ndry-1 size-3"></span>
                <div className="dark:bg-primary px-3 py-3"> Read more ...</div>
              </Link>
            </motion.div>
          </div>
          <Quote />
        </div>

        <div id="skills">
          <header className="headsectdiv">
            <Titles htitle="skills" />
            <div className="">
              <motion.button
                className="btn2b right relative left-3/4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1, delay: 0.5 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about#skillset"
                  className="border-2ndry-2 btn2 border-2 p-1"
                >
                  <span className="spn2">
                    {" "}
                    see
                    <span className="texthilit1 pr-1">&#126;{">"}</span>
                  </span>
                </Link>
              </motion.button>
            </div>
          </header>
          <div>
            <SkillFront container={container} container2={container2} />
          </div>
        </div>

        <div id="projects ">
          <header className="headsectdiv">
            <Titles htitle="works" />
            <div>
              <motion.button
                className="btn2b right relative left-3/4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.6, delay: 0.3 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/projects#projects"
                  className="border-2ndry-2 btn2 border-2 p-1"
                >
                  <span className="spn2">
                    {" "}
                    view
                    <span className="texthilit1 pr-1">&#126;{">"}</span>
                  </span>
                </Link>
              </motion.button>
            </div>
          </header>
          <Projectmini container={container} container2={container2} />
        </div>

        <div id="contact" className="py-10">
          <header className="headsectdiv">
            <Titles htitle="contact" />
            <div className="pt-4 sm:col-span-1 md:col-span-3">
              <HorizontalLine delay={1.2} />
            </div>
          </header>
          <ContactMini container={container} container2={container2} />
        </div>
        <hr />
        <div className="py-8"></div>
        <Footer />
      </div>
      <div className="pb-12"></div>
    </>
  );
};

export default Home;
