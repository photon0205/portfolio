import React, { useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Skeleton, SocialLinksSkeleton } from "./Skeleton";
import "./AboutMe.css";

const AboutMe = ({ aboutMe, contactSectionRef }) => {
  const API_URL = process.env.REACT_APP_API_URL?.replace(/\/+$/, '')?.replace('/api', '') || '';

  // Progressive loading: show skeleton or placeholder if data not ready
  if (!aboutMe) {
    return (
      <header className="about-me">
        <div className="left-section">
          <div className="avatar-container">
            <Skeleton width="200px" height="200px" borderRadius="50%" className="profile-picture" />
          </div>
          <Skeleton width="200px" height="40px" borderRadius="4px" style={{ margin: '20px 0 10px' }} />
          <Skeleton width="150px" height="24px" borderRadius="4px" style={{ margin: '10px 0' }} />
          <Skeleton width="120px" height="20px" borderRadius="4px" style={{ margin: '10px 0' }} />
          <SocialLinksSkeleton />
        </div>
        <div className="right-section">
          <Skeleton width="100%" height="60px" borderRadius="8px" style={{ marginBottom: '16px' }} />
          <Skeleton width="100%" height="60px" borderRadius="8px" style={{ marginBottom: '16px' }} />
          <Skeleton width="80%" height="60px" borderRadius="8px" style={{ marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <Skeleton width="140px" height="44px" borderRadius="6px" />
            <Skeleton width="140px" height="44px" borderRadius="6px" />
          </div>
        </div>
      </header>
    );
  }

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

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const openResume = () => {
    const resumeUrl = `${API_URL}${aboutMe.resume}`;
    window.open(resumeUrl, "_blank", "noopener noreferrer");
  };

  return (
    <header className="about-me">
      <div className="left-section">
        <div className="avatar-container">
          <div className="profile-picture">
            <img
              src={`${API_URL}${aboutMe.avatar}`}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        </div>
        <h1 className="name">{aboutMe.name}</h1>
        <p className="title">{aboutMe.current_role}</p>
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
        <div className="buttons-container">
          <button className="resume-button" onClick={openResume}>
            View Resume <FaExternalLinkAlt className="share-icon" />
          </button>
          <button
            className="connect-button"
            onClick={() => scrollToSection(contactSectionRef)}
          >
            Connect with me
          </button>
        </div>
      </div>
    </header>
  );
};

export default AboutMe;
