// components/DetailWheelModal.jsx
import React from 'react';

const DetailWheelModal = ({ wheel, onClose }) => {
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Options</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Text</th>
                      <th className="text-left py-2">Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wheel.options.map((option, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">{option.text}</td>
                        <td className="py-2">{option.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><span className="font-medium">Created:</span> {new Date(wheel.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(wheel.updatedAt).toLocaleString()}</p>
                <p><span className="font-medium">Total Options:</span> {wheel.numOptions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailWheelModal;