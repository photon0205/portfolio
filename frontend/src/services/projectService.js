import api from './api';

export const fetchProjects = () => {
  return api.get('projects/');
};

export const fetchCategories = () => {
  return api.get('projects/categories/');
};

export const fetchSkills = () => {
  return api.get('projects/skills/');
};
