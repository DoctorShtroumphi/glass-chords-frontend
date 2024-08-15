import React from 'react';

const ControllableElementPanels = ({ trainingLevel, setTrainingLevel, temperature, setTemperature, keyAwareLossEnabled, setKeyAwareLossEnabled, activePanel, handlePanelClick, trainingOptions, panelsVisible }) => {
  return (
    <div style={styles.container}>
      {/* Smooth transition for the overlay */}
      <div
        style={{
          ...styles.overlay,
          opacity: panelsVisible ? 0 : 1,  // Fade out the overlay
          pointerEvents: panelsVisible ? 'none' : 'all',  // Disable interaction when faded out
        }}
      >
        <h2 style={styles.overlayText}>
          🚧 Caution: Do Not Touch! 
          <br />
          (Yet 😉)
        </h2>
      </div>

      <div style={styles.controlPanels}>
        <div style={styles.panel} onClick={() => handlePanelClick('training')}>
          <span>Training Level</span>
          {activePanel === 'training' && (
            <div style={styles.controlElement} onClick={(e) => e.stopPropagation()}>
              <select
                value={trainingLevel}
                onChange={(e) => setTrainingLevel(e.target.value)}
                style={styles.select}
              >
                {trainingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div style={styles.panel} onClick={() => handlePanelClick('temperature')}>
          <span>Temperature</span>
          {activePanel === 'temperature' && (
            <div style={styles.controlElement} onClick={(e) => e.stopPropagation()}>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={styles.slider}
              />
              <span>{temperature.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div style={styles.panel} onClick={() => handlePanelClick('keyAwareLoss')}>
          <span>Key Aware Loss</span>
          {activePanel === 'keyAwareLoss' && (
            <div style={styles.controlElement} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={keyAwareLossEnabled}
                onChange={() => setKeyAwareLossEnabled(!keyAwareLossEnabled)}
                style={styles.checkbox}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  controlPanels: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    padding: '10px',
    cursor: 'pointer',
    transition: 'opacity 0.5s ease',
  },
  panel: {
    flex: 1,
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#e9ecef',
    margin: '0 5px',
    transition: 'background-color 0.3s',
  },
  controlElement: {
    marginTop: '10px',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  slider: {
    width: '100px',
    marginBottom: '5px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'opacity 0.5s ease',
    width: '100%',
    height: '100%',
    pointerEvents: 'all',
  },
  overlayText: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default ControllableElementPanels;
