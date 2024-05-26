import React, { useEffect, useState } from "react";
import { fetchAboutMe } from "../services/aboutService";

const AboutMe = () => {
  const [aboutMe, setAboutMe] = useState(null);

  useEffect(() => {
    fetchAboutMe()
      .then((response) => {
        setAboutMe(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the about me data!", error);
      });
  }, []);

  if (!aboutMe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>About Me</h2>
      <p>{aboutMe.summary}</p>
      {aboutMe.profile_picture && (
        <img
          src={`${process.env.REACT_APP_API_URL || "http://localhost:8000/"}/${
            aboutMe.profile_picture
          }`}
          alt="Profile"
        />
      )}
      {aboutMe.resume && (
        <a
          href={`${process.env.REACT_APP_API_URL || "http://localhost:8000/"}/${
            aboutMe.resume
          }`}
          target="_blank"
        >
          Download Resume
        </a>
      )}
    </div>
  );
};

export default AboutMe;
