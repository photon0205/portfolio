import React from "react";
import "./Skeleton.css";

/**
 * Reusable Skeleton component for loading states
 */
export const Skeleton = ({ width, height, borderRadius = "4px", className = "" }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height: height || "20px",
        borderRadius: borderRadius,
      }}
    />
  );
};

/**
 * Skeleton for category tabs
 */
export const CategoryTabsSkeleton = () => {
  return (
    <ul className="category-tabs">
      {[1, 2, 3, 4].map((i) => (
        <li key={i} className="category-tab-skeleton">
          <Skeleton width="100px" height="40px" borderRadius="20px" />
        </li>
      ))}
    </ul>
  );
};

/**
 * Skeleton for project cards
 */
export const ProjectCardSkeleton = () => {
  return (
    <div className="project-card-skeleton">
      <Skeleton width="100%" height="250px" borderRadius="8px" className="project-image-skeleton" />
      <div style={{ marginTop: "12px" }}>
        <Skeleton width="80%" height="24px" borderRadius="4px" />
        <Skeleton width="60%" height="20px" borderRadius="4px" style={{ marginTop: "8px" }} />
      </div>
    </div>
  );
};

/**
 * Skeleton for experience card
 */
export const ExperienceCardSkeleton = () => {
  return (
    <div className="timeline-item-skeleton">
      <Skeleton width="150px" height="18px" borderRadius="4px" className="timeline-dates-skeleton" />
      <div style={{ marginTop: "16px" }}>
        <Skeleton width="70%" height="28px" borderRadius="4px" />
        <Skeleton width="90%" height="20px" borderRadius="4px" style={{ marginTop: "12px" }} />
        <Skeleton width="85%" height="20px" borderRadius="4px" style={{ marginTop: "8px" }} />
        <Skeleton width="60%" height="16px" borderRadius="4px" style={{ marginTop: "16px" }} />
      </div>
    </div>
  );
};

/**
 * Skeleton for social links
 */
export const SocialLinksSkeleton = () => {
  return (
    <div className="social-links-skeleton">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} width="40px" height="40px" borderRadius="50%" />
      ))}
    </div>
  );
};

