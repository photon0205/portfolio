import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project, handleProjectClick, type }) => {
  const API_URL = process.env.REACT_APP_API_URL.replace(/\/+$/, '').replace('/api', '');
  return (
    <div className="project-card" onClick={() => handleProjectClick(project)}>
      <div className="project-image">
        <img
          src={`${API_URL}${
            type === "project" ? project.images[0].image : project.image
          }`}
          alt={type === "project" ? project.title : project.name}
        />
        <div className="project-overlay">
          <h3>{type === "project" ? project.title : project.name}</h3>
          <p>{project.caption}</p>
          {type === "project" && (
            <div className="skills-used">
              {project.skills_used.map((skill) => (
                <span key={skill.id} className="skill-tag">
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
