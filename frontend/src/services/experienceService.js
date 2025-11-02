import { fetchPortfolioData } from './portfolioService';

/**
 * Fetch work experiences data from common portfolio JSON file.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchWorkExperiences = async () => {
  const portfolioData = await fetchPortfolioData();
  return { data: portfolioData.experiences || [] };
};
