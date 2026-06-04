import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const CorporateTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  return (
    <div className="p-8 bg-white font-serif text-black border-t-8 border-gray-800">
      <div className="text-center">
        <h1 className="text-3xl uppercase tracking-widest">{resumeData?.personalInfo?.name || 'YOUR NAME'}</h1>
        <p className="text-sm tracking-widest mt-1 text-gray-500">{resumeData?.personalInfo?.title || 'TITLE'}</p>
      </div>
      <hr className="my-6 border-gray-300" />
      {/* Sections */}
    </div>
  );
};
