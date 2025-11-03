import React, { useState } from 'react';
import './BackgroundSwitcher.css';
import { FaPalette, FaTimes } from 'react-icons/fa';

const backgrounds = [
  { id: 'solid', name: 'Original', description: 'Simple solid background' },
  { id: 'gradient-mesh', name: 'Gradient Mesh', description: 'Smooth animated gradients' },
];

const BackgroundSwitcher = ({ currentBackground, onBackgroundChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackgroundSelect = (bgId) => {
    onBackgroundChange(bgId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`bg-switcher-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change background"
        title="Change background style"
      >
        {isOpen ? <FaTimes /> : <FaPalette />}
      </button>

      {isOpen && (
        <>
          <div className="bg-switcher-overlay" onClick={() => setIsOpen(false)} />
          <div className="bg-switcher-panel">
            <div className="bg-switcher-header">
              <h3>Background Style</h3>
              <p>Choose your preferred background</p>
            </div>
            <div className="bg-switcher-grid">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  className={`bg-option ${currentBackground === bg.id ? 'active' : ''}`}
                  onClick={() => handleBackgroundSelect(bg.id)}
                >
                  <div className="bg-option-preview">
                    <div className={`preview-${bg.id}`}></div>
                  </div>
                  <div className="bg-option-info">
                    <span className="bg-option-name">{bg.name}</span>
                    <span className="bg-option-desc">{bg.description}</span>
                  </div>
                  {currentBackground === bg.id && (
                    <div className="bg-option-check">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BackgroundSwitcher;

