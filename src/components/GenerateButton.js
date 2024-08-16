// src/components/GenerateButton.js
import React from 'react';
import axios from 'axios';

const GenerateButton = ({ selectedKey, trainingLevel, temperature, keyAwareLossEnabled, notesWithOctaves, gridState, setGridState, chordData, setPanelsVisible,
                             setInputChords, setGeneratedChords, setHasAugOrDom7Chords, setErrorMessage, setGridPopulated, isPlaying }) => {
  // Function to translate the given note pitch to the corresponding one in the backend dictionary
  function getRelativePitch(input) {
    const index = notesWithOctaves.indexOf(input);
    var notePitch = -1;
    if (index !== -1) {
      notePitch = notesWithOctaves.length - 1 - index;
    }

    return notePitch + 48;
  }

  const handleGenerate = async () => {
    try {
      // Mapping training level to model type
      const modelTypeMapping = {
        'Low': 'least_trained',
        'Medium': 'mid_trained',
        'Fully Trained': 'normal'
      };

      const modelType = String(modelTypeMapping[trainingLevel]);
      const key = parseInt(selectedKey, 10);
      const chords = [];

      // Loop through each column in the grid
      for (let colIndex = 0; colIndex < gridState[0].length - 4; colIndex++) {
        const chord = [];

        // Loop through each row in the current column
        for (let rowIndex = 0; rowIndex < gridState.length; rowIndex++) {
          const note = gridState[rowIndex][colIndex];
          if (note !== null) {
            const token = getRelativePitch(note);
            chord.push(parseInt(token, 10));
          }
        }

        // If the chord is not empty, add it to the chords array
        if (chord.length > 0) {
          chords.push(chord);
        }
      }

      // Validation: Ensure exactly 4 chords are selected
      if (chords.length !== 4) {
        setErrorMessage('Please input exactly 4 chords.');
        return;
      }

      // Function to reverse lookup the chord string name
      const findChordName = (chordArray) => {
        // Iterate through the dictionary entries
        for (const [chordName, midiPitches] of Object.entries(chordData.chord_to_midi_pitches)) {
          // Sort the arrays to ensure the order doesn't affect the comparison
          const sortedMidiPitches = midiPitches.slice().sort((a, b) => a - b);
          const sortedChordArray = chordArray.slice().sort((a, b) => a - b);

          // Check if the arrays match
          if (JSON.stringify(sortedMidiPitches) === JSON.stringify(sortedChordArray)) {
            return chordName;
          }
        }
        return 'N';
      };

      // Map through the chords array and find their names
      const chordNames = chords.map(chord => findChordName(chord));
      const invalidChordIndex = chordNames.findIndex(chordName => chordName === 'N');

      // Validation: Check for invalid chords
      if (invalidChordIndex !== -1) {
        setErrorMessage(`Chord ${invalidChordIndex + 1} is not in our chord dictionary.`);
        return;
      }

      // Function to get tokens from chord names
      const getTokensFromChordNames = (chordNames, chordData) => {
        return chordNames.map(chordName => chordData.chord_to_token[chordName]);
      };

      // Get the tokens corresponding to the chord names
      const tokens = getTokensFromChordNames(chordNames, chordData);

      const temperatureValue = parseFloat(temperature);

      console.log(`Generating melody with the following settings:
        Training Level: ${trainingLevel}
        Temperature: ${temperature}
        Key-Aware Loss: ${keyAwareLossEnabled}`);

      const response = await axios.post('https://glass-chords-backend-ddebb2ffdbec.herokuapp.com/generate_chords', {
        key: key,
        chords: tokens,
        model_type: modelType,
        temperature: temperatureValue,
        key_aware_loss_enabled: keyAwareLossEnabled
      });

      const generatedChordTokens = response.data.generated_chords;
      if (generatedChordTokens.length > 0) {
        // First token is the key, separate it
        const generatedKeyToken = generatedChordTokens[0];
        const generatedChordTokensWithoutKey = generatedChordTokens.slice(1);
      
        // Reverse lookup the key name
        const inputKeyName = Object.entries(chordData.key_to_token).find(([_, token]) => token === key)?.[0] || 'Unknown Key';
        const generatedKeyName = Object.entries(chordData.key_to_token).find(([_, token]) => token === generatedKeyToken)?.[0] || 'Unknown Key';
       
        // Reverse lookup the generated chords to their names, skipping the key token
        const generatedChordNames = generatedChordTokensWithoutKey.map(token => {
          for (const [chordName, tokenValue] of Object.entries(chordData.chord_to_token)) {
            if (tokenValue === token) {
              return chordName;
            }
          }
          return 'Unknown chord';
        });

        // Populate the last 4 columns of the grid with the generated chords
        const newGridState = [...gridState];
        // Clear the cells/notes in the columns after 4
        newGridState.forEach(row => {
          for (let colIndex = 4; colIndex < row.length; colIndex++) {
            row[colIndex] = null;
          }
        });
        generatedChordNames.forEach((chordName, colIndex) => {
          const pitches = chordData.chord_to_midi_pitches[chordName].map(pitch => pitch % 12);
          pitches.forEach(pitch => {
            const rowIndex = 11 - pitch; // Translate pitch to the corresponding row index
            newGridState[rowIndex][4 + colIndex] = notesWithOctaves[rowIndex];
          });
        });
        setGridState(newGridState);
        
        // Check for augmented or dominanth 7th chords
        const hasAugOrDom7Chords = generatedChordNames.some(chord => 
          chord.includes('aug') || chord.includes(':7')
        );

        // Set the generated chords and ready the success message
        setPanelsVisible(true)
        setInputChords([inputKeyName, chordNames.join(', ')])
        setGeneratedChords([generatedKeyName, generatedChordNames.join(', ')]);
        setHasAugOrDom7Chords(hasAugOrDom7Chords)
        setErrorMessage('')
        setGridPopulated(true)
      } else {
        setErrorMessage('No chords were generated.');
      }
    } catch (error) {
      console.error("There was an error generating the chords.", error);
      setErrorMessage('There was an error generating the chords.');
    }
  };

  return (
    <button 
      style={{
        ...styles.generateButton,
        opacity: isPlaying ? 0.5 : 1,
        cursor: isPlaying ? 'not-allowed' : 'pointer',
      }} onClick={handleGenerate}>
      Generate
    </button>
  );
};

const styles = {
  generateButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default GenerateButton;
