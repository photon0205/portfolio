import React, { useEffect, useState } from "react";
import { fetchWorkExperiences } from "../services/experienceService";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchWorkExperiences()
      .then((response) => {
        setExperiences(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the experiences!", error);
      });
  }, []);

  return (
    <div>
      <h2>Work Experiences</h2>
      <ul>
        {experiences.map((experience) => (
          <li key={experience.id}>
            <h3>
              {experience.title} at {experience.company}
            </h3>
            <p>
              {experience.description.map((point) => (
                <li key={point.id}>{point.point}</li>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experiences;
