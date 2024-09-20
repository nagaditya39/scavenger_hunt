import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://scavenger-hunt-backend.onrender.com/api';

const App = () => {
  const [group, setGroup] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [currentClueContent, setCurrentClueContent] = useState('');
  const [nextClueNumber, setNextClueNumber] = useState(null);
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [publicProgress, setPublicProgress] = useState([]);
  const [isTeamSet, setIsTeamSet] = useState(false);
  const [cluesFound, setCluesFound] = useState(0);

  useEffect(() => {
    fetchPublicProgress();
  }, []);

  const fetchPublicProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/public-progress`);
      setPublicProgress(response.data);
    } catch (error) {
      console.error('Error fetching public progress:', error);
      setError('Failed to fetch public progress');
    }
  };

  const fetchTeamProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/team-progress/${teamName}/${group}`);
      setCluesFound(response.data.cluesFound);
      setNextClueNumber(response.data.nextClueNumber);
    } catch (error) {
      console.error('Error fetching team progress:', error);
      setError('Failed to fetch team progress');
    }
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const setTeam = () => {
    if (!teamName.trim() || !group) {
      setError('Please enter both team name and group');
      return;
    }
    setIsTeamSet(true);
    setError('');
    fetchTeamProgress();
  };

  const checkCode = async () => {
    if (!inputCode.trim()) {
      setError('Please enter a code');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/check-code`, {
        group,
        code: inputCode,
        teamName
      });

      if (response.data.success) {
        setCurrentClueContent(response.data.clueContent);
        setNextClueNumber(response.data.nextClueNumber);
        setCluesFound(response.data.cluesFound);
        setError('');
        setIsPopupOpen(true);
        fetchPublicProgress();
      } else {
        setError(response.data.message || 'Invalid Code, Please try again');
        setCurrentClueContent('');
        setIsPopupOpen(false);
      }
    } catch (error) {
      console.error('Error checking code:', error);
      setError(error.response?.data?.message || 'An error occurred, please try again');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center bg-scavenger-hunt w-screen h-screen bg-cover bg-center text-white p-6 min-h-screen'>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Scavenger Hunt</h1>

        {!isTeamSet ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Rep:</label>
              <input 
                type="text" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
                className="w-full text-black border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select your group:</label>
              <select 
                value={group} 
                onChange={(e) => setGroup(e.target.value)} 
                className="w-full text-black border border-gray-300 rounded-md p-2"
              >
                <option value="">Select a group</option>
                {['Air', 'Fire', 'Water', 'Earth', 'Ether'].map(g => 
                  <option key={g} value={g}>{g}</option>
                )}
              </select>
            </div>

            <button onClick={setTeam} className="rounded-md w-full mb-4 py-2 bg-blue-950 text-center text-white">
              Set Team
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-black">Team: {teamName} (Group {group.slice(-1)})</p>
            <p className="mb-4 text-black">Clues Found: {cluesFound}</p>
            {nextClueNumber && <p className="mb-4 text-black">Current clue: {currentClueContent}</p>}

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
            <button onClick={checkCode} className="rounded-md w-full mb-4 py-2 bg-blue-950 text-center text-white">
              Check Code
            </button>
          </>
        )}

        {error && (
          <p className="mb-4 border border-red-600 rounded-md p-2 bg-red-100 text-red-800">
            {error}
          </p>
        )}

        {isPopupOpen && currentClueContent && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-500 rounded-md p-4 max-w-sm mx-4 flex flex-col items-center justify-center">
              <p className="text-black text-center mb-4">Clue Content: {currentClueContent}</p>
              <button onClick={() => setIsPopupOpen(false)} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
            </div>
          </div>
        )}

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