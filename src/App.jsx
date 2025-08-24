import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';

// Admin Components
import Dashboard from './components/Admin/Dashboard.jsx';
import UserManagement from './components/Admin/UserManagement.jsx';
import StoreManagement from './components/Admin/StoreManagement.jsx';
import AddUser from './components/Admin/AddUser.jsx';
import AddStore from './components/Admin/AddStore.jsx';

// User Components
import StoreList from './components/User/StoreList.jsx';
import Settings from './components/User/Settings.jsx';

// Store Owner Components
import StoreOwnerDashboard from './components/StoreOwner/Dashboard.jsx';
import Ratings from './components/StoreOwner/Ratings.jsx';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    switch (user?.role) {
      case 'admin':
        return 'dashboard';
      case 'user':
        return 'stores';
      case 'owner':
        return 'dashboard';
      default:
        return 'dashboard';
    }
  });

  const renderContent = () => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'users':
          return <UserManagement />;
        case 'stores':
          return <StoreManagement />;
        case 'add-user':
          return <AddUser />;
        case 'add-store':
          return <AddStore />;
        default:
          return <Dashboard />;
      }
    } else if (user?.role === 'user') {
      switch (activeTab) {
        case 'stores':
          return <StoreList />;
        case 'search':
          return <StoreList />;
        case 'settings':
          return <Settings />;
        default:
          return <StoreList />;
      }
    } else if (user?.role === 'owner') {
      switch (activeTab) {
        case 'dashboard':
          return <StoreOwnerDashboard />;
        case 'ratings':
          return <Ratings />;
        case 'settings':
          return <Settings />;
        default:
          return <StoreOwnerDashboard />;
      }
    }

    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AuthContainer = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    return (
      <DataProvider>
        <AppContent />
      </DataProvider>
    );
  }

  return isLogin ? (
    <Login onToggleMode={() => setIsLogin(false)} />
  ) : (
    <Signup onToggleMode={() => setIsLogin(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthContainer />
    </AuthProvider>
  );
}

export default App;