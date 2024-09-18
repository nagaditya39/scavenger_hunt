import React, { useState } from 'react';

const cluesdata = {
  
  group01: {
    'First Clue': 'A1B1C1 ',
    'Second Clue': 'A1B1C1',
    'Third Clue': 'A1B1C1',
    'Fourth Clue': 'A1B1C1',
    'Fifth Clue': 'A1B1C1',
    'Sixth Clue': 'A1B1C1',
  },
  group02: {
    'First Clue': 'A2B2C2',
    'Second Clue': 'A2B2C2',
    'Third Clue': 'A2B2C2',
    'Fourth Clue': 'A2B2C2',
    'Fifth Clue': 'A2B2C2',
    'Sixth Clue': 'A2B2C2',
  },
  group03: {
    'First Clue': 'A3B3C3',
    'Second Clue': 'A3B3C3',
    'Third Clue': 'A3B3C3',
    'Fourth Clue': 'A3B3C3',
    'Fifth Clue': 'A3B3C3',
    'Sixth Clue': 'A3B3C3',
  },
  group04: {
    'First Clue': 'A4B4C4',
    'Second Clue': 'A4B4C4',
    'Third Clue': 'A4B4C4',
    'Fourth Clue': 'A4B4C4',
    'Fifth Clue': 'A4B4C4',
    'Sixth Clue': 'A4B4C4',
  },
  group05: {
    'First Clue': 'A5B5C5',
    'Second Clue': 'A5B5C5',
    'Third Clue': 'A5B5C5',
    'Fourth Clue': 'A5B5C5',
    'Fifth Clue': 'A5B5C5',
    'Sixth Clue': 'A5B5C5',
  },
  group06: {
    'First Clue': 'A6B6C6',
    'Second Clue': 'A6B6C6',
    'Third Clue': 'A6B6C6',
    'Fourth Clue': 'A6B6C6',
    'Fifth Clue': 'A6B6C6',
    'Sixth Clue': 'A6B6C6',
  },
  group07: {
    'First Clue': 'A7B7C7',
    'Second Clue': 'A7B7C7',
    'Third Clue': 'A7B7C7',
    'Fourth Clue': 'A7B7C7',
    'Fifth Clue': 'A7B7C7',
    'Sixth Clue': 'A7B7C7',
  },
  group08: {
    'First Clue': 'A8B8C8',
    'Second Clue': 'A8B8C8',
    'Third Clue': 'A8B8C8',
    'Fourth Clue': 'A8B8C8',
    'Fifth Clue': 'A8B8C8',
    'Sixth Clue': 'A8B8C8',
  },
  group09: {
    'First Clue': 'A9B9C9',
    'Second Clue': 'A9B9C9',
    'Third Clue': 'A9B9C9',
    'Fourth Clue': 'A9B9C9',
    'Fifth Clue': 'A9B9C9',
    'Sixth Clue': 'A9B9C9',
  },
  group10: {
    'First Clue': '10',
    'Second Clue': '10',
    'Third Clue': '10',
    'Fourth Clue': '10',
    'Fifth Clue': '10',
    'Sixth Clue': '10',
  },
}

const App = () => {

  const [group, setGroup] = useState('group01');
  const [inputClue, setInputClue] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleInputChange = (e) => {
    setInputClue(e.target.value);
  }

  const checkCode = () => {
    const clues = cluesdata[group];
    const foundClue = Object.keys(clues).find(clue => clues[clue] === inputClue);

    if (foundClue){
      setCurrentClue(foundClue);
      setError('');
      setIsPopupOpen(true);
    }
    else {
      setError('Invalid Code, Please try again');
      setCurrentClue('');
      setIsPopupOpen(false);
    }

  };

  return(
    <div className='flex flex-col
    items-center
    justify-center
    bg-scavenger-hunt
    w-screen
    h-screen
    bg-cover
    bg-center
    text-white p-6 
    min-h-screen'>
      <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Scavenger Hunt</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 ">Select the group:</label>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full text-black border border-gray-300 rounded-md p-2">

          {Object.keys(cluesdata).map(group => 
            <option key={group} value={group}>
            Group {group.slice(-2)}
            </option>)}

        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter the code:</label>
        <input 
        type="text" 
        value={inputClue} 
        placeholder='Enter the code'
        onChange={handleInputChange} 
        className="w-full text-black border border-gray-300 rounded-md p-2"
        />
        </div>
        <button onClick={checkCode} className="rounded-md w-full mb-4 py-2 bg-blue-950 text-center">Check</button>
      

        {error && <p style={{color: 'red'}} className="mb-4 border  border-red-600 rounded-md p-2">{error}</p>}

        {isPopupOpen && currentClue && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-500 rounded-md p-4 max-w-sm mx-4 flex flex-col items-center justify-center">
            <p className="text-black text-center mb-4">Clue Found: {currentClue}</p>
            <button onClick={() => setIsPopupOpen(false)} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
          </div>
        </div>
      )}

        </div>
    </div>
  );

};

export default App;