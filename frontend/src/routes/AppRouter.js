import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import Projects from '../pages/Projects';
import Experiences from '../pages/Experiences';
import OpenSourceProjects from '../pages/OpenSourceProjects';
import OpenSourceContributions from '../pages/OpenSourceContributions';
import Testimonials from '../pages/Testimonials';
import AboutMe from '../pages/AboutMe';
import ContactInquiries from '../pages/ContactInquiries';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/open-source-projects" element={<OpenSourceProjects />} />
        <Route path="/open-source-contributions" element={<OpenSourceContributions />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/contact-inquiries" element={<ContactInquiries />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
