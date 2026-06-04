import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const MinimalTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  return (
    <div className="p-10 bg-white font-mono text-gray-900">
      <h1 className="text-2xl">{resumeData?.personalInfo?.name || 'name'}</h1>
      <p className="text-xs text-gray-500">{resumeData?.personalInfo?.title || 'title'}</p>
      <div className="mt-8 space-y-4">
        {/* Sections */}
      </div>
    </div>
  );
};
