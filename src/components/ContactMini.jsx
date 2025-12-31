import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

const ContactMini = ({ htitle, container, container2 }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Detect if `dark` class is present on <html>
  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            status: 'unread'
          }
        ]);

      if (!error) {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
      } else {
        console.error('Supabase error:', error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const color = isDarkMode ? "e5e7eb" : "282C33";

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/suhas-martha/",
      text: "LinkedIn"
    },
    {
      name: "GitHub",
      url: "https://github.com/SuhasMartha",
      text: "GitHub"
    },
    {
      name: "Discord",
      url: "https://discord.com/channels/@me/itsme_suhas",
      text: "Discord"
    },
    {
      name: "Telegram",
      url: "https://t.me/itsme_suhass",
      text: "Telegram"
    },
    {
      name: "Email",
      url: "mailto:suhasmartha@gmail.com",
      text: "Email"
    }
  ];

  return (
    <>
      <div>
        <div className="mx-auto px-10">
          {/* Contact Section Layout */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Side - Contact Matter */}
            <div className="space-y-6">
              <motion.p
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-lg"
              >
                I'm looking forward to being a part of your team! Let me help you
                develop your ideas into an internet reality.
              </motion.p>

              <motion.p
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-gray-600 dark:text-gray-400"
              >
                Whether you're looking for a passionate developer to join your team,
                have a project in mind, or just want to connect and discuss technology,
                I'd love to hear from you. Let's build something amazing together!
              </motion.p>
            </div>

            {/* Right Side - Social Links */}
            <div className="flex flex-col items-center justify-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                Connect with me
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col space-y-3"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-lhilit-1 dark:hover:text-dhilit-1 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="font-medium">{social.text}</span>
                    <span className="text-lhilit-1 dark:text-dhilit-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto max-w-2xl pt-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone (with country code) *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-lhilit-1 focus:outline-none focus:ring-2 focus:ring-lhilit-1/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-dhilit-1 dark:focus:ring-dhilit-1/20 resize-none"
                  placeholder="Tell me about your project, ideas, or just say hello!"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:from-dhilit-1 dark:to-dhilit-2"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {/* Background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-lhilit-2 to-lhilit-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dhilit-2 dark:to-dhilit-1"></div>

                  {/* Button content */}
                  <div className="relative flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span className="transition-all duration-300 group-hover:tracking-wider">
                          Send Message
                        </span>
                      </>
                    )}
                  </div>

                  {/* Ripple effect */}
                  <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20"></div>
                </motion.button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Message sent successfully! I'll get back to you soon.
                    </span>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-900/20 dark:border-red-800"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      Failed to send message. Please try again or email me directly.
                    </span>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
        {htitle !== "contact" && (
          <div className="contactmebutton relative pt-10 text-right">
            <div className="border-lhilit-1 dark:border-dhilit-1 group relative inline-block border-2 text-sm font-medium">
              <a href="/contact#contact" className="size-4">
                <span className="line dark:bg-primary bg-2ndry-1 size-3"></span>
                <div className="dark:bg-primary px-3 py-3">Other...</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactMini;