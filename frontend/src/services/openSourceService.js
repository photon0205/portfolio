import api from './api';

export const fetchOpenSourceProjects = () => {
  return api.get('opensource/projects/');
};

export const fetchOpenSourceContributions = () => {
  return api.get('opensource/contributions/');
};
