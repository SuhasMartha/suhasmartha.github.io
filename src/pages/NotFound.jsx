import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="relative z-0"></div>
      <Navbar />

      <div className="flex min-h-screen items-center justify-center pt-25">
        <div className="mycontainer text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Animated 404 with Glitch Effect */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 relative"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    "2px 2px 0px rgba(255,0,0,0.5), -2px -2px 0px rgba(0,0,255,0.5)",
                    "-2px 2px 0px rgba(255,0,0,0.5), 2px -2px 0px rgba(0,0,255,0.5)",
                    "2px -2px 0px rgba(255,0,0,0.5), -2px 2px 0px rgba(0,0,255,0.5)"
                  ],
                  x: [0, -2, 2, -1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="text-[12rem] md:text-[16rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 tracking-tighter"
              >
                404
              </motion.h1>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-40">
                <span className="text-[12rem] md:text-[16rem] leading-none font-black text-red-500 blur-[2px] animate-pulse">404</span>
              </div>
            </motion.div>

            {/* Binary Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: Math.random() * 1000 }}
                  animate={{ y: 1000 }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                  }}
                  className="absolute text-2xl font-mono dark:text-green-500 text-gray-500 font-bold"
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}
            </div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-mono text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
            >
              &lt;System Error: <span className="text-red-500">RouteMissing</span> /&gt;
            </motion.h2>

            {/* Error Icon replaced with decorative code graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8 flex justify-center"
            >
              <div className="bg-gray-900 rounded-lg p-6 shadow-xl max-w-xs w-full text-left font-mono text-xs">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-green-400">root@portfolio:~$ navigate --to "{window.location.pathname}"</div>
                <div className="text-red-400">$ echo "The requested resource has disconnected from this reality.</div>
                <div className="text-green-400"> $ suggested_action --redirect="safe_zone</div>
                <div className="text-red-400">Error: 404 Not Found</div>
                <div className="text-gray-400">Trying alternative paths...</div>
                <div className="text-blue-400 animate-pulse">Loading suggestions...</div>
              </div>
            </motion.div>

            {/* Helpful Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Here's what you can do:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  { text: "Go back to homepage", icon: "🏠", link: "/" },
                  { text: "Visit Fun Zone (Games)", icon: "🎮", link: "/games" },
                  { text: "Check out my projects", icon: "💼", link: "/projects" },
                  { text: "Get in touch", icon: "📧", link: "/contact" }
                ].map((item, index) => (
                  <Link
                    to={item.link}
                    key={index}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl dark:from-dhilit-1 dark:to-dhilit-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lhilit-2 to-lhilit-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dhilit-2 dark:to-dhilit-1"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Take Me Home</span>
                </div>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group border-2 border-lhilit-1 dark:border-dhilit-1 rounded-full px-8 py-3 font-semibold text-lhilit-1 dark:text-dhilit-1 transition-all duration-300 hover:bg-lhilit-1 hover:text-white dark:hover:bg-dhilit-1 dark:hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Go Back</span>
                </div>
              </button>

              <Link
                to="/projects"
                className="group border-2 border-gray-300 dark:border-gray-600 rounded-full px-8 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 hover:border-lhilit-1 hover:text-lhilit-1 dark:hover:border-dhilit-1 dark:hover:text-dhilit-1"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>View Projects</span>
                </div>
              </Link>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
              className="mt-8 p-4 bg-lhilit-1/10 dark:bg-dhilit-1/10 rounded-lg border border-lhilit-1/20 dark:border-dhilit-1/20"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Fun Fact:</span> The first 404 error was discovered at CERN in 1992.
                You're now part of internet history! 🎉
              </p>
            </motion.div>
          </motion.div>
          &nbsp;
          <hr />
          <div className="py-8"></div>
          <Footer />
          <div className="pb-12"></div>
        </div>
      </div>
    </>
  );
};

export default NotFound;