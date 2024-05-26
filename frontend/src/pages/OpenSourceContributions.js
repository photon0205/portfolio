import React, { useEffect, useState } from "react";
import { fetchOpenSourceContributions } from "../services/openSourceService";

const OpenSourceContributions = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    fetchOpenSourceContributions()
      .then((response) => {
        setContributions(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the open source contributions!",
          error
        );
      });
  }, []);

  return (
    <div>
      <h2>Open Source Contributions</h2>
      <ul>
        {contributions.map((contribution) => (
          <li key={contribution.id}>
            <h3>
              {contribution.contribution_type.name} in{" "}
              {contribution.open_source_project.name}
            </h3>
            <p>{contribution.description}</p>
            {contribution.pr_link && (
              <p>
                PR Link:{" "}
                <a href={contribution.pr_link}>{contribution.pr_link}</a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenSourceContributions;
