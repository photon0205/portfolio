import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({
  handleScroll,
  projectsSectionRef,
  experienceSectionRef,
  openSourceSectionRef,
  contactSectionRef,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/#projects"
          onClick={() => {
            handleScroll(projectsSectionRef.current);
          }}
        >
          Projects
        </Link>
        <Link
          to="/#experience"
          onClick={() => {
            handleScroll(experienceSectionRef.current);
          }}
        >
          Experiences
        </Link>
        <Link
          to="/#open-source"
          onClick={() => {
            handleScroll(openSourceSectionRef.current);
          }}
        >
          OpenSource
        </Link>
        <Link
          to="/#contact"
          onClick={() => {
            handleScroll(contactSectionRef.current);
          }}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
