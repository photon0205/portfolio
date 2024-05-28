import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ( {handleScroll, projectsSectionRef, experienceSectionRef} ) => {
  const handleNavLinkClick = (hash) => {
    const section = document.querySelector(hash);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/#projects" onClick={() => {handleScroll(projectsSectionRef.current);}}>Projects</Link>
        <Link to="/#experience" onClick={() => {handleScroll(experienceSectionRef.current);}}>Experiences</Link>
        <Link to="/contact-inquiries">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
