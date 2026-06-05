import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const DeveloperTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
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
    <div className="p-8 md:p-12 bg-slate-50 text-slate-800 font-mono text-xs leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border border-l-4 border-emerald-500">
      {/* Header */}
      {showPersonal && (
        <div className="border-b border-slate-200 pb-4 mb-6">
          <span className="text-slate-400 font-light">// CONTACT CARD</span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {`const name = "${personalInfo.name || 'Your Name'}";`}
          </h1>
          {personalInfo.title && (
            <p className="text-emerald-600 font-semibold">{`const role = "${personalInfo.title}";`}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5 text-slate-500 mt-3 text-[10px]">
            {personalInfo.phone && <div>{`phone:   "${personalInfo.phone}",`}</div>}
            {personalInfo.email && (
              <div>
                {`email:   "`}
                <a href={`mailto:${personalInfo.email}`} className="hover:text-emerald-600 underline">
                  {personalInfo.email}
                </a>
                {`",`}
              </div>
            )}
            {personalInfo.location && <div>{`loc:     "${personalInfo.location}",`}</div>}
            {personalInfo.github && <div>{`github:  "${personalInfo.github}",`}</div>}
            {personalInfo.linkedin && <div>{`linked:  "${personalInfo.linkedin}",`}</div>}
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="mb-6 bg-slate-100/60 p-4 border-l border-slate-300 rounded">
          <span className="text-slate-400 font-light block mb-1">/** ABOUT_ME **/</span>
          <p className="text-slate-700 whitespace-pre-line text-justify">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {showSkills && (
        <div className="mb-6">
          <span className="text-slate-450 font-light block mb-2"># SKILLS</span>
          <div className="space-y-2 pl-3">
            {skills.map((skillObj: any, index: number) => {
              const skillList = Array.isArray(skillObj.list) ? skillObj.list : (skillObj.list || '').split(',').map((s: string) => s.trim()).filter(Boolean);
              return (
                <div key={index} className="text-[11px]">
                  <span className="text-blue-600 font-semibold">{`const ${skillObj.category?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'skills'} = `}</span>
                  <span className="text-slate-700">{`[`}</span>
                  <span className="text-emerald-700 font-medium">{skillList.map((s: string) => `"${s}"`).join(', ')}</span>
                  <span className="text-slate-700">{`];`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {showProjects && (
        <div className="mb-6">
          <span className="text-slate-450 font-light block mb-2"># PROJECTS</span>
          <div className="space-y-4 pl-3">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-900">{`### ${proj.title || 'Project Title'}`}</span>
                  {proj.technologies && <span className="text-[9px] text-slate-500 font-semibold">{`/* [${proj.technologies}] */`}</span>}
                </div>
                <p className="text-slate-650 pl-4 border-l border-slate-200 text-justify whitespace-pre-line">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {showEducation && (
        <div className="mb-6">
          <span className="text-slate-450 font-light block mb-2"># EDUCATION</span>
          <div className="space-y-3 pl-3">
            {education.map((edu: any, index: number) => (
              <div key={index} className="text-slate-800 text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.institution || 'Institution'}</span>
                  <span className="text-slate-400 font-light">{`// ${edu.startDate || ''} - ${edu.endDate || ''}`}</span>
                </div>
                <div className="pl-4 mt-0.5 text-slate-600">
                  {`degree: "${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}"`}
                  {edu.gpa && <span className="text-emerald-700 font-medium">{`, gpa: "${edu.gpa}"`}</span>}
                </div>
                {edu.details && <p className="pl-4 text-slate-500 mt-1 text-[10px]">{`/* ${edu.details} */`}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coursework */}
      {showCoursework && (
        <div className="mb-6">
          <span className="text-slate-450 font-light block mb-2"># COURSEWORK</span>
          <div className="pl-3">
            <span className="text-blue-600">{`const target_courses = `}</span>
            <span className="text-slate-700">{`[`}</span>
            <span className="text-emerald-700">{coursework.map((c: string) => `"${c}"`).join(', ')}</span>
            <span className="text-slate-700">{`];`}</span>
          </div>
        </div>
      )}
    </div>
  );
};
