import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // API Functions
  const fetchUsers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const fetchStores = async (filters = {}) => {
    try {
      const endpoint = user?.role === 'admin' ? '/admin/stores' : '/user/stores';
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const fetchDashboard = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/admin/dashboard' : '/owner/dashboard';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        await fetchUsers(); // Refresh users list
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const addStore = async (storeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData),
      });
      if (response.ok) {
        const data = await response.json();
        await fetchStores(); // Refresh stores list
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const submitRating = async (storeId, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/ratings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ storeId, rating }),
      });
      if (response.ok) {
        const data = await response.json();
        await fetchStores(); // Refresh stores to get updated ratings
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const getOwners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/owners`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const fetchOwnerRatings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/ratings`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    users,
    stores,
    loading,
    fetchUsers,
    fetchStores,
    fetchDashboard,
    addUser,
    addStore,
    submitRating,
    getOwners,
    fetchOwnerRatings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};