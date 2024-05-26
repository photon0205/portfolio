import React, { useState } from 'react';
import './ProjectTabs.css';

const ProjectTabs = ({ categories, projects }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.slug);
  const filteredProjects = projects?.filter(project => project?.category.slug === selectedCategory);

  return (
    <div className="project-tabs">
      <ul className="category-tabs">
        {categories?.map(category => (
          <li
            key={category.id}
            className={selectedCategory === category.slug ? 'active' : ''}
            onClick={() => setSelectedCategory(category.slug)}
          >
            {category.name}
          </li>
        ))}
      </ul>
      <div className="projects-list">
        {filteredProjects?.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.github_link} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer">Live Demo</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTabs;
