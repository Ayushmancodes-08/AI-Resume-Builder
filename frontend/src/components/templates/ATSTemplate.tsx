import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const ATSTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    coursework = [],
    projects = [],
    skills = [],
    hiddenSections = {},
  } = resumeData || {};

  const showPersonal = !hiddenSections.personal;
  const showSummary = !hiddenSections.summary && summary;
  const showEducation = !hiddenSections.education && education && education.length > 0;
  const showCoursework = !hiddenSections.coursework && coursework && coursework.length > 0;
  const showProjects = !hiddenSections.projects && projects && projects.length > 0;
  const showSkills = !hiddenSections.skills && skills && skills.length > 0;

  return (
    <div className="p-8 md:p-12 bg-white text-gray-900 font-serif text-[10pt] leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border">
      {/* Header */}
      {showPersonal && (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase mb-1">
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-sm font-semibold tracking-wider text-gray-700 uppercase mb-2 font-sans">
              {personalInfo.title}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-700 mt-2 font-sans">
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.email && (
              <span>
                ✉️{' '}
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              </span>
            )}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.github && <span>🖥️ {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
        </div>
      )}

      {/* About Me / Summary */}
      {showSummary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            About Me
          </h2>
          <p className="text-justify text-gray-800 whitespace-pre-line">
            {summary}
          </p>
        </div>
      )}

      {/* Education */}
      {showEducation && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{edu.institution || 'Institution'}</span>
                  {edu.degree && (
                    <span className="italic block text-gray-700">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                  )}
                  {edu.details && <p className="text-gray-600 text-xs mt-0.5">{edu.details}</p>}
                </div>
                <div className="text-right text-gray-700 font-sans text-xs">
                  <div>{edu.startDate || ''} – {edu.endDate || ''}</div>
                  {edu.gpa && <div className="font-semibold mt-0.5">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relevant Coursework */}
      {showCoursework && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Relevant Coursework
          </h2>
          <ul className="list-disc list-inside text-gray-800 grid grid-cols-2 gap-1 pl-2">
            {coursework.map((item: string, index: number) => (
              <li key={index} className="text-xs">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects & Lab Experience */}
      {showProjects && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Projects & Lab Experience
          </h2>
          <div className="space-y-3 pl-2">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="text-gray-800">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs">{proj.title || 'Project Title'}</span>
                  {proj.technologies && <span className="text-[9pt] text-gray-600 font-mono">[{proj.technologies}]</span>}
                </div>
                <p className="text-justify text-xs mt-1 whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {showSkills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Skills
          </h2>
          <div className="space-y-1 pl-2 text-xs text-gray-800">
            {skills.map((skillObj: any, index: number) => (
              <div key={index}>
                <strong className="font-sans">{skillObj.category || 'Skill'}: </strong>
                <span>{Array.isArray(skillObj.list) ? skillObj.list.join(', ') : skillObj.list || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
