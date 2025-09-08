import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <footer className="w-full py-1">
      <div className="container mx-auto flex items-center justify-between px-2">
        {/* Copyright - Center */}
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <span className="block sm:inline">© 2025 Suhas Martha - </span>{' '}
          <span className="block sm:inline">All rights reserved</span>
        </div>

        {/* Contact Link - Far Right */}
        <Link 
          to="/contact" 
          className="text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-lhilit-1 dark:text-gray-400 dark:hover:text-dhilit-1"
        >
          Contact
        </Link>
      </div>
    </footer>
  );
};

export default Footer;