import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";

const AppRouter = () => {
  const aboutSectionRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const openSourceSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
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
        aboutSectionRef={aboutSectionRef}
        projectsSectionRef={projectsSectionRef}
        experienceSectionRef={experienceSectionRef}
        openSourceSectionRef={openSourceSectionRef}
        contactSectionRef={contactSectionRef}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              handleScroll={handleScroll}
              aboutSectionRef={aboutSectionRef}
              projectsSectionRef={projectsSectionRef}
              experienceSectionRef={experienceSectionRef}
              openSourceSectionRef={openSourceSectionRef}
              contactSectionRef={contactSectionRef}
            />
          }
        />
      </Routes>
    </>
  );
};

export default AppRouter;
