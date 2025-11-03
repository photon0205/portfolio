import React, { useEffect, useState } from 'react';
import AppRouter from "./routes/AppRouter";
import "./App.css";
import GradientMesh from './components/backgrounds/GradientMesh';

const backgroundComponents = {
  'solid': null,
  'gradient-mesh': GradientMesh,
};

function App() {
  const [currentBackground] = useState('gradient-mesh');

  const CustomCursor = () => {
    useEffect(() => {
      const cursor = document.querySelector(".custom-cursor");
      if (!cursor) return;
      
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;
      
      const moveCursor = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      
      // Smooth cursor movement with easing
      const animateCursor = () => {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
      };
      
      window.addEventListener("mousemove", moveCursor);
      animateCursor();
      
      // Add hover effects for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .clickable, .project-card, .timeline-company-entry');
      
      const handleMouseEnter = () => {
        cursor.style.width = '500px';
        cursor.style.height = '500px';
        cursor.style.filter = 'blur(30px)';
      };
      
      const handleMouseLeave = () => {
        cursor.style.width = '600px';
        cursor.style.height = '600px';
        cursor.style.filter = 'blur(40px)';
      };
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      
      return () => {
        window.removeEventListener("mousemove", moveCursor);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    }, []);
    
    // Apply cursor class based on current background
    const cursorClass = `custom-cursor cursor-${currentBackground}`;
    return <div className={cursorClass}></div>;
  };

  // Render the current background component
  const BackgroundComponent = backgroundComponents[currentBackground];

  return (
    <div className="App">
      {BackgroundComponent && <BackgroundComponent />}
      <CustomCursor />
      <AppRouter />
    </div>
  );
}

export default App;