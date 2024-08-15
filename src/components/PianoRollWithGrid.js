// src/components/PianoRollWithGrid.js
import React, { useRef, useState, useEffect } from 'react';
import pianoImage from '../piano.png';

const PianoRollWithGrid = ({ selectedKeyNotes, showRedHues, notesWithOctaves, gridState, toggleNote, activeColumn }) => {
  const timeSteps = 8; // Number of time steps

  const imageRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(0);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageHeight(imageRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set height

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNotePitch = (note) => {
    const notePitchMap = {
      'C4': 1, 'C#4': 2, 'D4': 3, 'D#4': 4, 'E4': 5, 'F4': 6, 'F#4': 7,
      'G4': 8, 'G#4': 9, 'A4': 10, 'A#4': 11, 'B4': 12
    };
    return notePitchMap[note];
  };

  return (
    <div style={{ width: '95%', margin: '0 auto', display: 'flex', alignItems: 'center', border: '0.5px solid' }}>
      {/* Piano Keys */}
      <img
        ref={imageRef}
        src={pianoImage}
        alt="Piano Keys"
        style={{
          maxHeight: '480px',
          height: '100%',
          display: 'block',
          backgroundColor: 'transparent',
          border: '1px solid',
          flexShrink: 0,
        }}
        onLoad={handleImageLoad}
      />

      {/* Grid for Time Steps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${timeSteps}, 1fr)`,
          gridTemplateRows: `repeat(${notesWithOctaves.length}, 1fr)`,
          height: `${imageHeight}px`, // Match the height of the image
          flexGrow: 1,
          border: '1px solid #ccc', // Add border to the entire grid
          borderTop: 'none',
          borderBottom: 'none',
          gap: '0px', // Remove gaps between grid items
        }}
      >
        {notesWithOctaves.map((note, noteIndex) => {
          const notePitch = getNotePitch(note);
          const isNoteInKey = selectedKeyNotes.includes(notePitch);

          return (
            <React.Fragment key={note}>
              {[...Array(timeSteps)].map((_, stepIndex) => (
                <div
                  key={`${note}-${stepIndex}`}
                  style={{
                    backgroundColor: stepIndex === activeColumn 
                    ? '#d1e7dd' 
                    : stepIndex < 4 
                    ? (isNoteInKey 
                      ? (noteIndex % 2 === 0 ? '#f8f9fa' : '#e9ecef') 
                      : (showRedHues ? (noteIndex % 2 === 0 ? '#ffe7ef' : '#fce3ea') : (noteIndex % 2 === 0 ? '#f8f9fa' : '#e9ecef')))  // Red hue if note not in key
                    : (isNoteInKey 
                      ? (noteIndex % 2 === 0 ? '#a5b3c0' : '#8899aa') 
                      : (showRedHues ? (noteIndex % 2 === 0 ? '#c2b3c0' : '#af99aa') : (noteIndex % 2 === 0 ? '#a5b3c0' : '#8899aa'))),
                    borderLeft: stepIndex > 0 ? '1px solid #ccc' : 'none', // Column lines
                    borderBottom: '1px solid #ccc', // Row lines
                    cursor: stepIndex < 4 ? 'pointer' : 'not-allowed', // Only first 4 columns are editable
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={stepIndex < 4 ? () => toggleNote(noteIndex, stepIndex, notesWithOctaves[noteIndex]) : undefined}
                >
                  {gridState[noteIndex][stepIndex] && (
                    <div
                      style={{
                        width: '85%', // Set the pill width to 85% of the cell
                        padding: '5% 0px',
                        borderRadius: '15px',
                        backgroundColor: '#007bff',
                        color: '#ffffff',
                        textAlign: 'center',
                        boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                        fontWeight: 'bold',
                      }}
                    >
                      {gridState[noteIndex][stepIndex]}
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PianoRollWithGrid;
