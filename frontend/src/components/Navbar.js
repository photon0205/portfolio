import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/projects">Projects</Link>
        <Link to="/experiences">Experiences</Link>
        <Link to="/open-source-projects">Open Source</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/about-me">About Me</Link>
        <Link to="/contact-inquiries">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
