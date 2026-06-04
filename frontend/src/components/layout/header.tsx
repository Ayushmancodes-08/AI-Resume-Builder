'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        {/* Mobile menu button could go here */}
        <div className="relative text-gray-400 focus-within:text-gray-600 hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-0 sm:text-sm transition-colors duration-200"
            placeholder="Search resumes..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="w-6 h-6" />
        </button>
        <div className="relative">
          {/* Logout removed */}
        </div>
      </div>
    </header>
  );
};
