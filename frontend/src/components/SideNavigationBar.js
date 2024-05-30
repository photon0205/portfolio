import React, { useState, useEffect, useRef } from "react";
import {
  FiLayers,
  FiBriefcase,
  FiGithub,
  FiMail,
  FiUser,
} from "react-icons/fi";
import "./SideNavigationBar.css";

const SideNavigationBar = ({
  handleScroll,
  aboutSectionRef,
  projectsSectionRef,
  experienceSectionRef,
  openSourceSectionRef,
  contactSectionRef,
}) => {
  const [activeSection, setActiveSection] = useState("projects");
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const { offsetTop: projectsOffset } = projectsSectionRef.current;
      const { offsetTop: experienceOffset } = experienceSectionRef.current;
      const { offsetTop: openSourceOffset } = openSourceSectionRef.current;
      const { offsetTop: contactOffset } = contactSectionRef.current;
      const scrollPosition = window.scrollY + 500;

      scrollPositionRef.current = scrollPosition;

      if (scrollPosition < projectsOffset) {
        setActiveSection("about");
      } else if (scrollPosition < experienceOffset) {
        setActiveSection("projects");
      } else if (scrollPosition < openSourceOffset) {
        setActiveSection("experience");
      } else if (scrollPosition < contactOffset) {
        setActiveSection("open-source");
      } else {
        setActiveSection("contact");
      }
    };

    const debounce = (fn, delay) => {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    };

    const handleScrollThrottled = debounce(handleScroll, 100);

    window.addEventListener("scroll", handleScrollThrottled);
    return () => window.removeEventListener("scroll", handleScrollThrottled);
  }, [
    aboutSectionRef,
    projectsSectionRef,
    experienceSectionRef,
    openSourceSectionRef,
    contactSectionRef,
  ]);

  const scrollToSection = (ref) => {
    setActiveSection(ref.current.dataset.section);
    handleScroll(ref.current);
  };

  return (
    <div className="side-navigation-bar">
      <ul>
        <li
          className={`nav-item ${activeSection === "about" ? "active" : ""}`}
          onClick={() => scrollToSection(aboutSectionRef)}
          data-section="about"
        >
          <FiUser className="nav-icon" />
          <span className="nav-text">About Me</span>
        </li>
        <li
          className={`nav-item ${activeSection === "projects" ? "active" : ""}`}
          onClick={() => scrollToSection(projectsSectionRef)}
          data-section="projects"
        >
          <FiLayers className="nav-icon" />
          <span className="nav-text">Projects</span>
        </li>
        <li
          className={`nav-item ${
            activeSection === "experience" ? "active" : ""
          }`}
          onClick={() => scrollToSection(experienceSectionRef)}
          data-section="experience"
        >
          <FiBriefcase className="nav-icon" />
          <span className="nav-text">Work Experience</span>
        </li>
        <li
          className={`nav-item ${
            activeSection === "open-source" ? "active" : ""
          }`}
          onClick={() => scrollToSection(openSourceSectionRef)}
          data-section="open-source"
        >
          <FiGithub className="nav-icon" />
          <span className="nav-text">Open Source</span>
        </li>
        <li
          className={`nav-item ${activeSection === "contact" ? "active" : ""}`}
          onClick={() => scrollToSection(contactSectionRef)}
          data-section="contact"
        >
          <FiMail className="nav-icon" />
          <span className="nav-text">Contact Me</span>
        </li>
      </ul>
    </div>
  );
};

export default SideNavigationBar;
