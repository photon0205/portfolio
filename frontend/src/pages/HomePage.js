import React, { useEffect, useState } from "react";
import { fetchOpenSourceProjects } from "../services/openSourceService";
import { fetchProjects } from "../services/projectService";
import { fetchWorkExperiences } from "../services/experienceService";
import ExperienceCard from "../components/ExperienceCard";
import { fetchAboutMe } from "../services/aboutService";
import ProjectCard from "../components/ProjectCard";
import Sidebar from "../components/Sidebar";
import AboutMe from "../components/AboutMe";
import Footer from "../components/Footer";
import { ProjectCardSkeleton, ExperienceCardSkeleton } from "../components/Skeleton";
import "./HomePage.css";
import SideNavigationBar from "../components/SideNavigationBar";
import { FaArrowUp } from "react-icons/fa";

const HomePage = ({
  handleScroll,
  aboutSectionRef,
  projectsSectionRef,
  experienceSectionRef,
  openSourceSectionRef,
  contactSectionRef,
}) => {
  const [projects, setProjects] = useState([]);
  const [openSourceProjects, setOpenSourceProjects] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [aboutMe, setAboutMe] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOpenSourceProject, setSelectedOpenSourceProject] =
    useState(null);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const handleOpenSourceProjectClick = (project) => {
    setSelectedOpenSourceProject(project);
  };
  const closeOpenSourceProjectDetails = () => {
    setSelectedOpenSourceProject(null);
    handleScroll(openSourceSectionRef.current);
  };
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };
  const closeProjectDetails = () => {
    setSelectedProject(null);
    handleScroll(projectsSectionRef.current);
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
    // Progressive loading: Load critical data first, then rest
    // Load AboutMe first (most important for initial render)
    fetchAboutMe().then((response) => setAboutMe(response.data));
    
    // Load rest in parallel (non-blocking)
    Promise.all([
      fetchProjects().then((response) => setProjects(response.data)),
      fetchWorkExperiences().then((response) => setExperiences(response.data)),
      fetchOpenSourceProjects().then((response) =>
        setOpenSourceProjects(response.data)
      ),
    ]).catch((error) => {
      console.error("Error loading portfolio data:", error);
    });

    const handleScrollEvent = () => {
      if (window.pageYOffset > 200) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show skeleton/progressive UI instead of blocking loader
  // AboutMe is critical, rest can load progressively

  return (
    <div className="home-page">
      <SideNavigationBar
        handleScroll={handleScroll}
        aboutSectionRef={aboutSectionRef}
        projectsSectionRef={projectsSectionRef}
        experienceSectionRef={experienceSectionRef}
        openSourceSectionRef={openSourceSectionRef}
        contactSectionRef={contactSectionRef}
      />
      <section className="home-header" ref={aboutSectionRef}>
        <AboutMe aboutMe={aboutMe} contactSectionRef={contactSectionRef} />
      </section>
      <section className="projects-section" ref={projectsSectionRef}>
        <h2>Projects</h2>
        <div className="project-tabs">
          <div className="projects-list">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  type="project"
                  project={project}
                  handleProjectClick={handleProjectClick}
                />
              ))
            ) : projects.length === 0 ? (
              // Show skeleton while loading
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                {[1, 2, 3].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : null}
          </div>
          {selectedProject && (
            <Sidebar
              type="project"
              selectedProject={selectedProject}
              closeSidebar={closeProjectDetails}
              direction="right"
            />
          )}
        </div>
      </section>
      <section className="experience-section" ref={experienceSectionRef}>
        <h2>Work Experience</h2>
        <div className="experience-timeline">
          {sortedExperiences && sortedExperiences.length > 0 ? (
            sortedExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))
          ) : experiences.length === 0 ? (
            // Show skeleton while loading
            <>
              {[1, 2, 3].map((i) => (
                <ExperienceCardSkeleton key={i} />
              ))}
            </>
          ) : null}
        </div>
      </section>
      <section className="projects-section" ref={openSourceSectionRef}>
        <h2>Open Source Contributions</h2>
        <div className="projects-tabs">
          <div className="projects-list">
            {openSourceProjects && openSourceProjects.length > 0 ? (
              openSourceProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  type="open-source"
                  project={project}
                  handleProjectClick={handleOpenSourceProjectClick}
                />
              ))
            ) : openSourceProjects === null ? (
              // Show skeleton while loading (null means still loading, [] means loaded but empty)
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                {[1, 2, 3].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : null}
          </div>
          {selectedOpenSourceProject && (
            <Sidebar
              type="contribution"
              selectedProject={selectedOpenSourceProject}
              closeSidebar={closeOpenSourceProjectDetails}
              direction="left"
            />
          )}
        </div>
      </section>
      <section ref={contactSectionRef}>
        <h2>Contact Me</h2>
        <Footer aboutMe={aboutMe} />
      </section>
      {showScrollTopButton && (
        <div className="scroll-top-button" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </div>
  );
};

export default HomePage;
