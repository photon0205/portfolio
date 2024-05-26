import api from './api';

export const fetchAboutMe = () => {
  return api.get('about/');
};

export const fetchContactInquiries = () => {
  return api.get('about/inquiries/');
};
