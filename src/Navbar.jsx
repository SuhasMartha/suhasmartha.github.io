import React, { useState } from "react";
import { Link } from "react-router-dom";
import mainlogo from "./assets/favicon-512x512.png";
import burger from "./assets/burger.svg"; // Use any burger icon
import LightBulb from "./components/LightBulb";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-2ndry-1/95 backdrop-blur-sm pt-3 shadow-sm border-b border-lhilit-1/20 dark:bg-primary/95 dark:border-dhilit-1/20">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={mainlogo} className="h-6" alt="Logo" />
          <span className="text-primary dark:text-2ndry-1 self-center text-2xl font-semibold whitespace-nowrap">
            Sm.
          </span>
        </a>
        {/* Buttons */}
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {/* Light bulb toggle - simplified without tooltip */}
          <div className="relative scale-125 transition-transform lg:scale-150 xl:scale-175">
            <LightBulb />
          </div>

          {/* Toggle mobile menu */}
          <button
            onClick={toggleMenu}
            type="button"
            className="text-lhilit-1 dark:text-dhilit-1 hover:bg-lhilit-1/10 dark:hover:bg-dhilit-1/10 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 inline-flex h-8 w-8 items-center justify-center rounded-lg p-1 text-sm focus:ring-2 focus:outline-none md:hidden"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen}
          >
            <span className="material-symbols-outlined">menu</span>
            <span className="sr-only">Open main menu</span>
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } w-full items-center justify-between md:order-1 md:flex md:w-auto`}
          id="navbar-cta"
        >
          <ul className="mt-4 flex flex-col rounded-lg bg-2ndry-1/90 dark:bg-primary/90 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 md:bg-transparent md:dark:bg-transparent rtl:space-x-reverse">
            <li>
              <Link to="/" className="navilink">
                <span className="texthilit1">#</span>Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="navilink">
                <span className="texthilit1">#</span>About
              </Link>
            </li>
            <li>
              <Link to="/projects" className="navilink">
                <span className="texthilit1">#</span>Projects
              </Link>
            </li>
            <li>
              <Link to="/blog" className="navilink" >
                <span className="texthilit1">#</span>Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="navilink">
                <span className="texthilit1">#</span>Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
