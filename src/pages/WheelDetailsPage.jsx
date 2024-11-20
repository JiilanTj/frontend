import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WheelDetailsPage = () => {
  const { wheelId } = useParams();  // Getting wheelId from the URL
  const [wheel, setWheel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWheelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wheels/${wheelId}/details`);
        const data = await response.json();
        setWheel(data.wheel);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wheel details:', error);
        setLoading(false);
      }
    };

    fetchWheelDetails();
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

  if (!wheel) {
    return <div className="text-center text-gray-500 mt-12">Wheel not found</div>;
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
              {wheel.title}
            </h1>
            <p className="mt-2 text-gray-600">{wheel.numOptions} options available</p>
          </div>
        </div>

        {/* Options List Section (Updated Child-Parent Style) */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 backdrop-blur-lg bg-opacity-90">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Options:</h2>
            <div className="space-y-4">
              {wheel.options.map((option) => (
                <div 
                  key={option._id} 
                  className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 rounded-lg p-4 shadow-md hover:shadow-xl transform transition-all duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-800">{option.text}</span>
                    <span className="text-sm text-gray-500">Code: {option.code}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelDetailsPage;
