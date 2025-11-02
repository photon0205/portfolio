import { fetchPortfolioData } from './portfolioService';
import api from './api';

/**
 * Fetch projects data from common portfolio JSON file.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchProjects = async () => {
  const portfolioData = await fetchPortfolioData();
  return { data: portfolioData.projects || [] };
};

/**
 * Fetch categories data from common portfolio JSON file.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchCategories = async () => {
  const portfolioData = await fetchPortfolioData();
  return { data: portfolioData.categories || [] };
};

export const fetchSkills = () => {
  return api.get('projects/skills/');
};
