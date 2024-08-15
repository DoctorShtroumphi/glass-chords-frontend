// src/components/KeySelectionPanel.js
import React from 'react';

const KeySelectionPanel = ({ 
  selectedKey, 
  handleKeyChange, 
  showRedHues, 
  setShowRedHues, 
  chordData, 
  preMadeProgressions, 
  handleProgressionSelect 
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Selected Key:</label>
        <select
          value={selectedKey}
          onChange={handleKeyChange}
          style={styles.select}
        >
          {Object.entries(chordData.key_to_token)
            .sort(([, valueA], [, valueB]) => valueA - valueB)
            .map(([keyName, keyValue]) => (
              <option key={keyName} value={keyValue}>
                {keyName.replace(/:/g, ' ')}
              </option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Show off-key notes in red:</label>
        <input
          type="checkbox"
          checked={showRedHues}
          onChange={() => setShowRedHues(!showRedHues)}
          style={styles.checkbox}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Choose a pre-made progression:</label>
        <select
          style={styles.select}
          onChange={(e) => handleProgressionSelect(e.target.value)}
        >
          <option value="">Select a progression</option>
          {preMadeProgressions.map((progression, index) => (
            <option key={index} value={index}>
              {progression.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 10px',
    flex: '1',
    width: '33%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    textAlign: 'center',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '150px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
};

export default KeySelectionPanel;
