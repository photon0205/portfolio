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
          <Skeleton width="100px" height="40px" borderRadius="8px" />
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
      <div className="project-skeleton-image">
        <Skeleton width="100%" height="100%" borderRadius="10px" />
      </div>
      <div className="project-skeleton-overlay">
        <Skeleton width="70%" height="24px" borderRadius="6px" />
        <Skeleton width="85%" height="16px" borderRadius="6px" style={{ marginTop: "10px" }} />
        <Skeleton width="80%" height="16px" borderRadius="6px" style={{ marginTop: "6px" }} />
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Skeleton width="70px" height="26px" borderRadius="6px" />
          <Skeleton width="80px" height="26px" borderRadius="6px" />
          <Skeleton width="65px" height="26px" borderRadius="6px" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for experience timeline card (LinkedIn-style)
 */
export const ExperienceCardSkeleton = () => {
  return (
    <div className="timeline-item-skeleton">
      <div className="timeline-skeleton-logo">
        <Skeleton width="100%" height="100%" borderRadius="12px" />
      </div>
      <div className="timeline-skeleton-content">
        <div className="timeline-skeleton-header">
          <Skeleton width="45%" height="20px" borderRadius="6px" />
          <Skeleton width="30%" height="13px" borderRadius="6px" style={{ marginTop: "8px" }} />
        </div>
        <div className="timeline-skeleton-roles">
          <div>
            <Skeleton width="55%" height="17px" borderRadius="6px" />
            <Skeleton width="35%" height="13px" borderRadius="6px" style={{ marginTop: "8px" }} />
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="90%" height="14px" borderRadius="6px" />
              <Skeleton width="85%" height="14px" borderRadius="6px" style={{ marginTop: "8px" }} />
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Skeleton width="80px" height="28px" borderRadius="6px" />
              <Skeleton width="90px" height="28px" borderRadius="6px" />
              <Skeleton width="75px" height="28px" borderRadius="6px" />
            </div>
          </div>
        </div>
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

