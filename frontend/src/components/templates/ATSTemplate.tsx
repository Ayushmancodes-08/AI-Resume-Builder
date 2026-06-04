import React from 'react';
import { TemplateProps } from './ModernTemplate';

export const ATSTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    projects = [],
    skills = [],
  } = resumeData || {};

  return (
    <div className="p-8 md:p-12 bg-white text-gray-900 font-serif text-[10pt] leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto box-border">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase mb-1">
          {personalInfo.name || 'Siddharth Sankar Dhall'}
        </h1>
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

      {/* About Me / Summary */}
      {(summary || personalInfo.title) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            About Me
          </h2>
          <p className="text-justify text-gray-800">
            {summary ||
              `Second-year Electronics and Telecommunication Engineering student with a strong foundation in circuit theory, digital electronics, and signal processing. Familiar with tools like MATLAB and LabVIEW through academic coursework and lab experiments. Seeking practical exposure through internships to enhance technical skills.`}
          </p>
        </div>
      )}

      {/* Education */}
      {((education && education.length > 0) || !resumeData) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {education.length > 0 ? (
              education.map((edu: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold">{edu.institution || 'Institution'}</span>
                    {edu.degree && <span className="italic block text-gray-700">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>}
                    {edu.details && <p className="text-gray-600 text-xs mt-0.5">{edu.details}</p>}
                  </div>
                  <div className="text-right text-gray-700 font-sans text-xs">
                    <div>{edu.startDate || '2024'} – {edu.endDate || 'Present'}</div>
                    {edu.gpa && <div className="font-semibold mt-0.5">CGPA/Grade: {edu.gpa}</div>}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold">Parala Maharaja Engineering College</span>
                    <span className="italic block text-gray-700">B.Tech in Electronics and Telecommunication</span>
                  </div>
                  <div className="text-right text-gray-700 font-sans text-xs">
                    <div>2024 – Present</div>
                    <div className="font-semibold mt-0.5">CGPA: 5.74</div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold">DAV Public School</span>
                    <span className="italic block text-gray-700">Intermediate</span>
                  </div>
                  <div className="text-right text-gray-700 font-sans text-xs">
                    <div>2022 – 2024</div>
                    <div className="font-semibold mt-0.5">Percentage: 59%</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Relevant Coursework */}
      <div className="mb-6">
        <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
          Relevant Coursework
        </h2>
        <ul className="list-disc list-inside text-gray-800 grid grid-cols-2 gap-1 pl-2">
          {resumeData?.coursework && resumeData.coursework.length > 0 ? (
            resumeData.coursework.map((item: string, index: number) => (
              <li key={index} className="text-xs">{item}</li>
            ))
          ) : (
            <>
              <li className="text-xs">Analog Electronics</li>
              <li className="text-xs">Digital Systems Design</li>
              <li className="text-xs">Communication Systems</li>
              <li className="text-xs">Control Systems</li>
            </>
          )}
        </ul>
      </div>

      {/* Projects & Lab Experience */}
      {((projects && projects.length > 0) || !resumeData) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
            Projects & Lab Experience
          </h2>
          <div className="space-y-3 pl-2">
            {projects.length > 0 ? (
              projects.map((proj: any, index: number) => (
                <div key={index} className="text-gray-800">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{proj.title || 'Project Title'}</span>
                    {proj.technologies && <span className="text-[9pt] text-gray-600 font-mono">[{proj.technologies}]</span>}
                  </div>
                  <p className="text-justify text-xs mt-1">{proj.description}</p>
                </div>
              ))
            ) : (
              <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-gray-800">
                <li>Performed AM modulation and demodulation experiments using LabVIEW.</li>
                <li>Designed and analyzed digital circuits including Half Adder and Full Adder.</li>
                <li>Worked on MATLAB simulations for basic signal processing concepts.</li>
                <li>Gained hands-on experience with electronic components during laboratory sessions.</li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-sm font-bold tracking-wider uppercase border-b border-gray-900 pb-1 mb-2 font-sans">
          Skills
        </h2>
        <div className="space-y-1 pl-2 text-xs text-gray-800">
          {skills.length > 0 ? (
            skills.map((skillObj: any, index: number) => (
              <div key={index}>
                <strong className="font-sans">{skillObj.category || 'Skill'}: </strong>
                <span>{Array.isArray(skillObj.list) ? skillObj.list.join(', ') : skillObj.list || ''}</span>
              </div>
            ))
          ) : (
            <>
              <div>
                <strong>Programming: </strong>C, C++, Python (Basic)
              </div>
              <div>
                <strong>Tools & Software: </strong>MATLAB, LabVIEW, AutoCAD
              </div>
              <div>
                <strong>Core Skills: </strong>Circuit Design, Digital Logic Design
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
