import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchProjects } from '../services/projectService';
import { fetchWorkExperiences } from '../services/experienceService';
import { fetchAboutMe } from '../services/aboutService';
import './HomePage.css';
import ProjectTabs from '../components/ProjectTabs';
import ExperienceTimeline from '../components/ExperienceTimeline';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [aboutMe, setAboutMe] = useState(null);
  const [categories, setCategories] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchProjects().then(response => setProjects(response.data));
    fetchWorkExperiences().then(response => setExperiences(response.data));
    fetchAboutMe().then(response => setAboutMe(response.data));
    fetchCategories().then(response => setCategories(response.data));
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
              <img src={`${API_URL}/${aboutMe.avatar}`} alt="Profile" className="profile-picture" />
            </div>
          </div>
          <div className="summary" dangerouslySetInnerHTML={{ __html: aboutMe.summary }} />
          <div className="social-links">
            {aboutMe.social_links.map(link => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </header>
      <section className="projects-section">
        <h2>Projects</h2>
        <ProjectTabs categories={categories} projects={projects} />
      </section>
      <section className="experience-section">
        <h2>Work Experience</h2>
        <ExperienceTimeline experiences={experiences} />
      </section>
    </div>
  );
};

export default HomePage;
