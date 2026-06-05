import React from 'react';
export interface TemplateProps {
  resumeData: any;
  theme?: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
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
    <div className="p-8 md:p-12 bg-white text-slate-800 font-sans leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border">
      {/* Header */}
      {showPersonal && (
        <div className="border-b-2 border-blue-500 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {personalInfo.name || 'Your Name'}
              </h1>
              {personalInfo.title && (
                <p className="text-lg font-medium text-blue-600 mt-1">{personalInfo.title}</p>
              )}
            </div>
            <div className="flex flex-col text-xs text-slate-600 gap-1 md:text-right font-light">
              {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
              {personalInfo.email && (
                <span>
                  ✉️{' '}
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline text-blue-500">
                    {personalInfo.email}
                  </a>
                </span>
              )}
              {personalInfo.location && <span>📍 {personalInfo.location}</span>}
              {personalInfo.github && <span>🖥️ {personalInfo.github}</span>}
              {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Summary</h2>
          <div className="p-4 bg-slate-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {/* Grid for Skills and Coursework */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* Left/Main Column: Projects and Education */}
        <div className="md:col-span-8 space-y-8">
          {/* Projects */}
          {showProjects && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
                Key Projects & Experience
              </h2>
              <div className="space-y-6">
                {projects.map((proj: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{proj.title || 'Project Title'}</h3>
                      {proj.technologies && (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {proj.technologies}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-650 text-justify whitespace-pre-line leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {showEducation && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
                Education History
              </h2>
              <div className="space-y-4">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="flex justify-between items-start text-xs gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{edu.institution || 'Institution'}</h3>
                      <p className="text-slate-600 italic mt-0.5">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </p>
                      {edu.details && <p className="text-slate-500 mt-1 text-[11px]">{edu.details}</p>}
                    </div>
                    <div className="text-right text-slate-500 whitespace-nowrap">
                      <div>{edu.startDate || ''} – {edu.endDate || ''}</div>
                      {edu.gpa && <div className="font-semibold text-slate-700 mt-1">GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Skills and Coursework */}
        <div className="md:col-span-4 space-y-8">
          {/* Skills */}
          {showSkills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
                Core Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skillObj: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      {skillObj.category || 'Skill'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(skillObj.list) ? skillObj.list : (skillObj.list || '').split(',').map((s: string) => s.trim()).filter(Boolean)).map((skill: string, skillIdx: number) => (
                        <span key={skillIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coursework */}
          {showCoursework && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
                Education Focus
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {coursework.map((item: string, index: number) => (
                  <span key={index} className="text-[10px] bg-blue-50/70 text-blue-800 px-2.5 py-1 rounded font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
