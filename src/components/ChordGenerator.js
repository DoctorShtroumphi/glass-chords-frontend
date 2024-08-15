import React, { useState } from 'react';
import ControllableElementPanels from './ControllableElementPanels';
import GenerateButton from './GenerateButton'
import PianoRollWithGrid from './PianoRollWithGrid';
import * as Tone from 'tone';
import KeySelectionPanel from './KeySelectionPanel';
import GenerationOutputArea from './GenerationOutputArea';

const ChordGenerator = ({ chordData, panelsVisible, setPanelsVisible, activePanel, setActivePanel }) => {
  const [trainingLevel, setTrainingLevel] = useState('Fully Trained');
  const [temperature, setTemperature] = useState(1.0);
  const [keyAwareLossEnabled, setKeyAwareLossEnabled] = useState(true);
  const [selectedKey, setSelectedKey] = useState(121);
  const selectedKeyNotes = chordData.key_to_notes[selectedKey];
  const [showRedHues, setShowRedHues] = useState(false);
  const notesWithOctaves = ['B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4'];
  const [gridState, setGridState] = useState(
    Array(notesWithOctaves.length)
      .fill(null)
      .map(() => Array(8).fill(null))
  );
  const [activeColumn, setActiveColumn] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputChords, setInputChords] = useState('');
  const [generatedChords, setGeneratedChords] = useState('');
  const [hasAugOrDom7Chords, setHasAugOrDom7Chords] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gridPopulated, setGridPopulated] = useState(false);

  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
  };

  const trainingOptions = [
    'Low',
    'Medium',
    'Fully Trained',
  ];

  const handlePanelClick = (panelName) => {
    // Toggle panel visibility
    setActivePanel((prevPanel) => (prevPanel === panelName ? null : panelName));
  };

  const toggleNote = (noteIndex, stepIndex, noteName) => {
    setGridState((prevState) => {
      const newState = prevState.map((row) => [...row]);
      newState[noteIndex][stepIndex] = newState[noteIndex][stepIndex] ? null : noteName;
      return newState;
    });
  };

  const handlePlay = async () => {
    await Tone.start(); // Ensure Tone.js context is started with user interaction
    setIsPlaying(true); // Disable the play button during playback

    const pianoSampler = new Tone.Sampler({
      urls: { C4: "C4.wav" },
      baseUrl: "/piano_samples/",
      onload: () => {
        const now = Tone.now();
        const noteDuration = 1.5;
        const stepsToPlay = gridPopulated ? 8 : 4;
        const timeInterval = noteDuration * 1000
  
        // Adjust for looping
        const totalSteps = isLooping ? stepsToPlay * 2 : stepsToPlay;
  
        for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
          const currentStep = stepIndex % stepsToPlay; // Ensures looping
  
          const notesToPlay = gridState
            .map((_, noteIndex) => gridState[noteIndex][currentStep])
            .filter((note) => note !== null);

          if (notesToPlay.length > 0) {
            notesToPlay.forEach((note) => {
              pianoSampler.triggerAttackRelease(note, noteDuration + 0.25, now + stepIndex * (noteDuration));
            });
          }

          setTimeout(() => {
            setActiveColumn(currentStep);
          }, stepIndex * timeInterval);
        }

        setTimeout(() => {
          setIsPlaying(false);
          setActiveColumn(null);
        }, totalSteps * timeInterval);
      },
    }).toDestination();
  };

  const handleClearGrid = () => {
    // Clear only the last four columns
    setGridState(prevState => 
      prevState.map(row => row.map((cell, colIndex) => (colIndex >= 4 ? null : cell)))
    );
    setGridPopulated(false);
    setErrorMessage('');
  };

  const preMadeProgressions = [
    {
      name: 'E min: VI - I - VII - VII',
      key: 'E:min',
      chords: ['C:maj', 'E:min', 'D:maj', 'D:maj'],
    },
    {
      name: 'F# maj: IV - V - III - VI',
      key: 'F#:maj',
      chords: ['B:maj', 'C#:maj', 'A#:min', 'D#:min'],
    },
    {
      name: 'G# min: I - IV - VII - V',
      key: 'G#:min',
      chords: ['G#:min', 'C#:min', 'F#:maj', 'D#:min'],
    },
  ];

  const handleProgressionSelect = (selectedIndex) => {
    if (selectedIndex === "") return;
  
    // Set the selected key in the dropdown
    setSelectedKey(chordData.key_to_token[preMadeProgressions[selectedIndex].key]);

    const selectedProgression = preMadeProgressions[selectedIndex].chords;
    
    const newGridState = [...gridState];
    // Clear the first 4 columns
    for (let rowIndex = 0; rowIndex < notesWithOctaves.length; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        newGridState[rowIndex][colIndex] = null;
      }
    }
    
    // Populate the grid with the selected chords
    selectedProgression.forEach((chordName, colIndex) => {
      const pitches = chordData.chord_to_midi_pitches[chordName].map(pitch => pitch % 12);
      pitches.forEach(pitch => {
        const rowIndex = 11 - pitch; // Translate pitch to the corresponding row index
        newGridState[rowIndex][colIndex] = notesWithOctaves[rowIndex];
      });
    });
  
    setGridState(newGridState);
  };
  
  return (
    <div style={styles.container}>
      <ControllableElementPanels
        panelsVisible={panelsVisible}
        trainingLevel={trainingLevel}
        setTrainingLevel={setTrainingLevel}
        temperature={temperature}
        setTemperature={setTemperature}
        keyAwareLossEnabled={keyAwareLossEnabled}
        setKeyAwareLossEnabled={setKeyAwareLossEnabled}
        activePanel={activePanel}
        handlePanelClick={handlePanelClick}
        trainingOptions={trainingOptions}
      />

      <hr style={styles.separator} />

      <KeySelectionPanel
        selectedKey={selectedKey}
        handleKeyChange={handleKeyChange}
        showRedHues={showRedHues}
        setShowRedHues={setShowRedHues}
        chordData={chordData}
        preMadeProgressions={preMadeProgressions}
        handleProgressionSelect={handleProgressionSelect}
      />

      <br />

      {/* Piano Roll */}
      <PianoRollWithGrid
        selectedKeyNotes={selectedKeyNotes}
        showRedHues={showRedHues}
        notesWithOctaves={notesWithOctaves}
        gridState={gridState}
        toggleNote={toggleNote}
        activeColumn={activeColumn}
      />

      <br />

      <div style={styles.controlButtonsContainer}>
        <div style={styles.playControlContainer}>
          <button 
            style={{
              ...styles.playButton,
              opacity: isPlaying ? 0.5 : 1,
              cursor: isPlaying ? 'not-allowed' : 'pointer',
            }} 
            onClick={handlePlay} 
            disabled={isPlaying}
          >
            Play
          </button>
          <label style={styles.loopLabel}>
            <input 
              type="checkbox" 
              checked={isLooping} 
              onChange={() => setIsLooping(!isLooping)} 
              style={{
                ...styles.loopCheckbox,
                opacity: isPlaying ? 0.5 : 1,
                cursor: isPlaying ? 'not-allowed' : 'pointer',
              }}
              disabled={isPlaying}
            />
            Loop Once
          </label>
        </div>

        <GenerateButton
          selectedKey={selectedKey}
          trainingLevel={trainingLevel}
          temperature={temperature}
          keyAwareLossEnabled={keyAwareLossEnabled}
          notesWithOctaves={notesWithOctaves}
          gridState={gridState}
          setGridState={setGridState}
          chordData={chordData}
          setPanelsVisible={setPanelsVisible}
          setInputChords={setInputChords}
          setGeneratedChords={setGeneratedChords}
          setHasAugOrDom7Chords={setHasAugOrDom7Chords}
          setErrorMessage={setErrorMessage}
          setGridPopulated={setGridPopulated}
          isPlaying={isPlaying}
        />
      </div>

      <GenerationOutputArea 
        errorMessage={errorMessage}
        inputChords={inputChords}
        generatedChords={generatedChords}
        hasAugOrDom7Chords={hasAugOrDom7Chords}
        gridPopulated={gridPopulated}
        isPlaying={isPlaying}
        handleClearGrid={handleClearGrid}
      />
    </div>
  );
};

// Styles
const styles = {
  container: {
    width: '95%',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '15px',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    border: 'none',
    borderTop: '1px solid black',
    margin: '20px 0',
  },
  controlButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  playControlContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  playButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  loopLabel: {
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  loopCheckbox: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
};

export default ChordGenerator;
