import React from 'react';

const GenerationOutputArea = ({ errorMessage, inputChords, generatedChords, hasAugOrDom7Chords, gridPopulated, isPlaying, handleClearGrid }) => {
  return (
    (errorMessage || generatedChords) && (
      <div
        style={{
          ...styles.messageContainer,
          backgroundColor: errorMessage ? '#f8d7da' : '#d1e7dd',
          border: `1px solid ${errorMessage ? '#f5c6cb' : '#badbcc'}`,
          color: errorMessage ? '#721c24' : '#0f5132',
        }}
      >
        {errorMessage ? (
          <p style={styles.messageText}>{errorMessage}</p>
        ) : (
          <>
            <div style={styles.chordsContainer}>
              <div style={styles.inputChordsContainer}>
                <h4>Input Chords:</h4>
                <p><strong>Key:</strong> {inputChords[0]}</p>
                <p><strong>Chords:</strong> {inputChords[1]}</p>
              </div>
              <div style={styles.generatedChordsContainer}>
                <h4>Generated Chords:</h4>
                <p><strong>Key:</strong> {generatedChords[0]}</p>
                <p><strong>Chords:</strong> {generatedChords[1]}</p>
              </div>
            </div>

            {hasAugOrDom7Chords && (
              <div style={styles.warningContainer}>
                <p>
                  Some of the chords generated here (e.g., augmented or dominant 7th chords) may not fit the selected key, and this is expected.
                  <br />
                  These chords can introduce interesting harmonic variations!
                </p>
              </div>
            )}

            {gridPopulated && (
              <button 
                style={{
                  ...styles.clearButton,
                  opacity: isPlaying ? 0.5 : 1,
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                }} 
                onClick={handleClearGrid}
              >
                Clear Generated Chords
              </button>
            )}
          </>
        )}
      </div>
    )
  );
};

const styles = {
  messageContainer: {
    padding: '10px',
    borderRadius: '5px',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  messageText: {
    marginBottom: '4px',
  },
  chordsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'left',
    width: '100%',
  },
  inputChordsContainer: {
    width: '48%',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ccc',
  },
  generatedChordsContainer: {
    width: '48%',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f1f8f9',
    border: '1px solid #ccc',
  },
  warningContainer: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    color: '#856404',
  },
  clearButton: {
    marginTop: '15px',
    padding: '5px 10px 6px 10px',
    backgroundColor: '#dd643c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default GenerationOutputArea;
