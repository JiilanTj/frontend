import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWheelModal from '../components/CreateWheelModal';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Link, 
  ArrowRight, 
  Trophy 
} from 'lucide-react';

const HomePage = () => {
  const [wheels, setWheels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch wheels from API
  const fetchWheels = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wheels');
      const data = await response.json();
      setWheels(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wheels:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWheels();
  }, []);

  // Filter wheels based on search term
  const filteredWheels = wheels.filter((wheel) =>
    wheel.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (wheelId) => {
    if (window.confirm('Are you sure you want to delete this wheel?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/wheels/delete/${wheelId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchWheels(); // Refresh the list after deletion
        }
      } catch (error) {
        console.error('Error deleting wheel:', error);
      }
    }
  };

  const handleCopyLink = (wheelId) => {
    const link = `${window.location.origin}/wheel/${wheelId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Spinning Wheel Creator
        </h1>
        <p className="text-gray-600 text-lg">
          Create and manage your custom spinning wheels with ease
        </p>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="search"
          placeholder="Search wheels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
        />
        <div className="flex gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Wheel
          </button>
          <button
            onClick={fetchWheels}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Wheels Grid */}
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    ) : filteredWheels.length > 0 ? (
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWheels.map((wheel) => (
          <div
            key={wheel._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {wheel.title}
                </h2>
                <p className="text-gray-600">
                  {wheel.numOptions} options available
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyLink(wheel._id)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Copy Link"
                >
                  <Link size={18} />
                </button>
                <button
                  onClick={() => navigate(`/wheel/${wheel._id}/details`)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => navigate(`/wheel/${wheel._id}/edit`)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Edit Wheel"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(wheel._id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Wheel"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => navigate(`/wheel/${wheel._id}`)}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors gap-2"
              >
                <span>Open Wheel</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate(`/wheel/${wheel._id}/winners`)}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors gap-2"
              >
                <Trophy size={16} />
                <span>Winners</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500 mt-12">
        <p className="text-xl">No wheels found</p>
      </div>
    )}

    {isCreateModalOpen && (
      <CreateWheelModal
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchWheels();
        }}
      />
    )}
  </div>
  );
};

export default HomePage;
