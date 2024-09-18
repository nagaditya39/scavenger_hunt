import React, { useState } from 'react';

const cluesdata = {
  
  group1: {
    'First Clue': 'A1B2C3 ',
    'Second Clue': 'D4E5F6',
    'Third Clue': 'G7H8I9',
    'Fourth Clue': 'J1K2L3',
    'Fifth Clue': 'M4N5O6',
    'Sixth Clue': 'P7Q8R9',
  },
  group2: {
    'First Clue': 'S1T2U3',
    'Second Clue': 'V4W5X6',
    'Third Clue': 'Y7Z8A9',
    'Fourth Clue': 'B1C2D3',
    'Fifth Clue': 'E4F5G6',
    'Sixth Clue': 'H7I8J9',
  },
  group3: {
    'First Clue': 'K1L2M3',
    'Second Clue': 'N4O5P6',
    'Third Clue': 'Q7R8S9',
    'Fourth Clue': 'T1U2V3',
    'Fifth Clue': 'W4X5Y6',
    'Sixth Clue': 'Z7A8B9',
  },
  group4: {
    'First Clue': 'C1D2E3',
    'Second Clue': 'F4G5H6',
    'Third Clue': 'I7J8K9',
    'Fourth Clue': 'L1M2N3',
    'Fifth Clue': 'O4P5Q6',
    'Sixth Clue': 'R7S8T9',
  },
  group5: {
    'First Clue': 'U1V2W3',
    'Second Clue': 'X4Y5Z6',
    'Third Clue': 'A7B8C9',
    'Fourth Clue': 'D1E2F3',
    'Fifth Clue': 'G4H5I6',
    'Sixth Clue': 'J7K8L9',
  },
  group6: {
    'First Clue': 'M1N2O3',
    'Second Clue': 'P4Q5R6',
    'Third Clue': 'S7T8U9',
    'Fourth Clue': 'V1W2X3',
    'Fifth Clue': 'Y4Z5A6',
    'Sixth Clue': 'B7C8D9',
  },
  group7: {
    'First Clue': 'E1F2G3',
    'Second Clue': 'H4I5J6',
    'Third Clue': 'K7L8M9',
    'Fourth Clue': 'N1O2P3',
    'Fifth Clue': 'Q4R5S6',
    'Sixth Clue': 'T7U8V9',
  },
  group8: {
    'First Clue': 'W1X2Y3',
    'Second Clue': 'Z4A5B6',
    'Third Clue': 'C7D8E9',
    'Fourth Clue': 'F1G2H3',
    'Fifth Clue': 'I4J5K6',
    'Sixth Clue': 'L7M8N9',
  },
  group9: {
    'First Clue': 'O1P2Q3',
    'Second Clue': 'R4S5T6',
    'Third Clue': 'U7V8W9',
    'Fourth Clue': 'X1Y2Z3',
    'Fifth Clue': 'A4B5C6',
    'Sixth Clue': 'D7E8F9',
  },
  group10: {
    'First Clue': 'G1H2I3',
    'Second Clue': 'J4K5L6',
    'Third Clue': 'M7N8O9',
    'Fourth Clue': 'P1Q2R3',
    'Fifth Clue': 'S4T5U6',
    'Sixth Clue': 'V7W8X9',
  },
}

const App = () => {

  const [group, setGroup] = useState('group1');
  const [inputClue, setInputClue] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputClue(e.target.value);
  }

  const checkCode = () => {
    const clues = cluesdata[group];
    const foundClue = Object.keys(clues).find(clue => clues[clue] === inputClue);

    if (foundClue){
      setCurrentClue(foundClue);
      setError('');
    }
    else {
      setError('Invalid Code, Please try again');
      setCurrentClue('');
    }

  };

  return(
    <div>
      <h1>Scavenger Hunt</h1>
      <label>Select the group:</label>
      <select value={group} onChange={(e) => setGroup(e.target.value)}>

        {Object.keys(cluesdata).map(group => 
          <option key={group} value={group}>
          Group {group.slice(-1)}
          </option>)}

      </select>

      <div>
        <label>Enter the code:</label>
        <input 
        type="text" 
        value={inputClue} 
        placeholder='Enter the code'
        onChange={handleInputChange} 
        />
        <button onClick={checkCode}>Check</button>
      </div>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {currentClue && <p>Clue Found: {currentClue}</p>}

    </div>
  );

};

export default App;