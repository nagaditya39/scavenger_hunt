import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://scavenger-hunt-backend.onrender.com/api'; // Replace with your actual Render URL

const App = () => {
  const [group, setGroup] = useState('group01');
  const [inputCode, setInputCode] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamProgress, setTeamProgress] = useState([]);
  const [publicProgress, setPublicProgress] = useState([]);

  useEffect(() => {
    fetchPublicProgress();
  }, []);

  const fetchPublicProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/public-progress`);
      setPublicProgress(response.data);
    } catch (error) {
      console.error('Error fetching public progress:', error);
    }
  };

  const fetchTeamProgress = async () => {
    if (!teamName) return;
    try {
      const response = await axios.get(`${API_URL}/team-progress/${teamName}`);
      setTeamProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching team progress:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const checkCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/check-code`, {
        group,
        code: inputCode,
        teamName
      });

      if (response.data.success) {
        setCurrentClue(response.data.clue);
        setError('');
        setIsPopupOpen(true);
        fetchTeamProgress();
        fetchPublicProgress();
      } else {
        setError('Invalid Code, Please try again');
        setCurrentClue('');
        setIsPopupOpen(false);
      }
    } catch (error) {
      console.error('Error checking code:', error);
      setError('An error occurred, please try again');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center bg-scavenger-hunt w-screen h-screen bg-cover bg-center text-white p-6 min-h-screen'>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Scavenger Hunt</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Name:</label>
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            className="w-full text-black border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select the group:</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full text-black border border-gray-300 rounded-md p-2">
            {['group1', 'group2', 'group3', 'group4', 'group5', 'group6'].map(group => 
              <option key={group} value={group}>
                Group {group.slice(-1)}
              </option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter the code:</label>
          <input 
            type="text" 
            value={inputCode} 
            placeholder='Enter the code'
            onChange={handleInputChange} 
            className="w-full text-black border border-gray-300 rounded-md p-2"
          />
        </div>
        <button onClick={checkCode} className="rounded-md w-full mb-4 py-2 bg-blue-950 text-center">Check</button>

        {error && <p style={{color: 'red'}} className="mb-4 border border-red-600 rounded-md p-2">{error}</p>}

        {isPopupOpen && currentClue && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-500 rounded-md p-4 max-w-sm mx-4 flex flex-col items-center justify-center">
              <p className="text-black text-center mb-4">Clue Found: {currentClue}</p>
              <button onClick={() => setIsPopupOpen(false)} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-black">Team Progress</h2>
          <ul className="text-black">
            {teamProgress.map((progress, index) => (
              <li key={index}>
              {progress.clue}: Found at {new Date(progress.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-black">Public Progress</h2>
          <ul className="text-black">
            {publicProgress.map((team, index) => (
              <li key={index}>Group {team.group.slice(-1)} - {team.name}: {team.cluesFound} clues found</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;