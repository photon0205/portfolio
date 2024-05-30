import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Footer.css";
import ContactForm from "./ContactForm";

const Footer = ({ aboutMe }) => {
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <FaGithub />;
      case "linkedin":
        return <FaLinkedin />;
      case "twitter":
        return <FaTwitter />;
      case "instagram":
        return <FaInstagram />;
      case "email":
        return <FaEnvelope />;
      default:
        return null;
    }
  };
  return (
    <footer className="footer">
      <div className="left-footer-section">
        <ContactForm />
      </div>
      <div className="right-footer-section">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p class="footer-caption">
          Living, learning, & leveling up one day at a time.
        </p>
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
