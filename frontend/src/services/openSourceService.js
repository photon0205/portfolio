import { fetchPortfolioData } from './portfolioService';
import api from './api';

/**
 * Fetch open source projects data from common portfolio JSON file.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchOpenSourceProjects = async () => {
  const portfolioData = await fetchPortfolioData();
  return { data: portfolioData.opensource || [] };
};

export const fetchOpenSourceContributions = () => {
  return api.get('opensource/contributions/');
};
