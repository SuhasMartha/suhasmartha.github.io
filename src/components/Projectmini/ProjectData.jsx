import vote from "../Images/projectPics/vote.png";
import port from "../Images/projectPics/port.png";
import ats from "../Images/projectPics/ats.png";
import soon from "../../assets/soon.webp";

const webDev = [
  {
    id: "002",
    softUsed: ["react.js", "css", "tailwind css"],
    title: "Portfolio",
    description: "The portfolio you are viewing right now",
    image: port,
    link: "https://github.com/SuhasMartha/suhasmartha.github.io",
  },
  {
    id: "wd-002",
    softUsed: ["react.js", "api integration", "css", "openweather"],
    title: "Weather App",
    description: "Real-time weather updates & forecasts",
    image: soon,
    link: "#",
  },
  {
    id: "001",
    softUsed: [
      "express.js",
      "node.js",
      "mongodb",
      "html",
      "bootstrap",
      "react.js"
    ],
    title: "OTT Streaming Platform",
    description: "Users can stream movies",
    image: ats,
    link: "https://github.com/SuhasMartha/AI-Resume-Screening-System",
  },
];

const aiMl = [
  {
    id: "aiml-001",
    softUsed: ["python", "deep learning", "CNN", "tensorflow"],
    title: "Parkinson Disease Detection",
    description: "Detecting stages of Parkinson's using spiral drawings",
    image: soon,
    link: "https://github.com/SuhasMartha/Parkinson-Disease-Classification-Deep-Learning-Project",
  },
  {
    id: "aiml-002",
    softUsed: ["python", "yolo", "computer vision", "opencv"],
    title: "Underwater Fish Detection",
    description: "Identifying and classifying underwater marine life",
    image: soon,
    link: "https://github.com/SuhasMartha/Underwater-Fish-Detection",
  },
];

const dataAnalytics = [
  {
    id: "da-001",
    softUsed: ["python", "powerbi", "pandas", "visualization"],
    title: "Indian Election Visualization",
    description: "Interactive dashboard of election data & trends",
    image: soon,
    link: "#",
  },
];

export { aiMl, dataAnalytics, webDev };
