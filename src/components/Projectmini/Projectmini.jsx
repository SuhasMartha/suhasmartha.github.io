import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import "../css/ProjectCard.css";

const Projectmini = ({ title, projects }) => {
  const PROJECTS = [
    {
      id: "002",
      softUsed: ["react.js", "css", "tailwind css"],
      title: "Portfolio",
      description: "The portfolio you are viewing right now",
      link: "https://github.com/SuhasMartha/suhasmartha.github.io",
    },
    {
      id: "001",
      title: "Online Voting System",
      softUsed: ["C"],
      description: "Encrypted voting system",
      link: "https://github.com/SuhasMartha/Online-Voting-System",
    },
    {
      id: "003",
      softUsed: ["python", "NLP", "skilit"],
      title: "AI Resume Screening",
      description: "ATS using AI",
      link: "https://github.com/SuhasMartha/AI-Resume-Screening-System",
    },
  ];

  const [hoveredProject, setHoveredProject] = useState(null);
  const projectsToDisplay = projects || PROJECTS;

  return (
    <div className="relative">
      <div id="projecttable" className="gap-6 md:grid md:grid-cols-3">
        {projectsToDisplay.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            hasHoverCapability={true}
            hoveredProject={hoveredProject}
            setHoveredProject={setHoveredProject}
            title={title}
          />
        ))}
      </div>
    </div>
  );
};

export default Projectmini;
