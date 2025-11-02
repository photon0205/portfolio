import { fetchPortfolioData } from './portfolioService';
import api from './api';

/**
 * Fetch about me data from common portfolio JSON file.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchAboutMe = async () => {
  const portfolioData = await fetchPortfolioData();
  return { data: portfolioData.about };
};

export const fetchContactInquiries = () => {
  return api.get('about/inquiries/');
};
