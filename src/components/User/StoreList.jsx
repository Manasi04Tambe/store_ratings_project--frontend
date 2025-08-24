import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const StoreList = () => {
  const { stores, submitRating, fetchStores } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      await fetchStores();
      setLoading(false);
    };
    loadStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRating = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.myRating || 0;
  };

  const handleRatingSubmit = async (storeId, rating) => {
    const result = await submitRating(storeId, rating);
    if (result.success) {
      // Refresh stores to get updated ratings
      await fetchStores();
    } else {
      alert(result.error || 'Failed to submit rating');
    }
  };

  const StarRating = ({ storeId, currentRating, userRating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= (hoverRating || userRating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              />
            </button>
          ))}
        </div>
        {userRating && (
          <span className="text-sm text-blue-600 font-medium">
            Your rating: {userRating}/5
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Stores</h1>
        <p className="text-gray-600 mt-1">Discover and rate stores</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores by name or address..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => {
          const userRating = getUserRating(store.id);
          return (
            <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {store.overallRating ? store.overallRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-sm font-medium text-gray-700 block mb-2">
                  Rate this store:
                </span>
                <StarRating
                  storeId={store.id}
                  currentRating={store.overallRating}
                  userRating={userRating}
                  onRate={(rating) => handleRatingSubmit(store.id, rating)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria' : 'No stores available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreList;
