import React from 'react';
import { FileEdit, Download, Plus } from 'lucide-react';

const activities = [
  { id: 1, type: 'edit', title: 'Software Engineer Resume', date: '2 hours ago', icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, type: 'export', title: 'Product Manager Resume', date: 'Yesterday', icon: Download, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 3, type: 'create', title: 'Data Scientist Resume', date: '3 days ago', icon: Plus, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <li key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activity.bg}`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.type === 'edit' && 'Edited '}
                  {activity.type === 'export' && 'Exported '}
                  {activity.type === 'create' && 'Created '}
                  <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{activity.title}</span>
                </p>
                <p className="text-xs text-gray-500 truncate">{activity.date}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">View all activity</a>
      </div>
    </div>
  );
};
