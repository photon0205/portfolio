import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";
import ContactInquiries from "../pages/ContactInquiries";

const AppRouter = () => {
  const projectsSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const handleScroll = (ref) => {
    window.scrollTo({
      top: ref.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar
        handleScroll={handleScroll}
        projectsSectionRef={projectsSectionRef}
        experienceSectionRef={experienceSectionRef}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              projectsSectionRef={projectsSectionRef}
              experienceSectionRef={experienceSectionRef}
            />
          }
        />
        <Route path="/contact-inquiries" element={<ContactInquiries />} />
      </Routes>
    </>
  );
};

export default AppRouter;
