import React from 'react';
import { useState, useEffect } from 'react';
import { Share2, Pencil, Trash2, X } from 'lucide-react';

const WheelDetailModal = ({ wheel, onClose, onDelete, onEdit }) => {
  const [winners, setWinners] = useState([]);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/wheel/${wheel._id}`;

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wheels/${wheel._id}/details`);
        const data = await response.json();
        setWinners(data.winners);
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };

    fetchWinners();
  }, [wheel._id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{wheel.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Bagian Share Link */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Options dan Kode */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Option</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {wheel.options.map((option, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{option.text}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{option.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Winners List */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Winners</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prize</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {winners.map((winner, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{winner.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{winner.prize}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(winner.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => onEdit(wheel)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Edit Wheel
              </button>
              <button
                onClick={() => onDelete(wheel._id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Wheel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelDetailModal;