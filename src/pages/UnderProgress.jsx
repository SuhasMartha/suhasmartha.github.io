import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../components/Footer";

const UnderProgress = () => {
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
            {/* Animated Construction Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8"
            >
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full flex items-center justify-center shadow-2xl">
                <svg 
                  className="w-16 h-16 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="head1 mb-6"
            >
              <span className="texthilit1">Under</span> Progress
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            >
              This page is currently being crafted with care. I'm working hard to bring you something amazing. 
              Please check back soon for updates!
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-2"
              >
                65% Complete
              </motion.p>
            </motion.div>

            {/* Features Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                What's Coming Soon:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  "Enhanced User Experience",
                  "New Interactive Features",
                  "Improved Performance",
                  "Mobile Optimization"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-lhilit-1 dark:bg-dhilit-1 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
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
                  <span>Go Home</span>
                </div>
              </Link>

              <Link
                to="/contact"
                className="group border-2 border-lhilit-1 dark:border-dhilit-1 rounded-full px-8 py-3 font-semibold text-lhilit-1 dark:text-dhilit-1 transition-all duration-300 hover:bg-lhilit-1 hover:text-white dark:hover:bg-dhilit-1 dark:hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Me</span>
                </div>
              </Link>
            </motion.div>

            {/* Estimated Time */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <p>Estimated completion: <span className="font-semibold">Soon™</span></p>
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

export default UnderProgress;