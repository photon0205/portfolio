import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Footer.css";

const Footer = ({ aboutMe }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <FaGithub />;
      case "linkedin":
        return <FaLinkedin />;
      case "twitter":
        return <FaTwitter />;
      case "email":
        return <FaEnvelope />;
      default:
        return null;
    }
  };
  return (
    <footer className="footer">
      <div className="left-footer-section">
        <p class="footer-caption">
          Living, learning, & leveling up one day at a time.
        </p>
      </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      <div className="right-footer-section">
        <div className="footer-icons">
          {aboutMe.social_links.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getIcon(link.platform)}
            </a>
          ))}
          <a
            href={`mailto:${aboutMe.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getIcon("email")}
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Sahajpreet Singh. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
