import React from 'react';
import './ProjectCard.css';

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p><strong>Organization:</strong> {project.organization}</p>
      <p><strong>Duration:</strong> {project.duration}</p>
      <p><strong>Description:</strong> {project.description}</p>
    </div>
  );
}

export default ProjectCard;
