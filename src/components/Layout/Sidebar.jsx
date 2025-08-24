import React from 'react';
import { 
  Home, 
  Users, 
  Store, 
  BarChart3, 
  UserPlus, 
  ShoppingBag,
  Star,
  Settings,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'stores', label: 'Stores', icon: Store },
          { id: 'add-user', label: 'Add User', icon: UserPlus },
          { id: 'add-store', label: 'Add Store', icon: ShoppingBag },
        ];
      case 'user':
        return [
          { id: 'stores', label: 'All Stores', icon: Store },
          { id: 'search', label: 'Search Stores', icon: Search },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'owner':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'ratings', label: 'My Ratings', icon: Star },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
