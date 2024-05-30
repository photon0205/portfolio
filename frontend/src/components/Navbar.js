import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({
  handleScroll,
  projectsSectionRef,
  experienceSectionRef,
  openSourceSectionRef,
  contactSectionRef,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (sectionRef) => {
    handleScroll(sectionRef.current);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className={`navbar-overlay ${isMobileMenuOpen ? "active" : ""}`} onClick={toggleMobileMenu}></div>
      <div className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
        <Link
          to="/#projects"
          onClick={() => handleLinkClick(projectsSectionRef)}
        >
          Projects
        </Link>
        <Link
          to="/#experience"
          onClick={() => handleLinkClick(experienceSectionRef)}
        >
          Experiences
        </Link>
        <Link
          to="/#open-source"
          onClick={() => handleLinkClick(openSourceSectionRef)}
        >
          OpenSource
        </Link>
        <Link
          to="/#contact"
          onClick={() => handleLinkClick(contactSectionRef)}
        >
          Contact
        </Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
