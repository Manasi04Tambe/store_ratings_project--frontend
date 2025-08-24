import React, { useState, useEffect } from 'react';
import { Star, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Ratings = () => {
  const { user } = useAuth();
  const { fetchOwnerRatings } = useData();
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      setLoading(true);
      const result = await fetchOwnerRatings();
      if (result.success) {
        setRatingsData(result.data);
      }
      setLoading(false);
    };
    loadRatings();
  }, []);

  const getRatingDistribution = () => {
    if (!ratingsData || !ratingsData.ratings) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingsData.ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ratings</h1>
          <p className="text-gray-600 mt-1">Loading your store ratings...</p>
        </div>
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ratingsData || ratingsData.hasStore === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ratings</h1>
          <p className="text-gray-600 mt-1">View all ratings for your store</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Store Assigned
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You don't have a store assigned yet. Please contact the administrator.</p>
                {ratingsData?.message && (
                  <p className="mt-1 text-xs">{ratingsData.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Store Ratings</h1>
        <p className="text-gray-600 mt-1">Detailed view of all ratings for {ratingsData.storeName}</p>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Overview</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {ratingsData.ratings.length > 0
                ? (ratingsData.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingsData.ratings.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(ratingsData.ratings.length > 0
                      ? ratingsData.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingsData.ratings.length
                      : 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {ratingsData.totalRatings} review{ratingsData.totalRatings !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${
                        ratingsData.totalRatings > 0
                          ? (ratingDistribution[rating] / ratingsData.totalRatings) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Ratings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Ratings</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{ratingsData.ratings.length} total ratings</span>
          </div>
        </div>

        {ratingsData.ratings.length > 0 ? (
          <div className="space-y-4">
            {ratingsData.ratings.map((rating) => (
              <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{rating.userName}</h4>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= rating.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-semibold text-gray-900">{rating.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h4>
            <p className="text-gray-600">Your store hasn't received any ratings yet. Encourage customers to leave reviews!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
