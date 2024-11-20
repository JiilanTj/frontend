import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SpinningWheel from '../components/SpinningWheel';

const WheelPage = () => {
  const { id } = useParams();
  const [wheel, setWheel] = useState(null);
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [finalRotation, setFinalRotation] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio('/assets/sound/backsound.mp3'));
  // const spinSoundRef = useRef(new Audio('/assets/sound/spin.mp3')); // Optional spinning sound

  useEffect(() => {
    const audio = audioRef.current; // Copy ref value to a variable
  
    // Setup background music
    audio.loop = true;
    audio.volume = 0.3;
  
    // Start playing background music
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  
    // Cleanup function
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  

  useEffect(() => {
    const fetchWheel = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wheels/${id}`);
        const data = await response.json();

        if (response.ok) {
          setWheel(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to load wheel');
      }
    };

    fetchWheel();
  }, [id]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !audioRef.current.muted;
  };

  const handleSpin = async (e) => {
    e.preventDefault();
    if (isSpinning) return;

    if (!username.trim()) {
      setErrorMessage('Please enter your username');
      setShowError(true);
      return;
    }

    try {
      setError(null);
      setIsSpinning(true);

      // Play spin sound if not muted
      // if (!isMuted) {
      //   spinSoundRef.current.play();
      // }

      const response = await fetch('http://localhost:5000/api/wheels/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wheelId: id,
          code,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const segmentAngle = 360 / wheel.options.length;
        const winningPosition = wheel.options.findIndex(
          (opt) => opt.text === data.result.text
        );
        const rotation = 360 - (winningPosition * segmentAngle) - segmentAngle / 2;
        setFinalRotation(rotation);

        setTimeout(() => {
          setResult(data.result);
        }, 4000);

        // Save winner data
        await fetch('http://localhost:5000/api/wheels/save-winner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wheelId: id,
            username,
            code,
            prize: data.result.text,
          }),
        });
      } else {
        setErrorMessage(data.error || 'Invalid code');
        setShowError(true);
        setIsSpinning(false);
      }
    } catch (error) {
      setErrorMessage('Failed to spin wheel');
      setShowError(true);
      setIsSpinning(false);
    }
  };

  const handleSpinEnd = () => {
    setIsSpinning(false);
    // Stop spin sound if it's playing
    // spinSoundRef.current.pause();
    // spinSoundRef.current.currentTime = 0;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-center text-white p-8 rounded-lg bg-red-600 bg-opacity-90 shadow-xl">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!wheel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-spin rounded-full h-16 w-16 border-8 border-purple-600 border-t-transparent shadow-xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background image container */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: "url('/assets/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10" />
      
      {/* Content container */}
      <div className="relative z-20">
        {/* Sound Control Button */}
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 shadow-lg"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8 drop-shadow-lg">
            {wheel.title}
          </h1>

          <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
            <SpinningWheel
              options={wheel.options}
              isSpinning={isSpinning}
              finalRotation={finalRotation}
              onSpinEnd={handleSpinEnd}
            />
          </div>

          <div className="max-w-md mx-auto bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleSpin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  disabled={isSpinning}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Wheel Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code here"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  disabled={isSpinning}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSpinning}
                className={`w-full px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isSpinning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl'
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Spinning...
                  </span>
                ) : (
                  'Spin the Wheel'
                )}
              </button>
            </form>

            {result && (
              <div className="mt-6 p-6 bg-green-100 rounded-xl animate-fade-in">
                <p className="text-center text-green-800 text-lg font-bold">
                  🎉 Congratulations! 🎉
                </p>
                <p className="text-center text-green-700 mt-2">
                  You won: <span className="font-bold">{result.text}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 transform animate-modal-appear shadow-2xl">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error
              </h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowError(false)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelPage;