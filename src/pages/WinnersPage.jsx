import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

const WinnersPage = () => {
  const { wheelId } = useParams();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/wheels/${wheelId}/winners`);
        const data = await response.json();
        setWinners(data.winners);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWinners();
  }, [wheelId]);
  
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={handleBack}
            className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back
          </button>
          <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
            <span className="text-sm text-gray-500">Wheel ID:</span>
            <span className="ml-2 text-sm font-medium text-gray-900">{wheelId}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 backdrop-blur-lg bg-opacity-90">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Winners List
            </h1>
            <p className="mt-2 text-gray-600">
              See all the lucky winners from this wheel!
            </p>
          </div>
        </div>

        {/* Winners List Section */}
        {winners && winners.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {winners.map((winner) => (
              <div 
                key={winner._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 backdrop-blur-lg bg-opacity-90"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                        <span className="text-white font-semibold text-lg">
                          {winner.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {winner.username}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <svg 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        {new Date(winner.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-800">
                        <svg 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        Prize: {winner.prize}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Code: {winner.code}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl backdrop-blur-lg bg-opacity-90">
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No winners yet</h3>
              <p className="mt-2 text-base text-gray-500">
                Be the first one to win on this wheel!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersPage;