import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const { fetchDashboard } = useData();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const result = await fetchDashboard();
      if (result.success) {
        setDashboardData(result.data);
      }
      setLoading(false);
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">Loading your store data...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData || dashboardData.hasStore === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">Your store analytics and ratings</p>
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
                <p>You don't have a store assigned yet. Please contact the administrator to assign a store to your account.</p>
                {dashboardData?.message && (
                  <p className="mt-1 text-xs">{dashboardData.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Average Rating',
      value: dashboardData.averageRating ? dashboardData.averageRating.toFixed(1) : '0.0',
      icon: Star,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Total Ratings',
      value: dashboardData.ratings ? dashboardData.ratings.length : 0,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Rating Trend',
      value: dashboardData.ratings && dashboardData.ratings.length > 1 ?
        (dashboardData.ratings[dashboardData.ratings.length - 1]?.rating > dashboardData.ratings[dashboardData.ratings.length - 2]?.rating ? '↑' : '↓') : '-',
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Analytics for {dashboardData.storeName || 'your store'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <p className="text-sm text-gray-900">{dashboardData.storeName || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store ID</label>
            <p className="text-sm text-gray-900">{dashboardData.storeId || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Average Rating</label>
            <p className="text-sm text-gray-900">
              {dashboardData.averageRating ? dashboardData.averageRating.toFixed(1) + ' ⭐' : 'No ratings yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Ratings</h3>
        
        {dashboardData.ratings && dashboardData.ratings.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.ratings.slice(-10).reverse().map((rating, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{rating.userName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-600">Rating: {rating.rating}/5</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= rating.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium text-gray-900">{rating.rating}/5</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h4>
            <p className="text-gray-600">Your store hasn't received any ratings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
