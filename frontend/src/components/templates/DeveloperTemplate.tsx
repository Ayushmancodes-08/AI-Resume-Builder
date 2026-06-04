import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const DeveloperTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  return (
    <div className="p-8 bg-gray-900 text-green-400 font-mono">
      <div className="border-b border-green-700 pb-4">
        <h1 className="text-2xl">{`const name = "${resumeData?.personalInfo?.name || 'Your Name'}";`}</h1>
        <p>{`const role = "${resumeData?.personalInfo?.title || 'Software Engineer'}";`}</p>
      </div>
      {/* Sections */}
    </div>
  );
};
