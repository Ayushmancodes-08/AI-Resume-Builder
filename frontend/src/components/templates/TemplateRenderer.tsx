import React from 'react';
import { ModernTemplate } from './ModernTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { ATSTemplate } from './ATSTemplate';

interface TemplateRendererProps {
  templateId: string;
  resumeData: any;
}

const templates: Record<string, React.FC<any>> = {
  modern: ModernTemplate,
  corporate: CorporateTemplate,
  minimal: MinimalTemplate,
  developer: DeveloperTemplate,
  ats: ATSTemplate,
};

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, resumeData }) => {
  const SelectedTemplate = templates[templateId] || ModernTemplate;

  return (
    <div className="resume-preview-container shadow-2xl rounded-sm overflow-hidden bg-white w-full h-full">
      <SelectedTemplate resumeData={resumeData} />
    </div>
  );
};
