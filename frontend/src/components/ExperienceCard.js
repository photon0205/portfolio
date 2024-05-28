import React from "react";
import "./ExperienceCard.css";

const ProjectCard = ({ experience }) => {
  return (
    <div
      key={experience.id}
      className="timeline-item group"
      onClick={() => window.open(experience.website, "_blank")}
    >
      <div className="timeline-content">
        <div className="timeline-dates">
          <span>
            {`${new Date(experience.start_date).toLocaleString("default", {
              month: "long",
            })}, ${new Date(experience.start_date).getFullYear()} - `}
            {experience.end_date
              ? `${new Date(experience.end_date).toLocaleString("default", {
                  month: "long",
                })}, ${new Date(experience.end_date).getFullYear()}`
              : "Present"}
          </span>
        </div>
        <div className="timeline-details">
          <h3>
            {experience.title} · {experience.company}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="inline-block h-4 w-4 shrink-0 transition-transform group-hover:translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                clipRule="evenodd"
              ></path>
            </svg>
          </h3>
          <ul className="description">
            {experience.description.map((point) => (
              <li key={point.id}>{point.point}</li>
            ))}
          </ul>
          <ul className="skills">
            {experience.skills_used.map((skill) => (
              <li key={skill.id} className="skill">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
