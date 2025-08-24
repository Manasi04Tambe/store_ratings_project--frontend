import React, { useState, useEffect } from 'react';
import { Store as StoreIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AddStore = () => {
  const { addStore } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    rating: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'name':
        if (value.length < 20 || value.length > 60) {
          errors.name = 'Store name must be between 20 and 60 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Please provide a valid email address';
        }
        break;
      case 'address':
        if (value.length === 0 || value.length > 400) {
          errors.address = 'Address is required and must not exceed 400 characters';
        }
        break;
      case 'rating':
        const rating = parseFloat(value);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          errors.rating = 'Rating must be a number between 1 and 5';
        }
        break;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await addStore(formData);

    if (result.success) {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        address: '',
        rating: ''
      });
      setValidationErrors({});
      setTimeout(() => setSuccess(false), 3000);

      // Reload owners list
      const ownersResult = await getOwners();
      if (ownersResult.success) {
        setOwners(ownersResult.data);
      }
    } else {
      setError(result.error || 'Failed to create store');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || null
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Store</h1>
        <p className="text-gray-600 mt-1">Create a new store on the platform</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StoreIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Store created successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter store name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter store email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter store address"
              required
            />
            {validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Rating *
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter initial rating (1-5)"
              required
            />
            {validationErrors.rating && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.rating}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StoreIcon className="h-5 w-5" />
              <span>Create Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
