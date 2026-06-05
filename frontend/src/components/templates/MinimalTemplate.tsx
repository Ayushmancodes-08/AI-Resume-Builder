import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const MinimalTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
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
    <div className="p-8 md:p-12 bg-white text-zinc-800 font-sans text-xs leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border">
      {/* Header */}
      {showPersonal && (
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <h1 className="text-2xl font-light tracking-wide text-zinc-950">
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-zinc-400 font-medium tracking-wide mt-1 text-[11px] uppercase">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 mt-3 font-mono text-[10px]">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:text-zinc-900 underline">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <h2 className="font-mono uppercase text-zinc-400 font-bold text-[10px] tracking-wider">Summary</h2>
            <div className="md:col-span-3">
              <p className="text-zinc-700 whitespace-pre-line text-[11px] leading-relaxed text-justify">{summary}</p>
            </div>
          </div>
          <hr className="border-zinc-100 my-6" />
        </div>
      )}

      {/* Projects */}
      {showProjects && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <h2 className="font-mono uppercase text-zinc-400 font-bold text-[10px] tracking-wider">Projects</h2>
            <div className="md:col-span-3 space-y-4">
              {projects.map((proj: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-zinc-950 text-[11px]">{proj.title || 'Project Title'}</span>
                    {proj.technologies && <span className="font-mono text-[9px] text-zinc-400">({proj.technologies})</span>}
                  </div>
                  <p className="text-zinc-600 whitespace-pre-line leading-relaxed text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
          <hr className="border-zinc-100 my-6" />
        </div>
      )}

      {/* Education */}
      {showEducation && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <h2 className="font-mono uppercase text-zinc-400 font-bold text-[10px] tracking-wider">Education</h2>
            <div className="md:col-span-3 space-y-4">
              {education.map((edu: any, index: number) => (
                <div key={index} className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-zinc-950 text-[11px]">{edu.institution || 'Institution'}</span>
                    <span className="block text-zinc-500 italic">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    {edu.details && <p className="text-zinc-500 mt-1 text-[10px]">{edu.details}</p>}
                  </div>
                  <div className="text-right text-zinc-400 font-mono text-[10px] whitespace-nowrap">
                    <div>{edu.startDate || ''} – {edu.endDate || ''}</div>
                    {edu.gpa && <div className="text-zinc-600 font-sans font-semibold mt-0.5">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <hr className="border-zinc-100 my-6" />
        </div>
      )}

      {/* Coursework */}
      {showCoursework && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <h2 className="font-mono uppercase text-zinc-400 font-bold text-[10px] tracking-wider">Coursework</h2>
            <div className="md:col-span-3 text-zinc-700 leading-relaxed font-mono text-[10px]">
              {coursework.join('  •  ')}
            </div>
          </div>
          <hr className="border-zinc-100 my-6" />
        </div>
      )}

      {/* Skills */}
      {showSkills && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <h2 className="font-mono uppercase text-zinc-400 font-bold text-[10px] tracking-wider">Skills</h2>
            <div className="md:col-span-3 space-y-2">
              {skills.map((skillObj: any, index: number) => (
                <div key={index} className="flex gap-x-2 text-[11px]">
                  <span className="font-semibold text-zinc-950 font-mono text-[10px] w-24 flex-shrink-0 uppercase tracking-wide">
                    {skillObj.category || 'Skill'}:
                  </span>
                  <span className="text-zinc-750">{Array.isArray(skillObj.list) ? skillObj.list.join(', ') : skillObj.list || ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
