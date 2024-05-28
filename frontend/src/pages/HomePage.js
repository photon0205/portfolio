import React, { useEffect, useState, useRef } from "react";
import { fetchCategories, fetchProjects } from "../services/projectService";
import { fetchWorkExperiences } from "../services/experienceService";
import { fetchAboutMe } from "../services/aboutService";
import ExperienceCard from "../components/ExperienceCard";
import ProjectCard from "../components/ProjectCard";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";

const HomePage = ( {projectsSectionRef, experienceSectionRef} ) => {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [aboutMe, setAboutMe] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const filteredProjects = projects?.filter(
    (project) => project?.category.slug === selectedCategory
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const sortedExperiences = experiences?.sort((a, b) => {
    const startA = new Date(a.start_date);
    const startB = new Date(b.start_date);
    const endA = a.end_date ? new Date(a.end_date) : new Date();
    const endB = b.end_date ? new Date(b.end_date) : new Date();

    if (endA < endB) return 1;
    if (endA > endB) return -1;
    if (startA < startB) return 1;
    if (startA > startB) return -1;
    return 0;
  });

  useEffect(() => {
    fetchProjects().then((response) => setProjects(response.data));
    fetchWorkExperiences().then((response) => setExperiences(response.data));
    fetchAboutMe().then((response) => setAboutMe(response.data));
    fetchCategories().then((response) =>{
      setCategories(response.data);
      setSelectedCategory(response.data[0]?.slug);
    });
  }, []);

  if (!aboutMe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1 className="name">{aboutMe.name}</h1>
          {aboutMe.subtitle && <h2 className="subtitle">{aboutMe.subtitle}</h2>}
          <div className="avatar-container">
            <div className="profile-picture">
              <img
                src={`${API_URL}/${aboutMe.avatar}`}
                alt="Profile"
                className="profile-picture"
              />
            </div>
          </div>
          <div
            className="summary"
            dangerouslySetInnerHTML={{ __html: aboutMe.summary }}
          />
          <div className="social-links">
            {aboutMe.social_links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </header>
      <section className="projects-section" ref={projectsSectionRef}>
        <h2>Projects</h2>
        <div className="project-tabs">
          <ul className="category-tabs">
            {categories?.map((category) => (
              <li
                key={category.id}
                className={selectedCategory === category.slug ? "active" : ""}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </li>
            ))}
          </ul>
          <div className="projects-list">
            {filteredProjects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                handleProjectClick={handleProjectClick}
              />
            ))}
          </div>
          {selectedProject && (
            <Sidebar
              selectedProject={selectedProject}
              closeProjectDetails={closeProjectDetails}
            />
          )}
        </div>
      </section>
      <section className="experience-section" ref={experienceSectionRef}>
        <h2>Work Experience</h2>
        <div className="experience-timeline">
          {sortedExperiences?.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
