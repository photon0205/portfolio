import api from './api';

// Cache for portfolio data to avoid multiple fetches
let portfolioDataCache = null;
let portfolioDataPromise = null;

/**
 * Fetch all portfolio data from a single JSON file.
 * Uses caching to ensure only one fetch happens even if called multiple times.
 * Falls back to API if JSON file doesn't exist (for development).
 */
export const fetchPortfolioData = async () => {
  // Return cached data if available
  if (portfolioDataCache) {
    return portfolioDataCache;
  }

  // Return existing promise if a fetch is already in progress
  if (portfolioDataPromise) {
    return portfolioDataPromise;
  }

  // Start fetching
  portfolioDataPromise = (async () => {
    try {
      const response = await fetch('/data/portfolio.json');
      if (response.ok) {
        const data = await response.json();
        portfolioDataCache = data;
        return data;
      }
      throw new Error('JSON file not found');
    } catch (error) {
      // Fallback to API for development or if JSON doesn't exist
      console.warn('Loading from API (fallback):', error.message);
      
      // Fetch from API endpoints
      const [aboutRes, projectsRes, categoriesRes, experiencesRes, opensourceRes] = await Promise.all([
        api.get('about/').catch(() => ({ data: null })),
        api.get('projects/').catch(() => ({ data: [] })),
        api.get('projects/categories/').catch(() => ({ data: [] })),
        api.get('experiences/').catch(() => ({ data: [] })),
        api.get('opensource/projects/').catch(() => ({ data: [] })),
      ]);

      const apiData = {
        about: aboutRes.data,
        projects: projectsRes.data || [],
        categories: categoriesRes.data || [],
        experiences: experiencesRes.data || [],
        opensource: opensourceRes.data || [],
      };

      portfolioDataCache = apiData;
      return apiData;
    } finally {
      // Clear the promise so we can retry if needed
      portfolioDataPromise = null;
    }
  })();

  return portfolioDataPromise;
};

/**
 * Clear the portfolio data cache (useful for testing or force refresh)
 */
export const clearPortfolioCache = () => {
  portfolioDataCache = null;
  portfolioDataPromise = null;
};

