import React from "react";
import soon from "../assets/soon.webp";
import ContactMini from "../components/ContactMini";
import Navbar from "../Navbar";
import Footer from "../components/Footer";
import TitlesS from "../components/TitlesSlash";


const contact = () => {
  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      {/* Main content wrapper */}
      <div className="relative z-0"></div>
      <Navbar />
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-25"></div>
      <div className="mycontainer pb-10">
        <TitlesS htitle="contact" />
        <div className="">
          <div className="">
            <ContactMini htitle="contact" />
          </div>
        </div>
        &nbsp;
        <hr />
        <div className="py-8"></div>
        <Footer />
      </div>
      <div className="pb-12"></div>
    </>
  );
};

export default contact;
