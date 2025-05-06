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
  const [hasWon, setHasWon] = useState(false);
  const [position, setPosition] = useState(null);
  const [totalTeams, setTotalTeams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        await fetchPublicProgress();
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize the app. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchPublicProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/public-progress`);
      setPublicProgress(response.data);
    } catch (error) {
      console.error('Error fetching public progress:', error);
      setError('Failed to fetch public progress');
      throw error;
    }
  };

  const fetchTeamProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/team-progress/${teamName.trim()}/${group}`);
      setCluesFound(response.data.cluesFound);
      setNextClueNumber(response.data.nextClueNumber);
      if (response.data.currentClueContent) {
        setCurrentClueContent(response.data.currentClueContent);
      }
      if (response.data.cluesFound === 7) {
        setHasWon(true);
        const positionResponse = await axios.get(`${API_URL}/team-position/${teamName}/${group}`);
        setPosition(positionResponse.data.position);
      }
    } catch (error) {
      console.error('Error fetching team progress:', error);
      setError('Failed to fetch team progress');
    }
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value.toUpperCase());
  };

  const setTeam = async () => {
    if (!teamName.trim() || !group) {
      setError('Please enter both team name and group');
      return;
    }
    try {
      await fetchTeamProgress();
      setIsTeamSet(true);
      setError('');
    } catch (error) {
      console.error('Error setting team:', error);
      setError('Failed to set team. Please try again.');
    }
  };

  const checkCode = async () => {
    if (!inputCode.trim()) {
      setError('Please enter a code');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/check-code`, {
        group,
        code: inputCode.trim(),
        teamName: teamName.trim(),
      });

      if (response.data.success) {
        setCurrentClueContent(response.data.clueContent);
        setNextClueNumber(response.data.nextClueNumber);
        setCluesFound(response.data.cluesFound);
        setError('');
        setIsPopupOpen(true);
        fetchPublicProgress();

        if (response.data.cluesFound === 7) {
          try {
            const positionResponse = await axios.get(`${API_URL}/team-position/${teamName}/${group}`);
            setPosition(positionResponse.data.position);
            setTotalTeams(positionResponse.data.totalTeams);
            setHasWon(true);
          } catch (positionError) {
            console.error('Error fetching team position:', positionError);
            setError('Error fetching team position');
          }
        }
      } else {
        setError(response.data.message || 'Invalid Code, Please try again');
      }
      setInputCode('');
    } catch (error) {
      console.error('Error checking code:', error);
      setError(error.response?.data?.message || 'An error occurred, please try again');
    }
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  if (isLoading && !initialLoadComplete) {
    return (
      <div className='flex flex-col items-center justify-center bg-scavenger-hunt w-screen min-h-screen bg-cover bg-center text-white p-6'>
        <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold mb-6 text-black">Treasure Hunt</h1>
          <p className="text-xl mb-4 text-black">Loading the game...</p>
          <p className="text-md mb-4 text-gray-600">
            This may take up to 1-1.5 minutes if the server has been inactive.
            Thank you for your patience!
          </p>
          {/* will add spinner icon maybe */}
        </div>
      </div>
    );
  }

  if (hasWon) {
    return (
      <div className='flex flex-col items-center justify-center bg-scavenger-hunt w-screen min-h-screen bg-cover bg-center text-white p-6'>
        <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-6 text-black">Congratulations!</h1>
          <p className="text-2xl mb-4 text-black">You've found all 6 clues!</p>
          {position && totalTeams ? (
            <div>
              <p className="text-3xl font-bold mb-2 text-black">
                Your team finished in {getOrdinal(position)} place!
              </p>
              <p className="text-xl mb-6 text-black">
                Out of {totalTeams} team{totalTeams !== 1 ? 's' : ''} that have completed the hunt.
              </p>
            </div>
          ) : (
            <p className="text-xl text-black">Calculating your final position...</p>
          )}
          <p className="text-xl text-black">Thank you for participating in the Treasure Hunt!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-start bg-scavenger-hunt w-screen min-h-screen bg-cover bg-center text-white p-6'>
      {/* Logo/Banner Section */}
      <div className="w-full mb-8 flex justify-center">
        <img
          src="https://nagaditya39.github.io/scavenger_hunt/Alstom_logo.png"
          alt="Treasure Hunt Logo"
          className="h-auto object-contain"
        />
      </div>

      <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Treasure Hunt</h1>

        {isLoading ? (
          <p className="text-center text-black mb-4">Loading...</p>
        ) : (
          <>
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
                <p className="mb-4 text-black">Team: {teamName} (Group {group})</p>
                <p className="mb-4 text-black">Clues Found: {cluesFound}</p>
                <p className="mb-4 text-black">Current clue: {currentClueContent || "No clue found yet"}</p>

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
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white border border-gray-500 rounded-md p-4 max-w-sm w-full mx-4 flex flex-col items-center justify-center">
                  <p className="text-black text-center mb-4">Clue : {currentClueContent}</p>
                  <button onClick={() => setIsPopupOpen(false)} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
                </div>
              </div>
            )}

            <div className="mt-8 w-full">
              <h2 className="text-xl font-bold mb-4 text-black">Leaderboard</h2>
              <ul className="text-black">
                {publicProgress.map((team, index) => (
                  <li key={index}>Group {team.group} - {team.name}: {team.cluesFound} clues found</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;