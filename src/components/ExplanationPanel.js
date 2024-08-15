// src/components/ExplanationPanel.js
import React from 'react';

const ExplanationPanel = ({ panelsVisible, activePanel }) => {
  if (!panelsVisible) {
    return (
        <div>
            Welcome to GlassChords! Here's a short explanation of how this works and what you need to do.
        </div>
    );
  }

  return (
    <div style={styles.explanationContainer}>
      <h2>Explanation of the Model</h2>
      {activePanel === 'training' && (
        <p>Explanation of Training Level...</p>
      )}
      {activePanel === 'temperature' && (
        <p>Explanation of Temperature...</p>
      )}
      {activePanel === 'keyAwareLoss' && (
        <p>Explanation of Key Aware Loss...</p>
      )}
    </div>
  );
};

const styles = {
  explanationContainer: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
};

export default ExplanationPanel;