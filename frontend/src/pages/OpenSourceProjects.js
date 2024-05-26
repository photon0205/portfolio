import React, { useEffect, useState } from "react";
import { fetchOpenSourceProjects } from "../services/openSourceService";

const OpenSourceProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchOpenSourceProjects()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the open source projects!",
          error
        );
      });
  }, []);

  return (
    <div>
      <h2>Open Source Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>
              Repository: <a href={project.repo_link}>{project.repo_link}</a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenSourceProjects;
