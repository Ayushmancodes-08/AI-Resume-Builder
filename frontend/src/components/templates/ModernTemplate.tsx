import React from 'react';

// Common interface for all templates
export interface TemplateProps {
  resumeData: any; // Will be properly typed later
  theme?: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  return (
    <div className="p-8 bg-white font-sans text-gray-800">
      <h1 className="text-4xl font-bold text-blue-600">{resumeData?.personalInfo?.name || 'Your Name'}</h1>
      <p className="text-xl text-gray-600 mt-2">{resumeData?.personalInfo?.title || 'Professional Title'}</p>
      {/* Additional sections will be rendered here */}
    </div>
  );
};
