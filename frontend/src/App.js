import React, { useEffect } from 'react';
import AppRouter from "./routes/AppRouter";
import "./App.css";

function App() {
  const CustomCursor = () => {
    useEffect(() => {
      const cursor = document.querySelector(".custom-cursor");
      const moveCursor = (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      };
      window.addEventListener("mousemove", moveCursor);
      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    }, []);
    return <div className="custom-cursor"></div>;
  };

  return (
    <div className="App">
      <CustomCursor />
      <AppRouter />
    </div>
  );
}

export default App;