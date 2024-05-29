import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import "./AboutMe.css";

const AboutMe = ({ aboutMe }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  if (!aboutMe) {
    return <div>Loading...</div>;
  }

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
    <header className="about-me">
      <div className="left-section">
        <div className="avatar-container">
          <div className="profile-picture">
            <img
              src={`${API_URL}/${aboutMe.avatar}`}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        </div>
        <h1 className="name">{aboutMe.name}</h1>
        <p className="title">Software Engineer</p>
        {aboutMe.subtitle && <p className="subtitle">{aboutMe.subtitle}</p>}
        <div className="social-links">
          <>
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
          </>
        </div>
      </div>
      <div className="right-section">
        <div
          className="summary"
          dangerouslySetInnerHTML={{ __html: aboutMe.summary }}
        />
      </div>
    </header>
  );
};

export default AboutMe;
