import React from "react";
import "./ExperienceTimeline.css";

const ExperienceTimeline = ({ groupedExperiences }) => {
  // Helper function to get company initials for fallback logo
  const getCompanyInitials = (companyName) => {
    return companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return `${date.toLocaleString("default", { month: "long" })}, ${date.getFullYear()}`;
  };

  // Get overall date range for a company
  const getCompanyDateRange = (roles) => {
    const sortedRoles = [...roles].sort((a, b) => 
      new Date(a.start_date) - new Date(b.start_date)
    );
    const earliestStart = sortedRoles[0].start_date;
    const latestEnd = sortedRoles.find(r => r.end_date)?.end_date || 
                     sortedRoles.find(r => !r.end_date)?.end_date || null;
    
    const startFormatted = formatDate(earliestStart);
    const endFormatted = latestEnd ? formatDate(latestEnd) : "Present";
    
    return { start: startFormatted, end: endFormatted };
  };

  // Get company logo URL
  const getCompanyLogoUrl = (logo) => {
    if (!logo) return null;
    // If logo is already a full URL, return it
    if (logo.startsWith("http")) return logo;
    // If logo starts with /media, it's a Django media path
    if (logo.startsWith("/media")) {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      return `${baseUrl}${logo}`;
    }
    // Otherwise, assume it's a media path and prepend /media
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return `${baseUrl}/media/${logo}`;
  };

  return (
    <div className="experience-timeline-container">
      {groupedExperiences.map((companyGroup, companyIndex) => {
        const { company, roles, logo } = companyGroup;
        const companyDateRange = getCompanyDateRange(roles);
        // Sort roles by start date (newest first for display)
        const sortedRoles = [...roles].sort((a, b) => 
          new Date(b.start_date) - new Date(a.start_date)
        );
        const logoUrl = getCompanyLogoUrl(logo);

        // Get website from any role (prefer non-empty)
        const companyWebsite = sortedRoles.find(r => r.website)?.website || null;
        const isClickable = companyWebsite ? true : false;

        return (
          <div 
            key={companyIndex} 
            className={`timeline-company-entry ${isClickable ? "clickable" : ""}`}
            onClick={() => {
              if (companyWebsite) {
                window.open(companyWebsite, "_blank");
              }
            }}
          >
            <div className="timeline-dot">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${company} logo`}
                  className="company-logo"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div 
                className="company-logo-fallback"
                style={{ display: logoUrl ? "none" : "flex" }}
              >
                {getCompanyInitials(company)}
              </div>
            </div>
            
            <div className="timeline-content-wrapper">
              <div className="timeline-company-header">
                <h3 className="company-name">{company}</h3>
                <span className="company-date-range">
                  {companyDateRange.start} - {companyDateRange.end}
                </span>
              </div>

              <div className="timeline-roles">
                {sortedRoles.map((role, roleIndex) => (
                  <div 
                    key={role.id} 
                    className={`timeline-role ${roleIndex < sortedRoles.length - 1 ? "has-next-role" : ""}`}
                  >
                    {sortedRoles.length > 1 && (
                      <div className="role-progression-dot"></div>
                    )}
                    <div className="role-content">
                      <div className="role-header">
                        <h4 className="role-title">{role.title}</h4>
                        <span className="role-date-range">
                          {formatDate(role.start_date)} - {formatDate(role.end_date)}
                        </span>
                      </div>
                      {role.location && (
                        <p className="role-location">{role.location}</p>
                      )}
                      {role.description && role.description.length > 0 && (
                        <ul className="role-description">
                          {role.description.map((point) => (
                            <li key={point.id}>{point.point}</li>
                          ))}
                        </ul>
                      )}
                      {role.skills_used && role.skills_used.length > 0 && (
                        <ul className="role-skills">
                          {role.skills_used.map((skill) => (
                            <li key={skill.id} className="skill-tag">
                              {skill.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceTimeline;

