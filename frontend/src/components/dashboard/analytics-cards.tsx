import React from 'react';
import { FileText, Eye, CheckCircle, TrendingUp } from 'lucide-react';

export const AnalyticsCards = () => {
  const stats = [
    { name: 'Total Resumes', value: '3', icon: FileText, change: '+1 this month', changeType: 'positive' },
    { name: 'Profile Views', value: '124', icon: Eye, change: '+14% from last month', changeType: 'positive' },
    { name: 'ATS Score Avg', value: '86%', icon: CheckCircle, change: '+2% from last month', changeType: 'positive' },
    { name: 'Interviews Landed', value: '4', icon: TrendingUp, change: 'Keep it up!', changeType: 'neutral' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <span className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full">
              <stat.icon className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
          <div className="mt-2 text-sm text-gray-600">
             <span className={stat.changeType === 'positive' ? 'text-green-600 font-medium' : ''}>
               {stat.change}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};
