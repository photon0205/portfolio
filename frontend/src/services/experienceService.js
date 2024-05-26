import api from './api';

export const fetchWorkExperiences = () => {
  return api.get('experiences/');
};
