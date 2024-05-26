import api from './api';

export const fetchTestimonials = () => {
  return api.get('testimonials/');
};
