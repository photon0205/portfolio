import React from "react";
import "./ExperienceTimeline.css";

const ExperienceTimeline = ({ experiences }) => {
  return (
    <div className="experience-timeline">
      {experiences?.map((experience, index) => (
        <div key={index} className="timeline-item">
          <div className="circle" />
          <div className="content">
            <h3>{experience.title}</h3>
            <p className="company">{experience.company}</p>
            <p className="location">{experience.location}</p>
            <p className="date">{`${new Date(
              experience.start_date
            ).toLocaleString("default", { month: "short" })}, ${new Date(
              experience.start_date
            ).getFullYear()}`}</p>
            {experience.end_date && (
              <p className="date">{`${new Date(
                experience.end_date
              ).toLocaleString("default", { month: "short" })}, ${new Date(
                experience.end_date
              ).getFullYear()}`}</p>
            )}
            <ul>
              {experience.description.map((point) => (
                <li key={point.id}>{point.point}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceTimeline;
