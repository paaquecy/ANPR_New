import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface TopBarProps {
  title: string;
  onSearch: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Notification Icon */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </span>
          </button>
          
          {/* User Icon */}
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;