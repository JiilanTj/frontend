import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import config from '../config';

const EditWheelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    options: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wheel data
  useEffect(() => {
    const fetchWheel = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/wheels/${id}`);
        if (!response.ok) throw new Error('Failed to fetch wheel data');
        
        const data = await response.json();
        setFormData({
          title: data.title,
          options: data.options.map((opt, index) => ({
            text: opt.text,
            code: opt.code || String(index + 1), // Fallback if code isn't provided
            position: opt.position || index
          }))
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWheel();
  }, [id]);

  // Handle form changes
  const handleTitleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]: value
      };
      return { ...prev, options: newOptions };
    });
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          text: '',
          code: String(prev.options.length + 1),
          position: prev.options.length
        }
      ]
    }));
  };

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options
        .filter((_, i) => i !== index)
        .map((opt, i) => ({ ...opt, position: i }))
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${config.BASE_URL}/wheels/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numOptions: formData.options.length
        })
      });

      if (!response.ok) throw new Error('Failed to update wheel');
      
      navigate(`/`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Wheel</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wheel Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Options Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Wheel Options
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Option
            </button>
          </div>

          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  placeholder="Option text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  value={option.code}
                  onChange={(e) => handleOptionChange(index, 'code', e.target.value)}
                  placeholder="Code"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWheelPage;