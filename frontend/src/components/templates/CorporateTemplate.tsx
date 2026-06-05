import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const CorporateTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
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

  // Render contacts as centered list with pipe separators
  const contactItems = [];
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.email) contactItems.push(personalInfo.email);
  if (personalInfo.location) contactItems.push(personalInfo.location);
  if (personalInfo.github) contactItems.push(personalInfo.github);
  if (personalInfo.linkedin) contactItems.push(personalInfo.linkedin);

  return (
    <div className="p-10 md:p-12 bg-white text-black font-serif leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border border-t-8 border-slate-800">
      {/* Header */}
      {showPersonal && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900 mb-1">
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2 font-sans">
              {personalInfo.title}
            </p>
          )}
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-700 mt-2 font-sans tracking-wide">
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="mx-2 text-slate-400">|</span>}
                  {item.includes('@') ? (
                    <a href={`mailto:${item}`} className="hover:underline text-slate-950 font-medium">
                      {item}
                    </a>
                  ) : (
                    <span>{item}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2 font-sans">
            Professional Profile
          </h2>
          <p className="text-justify text-xs text-slate-800 whitespace-pre-line leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience / Projects */}
      {showProjects && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2 font-sans">
            Key Projects & Experience
          </h2>
          <div className="space-y-4">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="text-xs text-slate-800">
                <div className="flex justify-between items-baseline font-sans font-bold text-slate-900 mb-1">
                  <span>{proj.title || 'Project Title'}</span>
                  {proj.technologies && <span className="text-[10px] text-slate-500 font-mono">[{proj.technologies}]</span>}
                </div>
                <p className="text-justify whitespace-pre-line leading-relaxed pl-2 border-l border-slate-200">
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2 font-sans">
            Education History
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index} className="flex justify-between items-start text-xs gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 font-sans">{edu.institution || 'Institution'}</h3>
                  <p className="text-slate-700 italic mt-0.5">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </p>
                  {edu.details && <p className="text-slate-650 mt-1 pl-2 border-l border-slate-200">{edu.details}</p>}
                </div>
                <div className="text-right text-slate-600 font-sans whitespace-nowrap">
                  <div>{edu.startDate || ''} – {edu.endDate || ''}</div>
                  {edu.gpa && <div className="font-semibold text-slate-800 mt-1">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coursework */}
      {showCoursework && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2 font-sans">
            Academic Focus & Coursework
          </h2>
          <div className="text-xs text-slate-800 leading-relaxed font-sans pl-2">
            {coursework.join(', ')}
          </div>
        </div>
      )}

      {/* Skills */}
      {showSkills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2 font-sans">
            Professional Skills
          </h2>
          <div className="space-y-1.5 pl-2 text-xs text-slate-800">
            {skills.map((skillObj: any, index: number) => (
              <div key={index} className="flex flex-wrap gap-x-1">
                <strong className="font-sans text-slate-900">{skillObj.category || 'Skill'}: </strong>
                <span>{Array.isArray(skillObj.list) ? skillObj.list.join(', ') : skillObj.list || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
