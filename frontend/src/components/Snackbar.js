import React, { useEffect } from "react";
import "./Snackbar.css";

const Snackbar = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <div className="snackbar">
      {message}
    </div>
  );
};

export default Snackbar;
