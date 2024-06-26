import React, { useEffect, useState } from "react";
import { fetchOpenSourceProjects } from "../services/openSourceService";
import { fetchCategories, fetchProjects } from "../services/projectService";
import { fetchWorkExperiences } from "../services/experienceService";
import ExperienceCard from "../components/ExperienceCard";
import { fetchAboutMe } from "../services/aboutService";
import ProjectCard from "../components/ProjectCard";
import Sidebar from "../components/Sidebar";
import AboutMe from "../components/AboutMe";
import Footer from "../components/Footer";
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
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOpenSourceProject, setSelectedOpenSourceProject] =
    useState(null);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const filteredProjects = projects?.filter(
    (project) => project?.category.slug === selectedCategory
  );

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
    fetchProjects().then((response) => setProjects(response.data));
    fetchWorkExperiences().then((response) => setExperiences(response.data));
    fetchAboutMe().then((response) => setAboutMe(response.data));
    fetchOpenSourceProjects().then((response) =>
      setOpenSourceProjects(response.data)
    );
    fetchCategories().then((response) => {
      setCategories(response.data);
      setSelectedCategory(response.data[0]?.slug);
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

  if (!aboutMe) {
    return <div>Loading...</div>;
  }

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
        <AboutMe aboutMe={aboutMe} />
      </section>
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
                type="project"
                project={project}
                handleProjectClick={handleProjectClick}
              />
            ))}
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
          {sortedExperiences?.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </section>
      <section className="projects-section" ref={openSourceSectionRef}>
        <h2>Open Source Contributions</h2>
        <div className="projects-tabs">
          <div className="projects-list">
            {openSourceProjects?.map((project) => (
              <ProjectCard
                key={project.id}
                type="open-source"
                project={project}
                handleProjectClick={handleOpenSourceProjectClick}
              />
            ))}
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
