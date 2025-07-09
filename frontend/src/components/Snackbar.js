import React, { useEffect } from "react";
import "./Snackbar.css";

const Snackbar = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="snackbar">{message}</div>;
};

export default Snackbar;
