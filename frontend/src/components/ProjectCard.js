import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project, handleProjectClick }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  return (
    <div className="project-card" onClick={() => handleProjectClick(project)}>
      <div className="project-image">
        <img
          src={`${API_URL}/${project.images[0].image}`}
          alt={project.title}
        />
        <div className="project-overlay">
          <h3>{project.title}</h3>
          <p>{project.caption}</p>
          <div className="skills-used">
            {project.skills_used.map((skill) => (
              <span key={skill.id} className="skill-tag">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
