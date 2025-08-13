import vote from "../Images/projectPics/vote.png";
import port from "../Images/projectPics/port.png";
import ats from "../Images/projectPics/ats.png";
import soon from "../../assets/soon.webp";

const fullstack = [
  {
    id: "002",
    softUsed: ["react.js", "css", "tailwind css"],
    title: "Portfolio",
    description: "The portfolio you are viewing right now",
    image: port,
      link: "https://github.com/SuhasMartha/suhasmartha.github.io",
  },
  {
    id: "001",
    softUsed: [
      "express.js",
      "node.js",
      "mongodb",
      "html (ejs template)",
      "bootstrap",
      "react.js",
      "css",
    ],
    title: "OTT Streaming Platform",
    description: "Users can stream movies",
    image: ats,
    link: "https://github.com/SuhasMartha/AI-Resume-Screening-System",
  },
  {
    id: "003",
    softUsed: ["bootstrap", "react.js", "css"],
    title: "Warehouse Stocking",
    description: "A website to save and display Stock",
    image: vote,
    link: "https://github.com/SuhasMartha/Online-Voting-System",
  },
  {
    id: "004",
    softUsed: [" techn is loading", " please be patient "],
    title: "Coming soon",
    description: "Yes, I am working on it",
    image: soon,
    link: "#",
  },
];

const frontend = [
  {
    id: "001",
    softUsed: [" techn is loading", " please be patient "],
    title: "Coming soon",
    description: "Yes, I am working on it",
    image: soon,
    link: "#",
  },
];

export { fullstack, frontend };
