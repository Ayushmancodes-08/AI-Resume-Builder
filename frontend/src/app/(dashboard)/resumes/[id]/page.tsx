'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Save, Download, Eye, Layout, Wand2, Plus, Trash2, ArrowLeft, Loader2, Check } from 'lucide-react';
import { AIAssistant } from '@/components/builder/ai-assistant';
import { api } from '@/lib/api';

export default function ResumeBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [templateId, setTemplateId] = useState('ats');
  const [isImprovingSummary, setIsImprovingSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 4 Mock Profiles with fully populated dynamic random data (purging Siddharth's real data)
  const MOCK_PROFILES: Record<string, any> = {
    software: {
      personalInfo: {
        name: 'Alex Rivers',
        title: 'Senior Full-Stack Engineer',
        email: 'alex.rivers@email.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        github: 'github.com/alexrivers',
        linkedin: 'linkedin.com/in/alexrivers'
      },
      summary: 'Innovative Full-Stack Engineer with 5+ years of experience designing and building scalable web applications. Expert in React, Node.js, and cloud architecture. Passionate about clean code and developer experience.',
      education: [
        {
          institution: 'Stanford University',
          degree: 'B.S. in Computer Science',
          startDate: '2018',
          endDate: '2022',
          gpa: '3.9'
        }
      ],
      coursework: ['Distributed Systems', 'Database Internals', 'Machine Learning', 'Web Engineering'],
      projects: [
        {
          title: 'CloudSync CLI',
          technologies: 'Go, AWS, CLI',
          description: 'Developed a Go-based command line utility for secure, concurrent backups across multi-cloud endpoints.'
        },
        {
          title: 'DevFlow Dashboard',
          technologies: 'React, TypeScript, Node.js',
          description: 'Built a real-time developer productivity dashboard aggregating git repository metrics and deployment health.'
        }
      ],
      skills: [
        {
          category: 'Programming',
          list: ['Go', 'TypeScript', 'Python', 'Java']
        },
        {
          category: 'Frameworks & Tools',
          list: ['React', 'Next.js', 'Node.js', 'Docker', 'Kubernetes']
        }
      ]
    },
    marketing: {
      personalInfo: {
        name: 'Sarah Jenkins',
        title: 'Growth Marketing Manager',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 024-8765',
        location: 'New York, NY',
        github: '',
        linkedin: 'linkedin.com/in/sarahj-marketing'
      },
      summary: 'Data-driven Growth Marketing Manager with a track record of scaling SaaS user acquisition by up to 150%. Specialist in search engine optimization (SEO), conversion rate optimization (CRO), and paid media management.',
      education: [
        {
          institution: 'NYU Stern School of Business',
          degree: 'B.S. in Marketing',
          startDate: '2019',
          endDate: '2023',
          gpa: '3.8'
        }
      ],
      coursework: ['Digital Marketing Analytics', 'Consumer Behavior', 'Brand Strategy', 'Market Research'],
      projects: [
        {
          title: 'Organic Search Strategy',
          technologies: 'SEO, SEMrush, Content',
          description: 'Spearheaded organic SEO campaigns that grew monthly active blog traffic from 10k to over 100k readers within 9 months.'
        },
        {
          title: 'Lifecycle Email Campaigns',
          technologies: 'HubSpot, Copywriting',
          description: 'Redesigned automated lifecycle email flows, increasing active customer retention and reducing user churn by 12%.'
        }
      ],
      skills: [
        {
          category: 'Core Channels',
          list: ['SEO/SEM', 'Paid Acquisition', 'Email Marketing', 'A/B Testing']
        },
        {
          category: 'Platforms & Analytics',
          list: ['Google Analytics', 'HubSpot', 'Mixpanel', 'Figma']
        }
      ]
    },
    data: {
      personalInfo: {
        name: 'Dr. Liam Chen',
        title: 'Lead Data Scientist',
        email: 'liam.chen@email.com',
        phone: '+1 (555) 032-9901',
        location: 'Boston, MA',
        github: 'github.com/liamchen-data',
        linkedin: 'linkedin.com/in/liamchen-ds'
      },
      summary: 'Lead Data Scientist with 4+ years of industry experience and a Ph.D. in Operations Research. Specialized in building predictive machine learning models, natural language processing pipelines, and data analytics architectures.',
      education: [
        {
          institution: 'MIT',
          degree: 'Ph.D. in Operations Research',
          startDate: '2019',
          endDate: '2024',
          gpa: 'Pass'
        },
        {
          institution: 'Harvard University',
          degree: 'B.S. in Applied Mathematics',
          startDate: '2015',
          endDate: '2019',
          gpa: '4.0'
        }
      ],
      coursework: ['Stochastic Modeling', 'Deep Learning Systems', 'Statistical Inference', 'Large-Scale Optimization'],
      projects: [
        {
          title: 'Demand Forecasting Engine',
          technologies: 'Python, PyTorch, SQL',
          description: 'Engineered a time-series model forecasting daily inventory demand, reducing holding costs by $200,000 annually.'
        },
        {
          title: 'Clinical Text Processing Pipeline',
          technologies: 'NLP, Transformers, AWS',
          description: 'Built a clinical documentation parser classifying medical records with over 95% accuracy using transformer models.'
        }
      ],
      skills: [
        {
          category: 'Languages & Tools',
          list: ['Python', 'R', 'SQL', 'Git', 'Docker']
        },
        {
          category: 'Libraries & Frameworks',
          list: ['PyTorch', 'Scikit-Learn', 'Pandas', 'NumPy', 'MLflow']
        }
      ]
    },
    design: {
      personalInfo: {
        name: 'Emma Watson',
        title: 'Lead Product Designer',
        email: 'emma.design@email.com',
        phone: '+1 (555) 041-3322',
        location: 'Austin, TX',
        github: '',
        linkedin: 'linkedin.com/in/emmawatson-design'
      },
      summary: 'Creative Product Designer with a passion for designing accessible, intuitive digital interfaces. Experienced in establishing design systems, conducting user testing research, and translating complex user flows into clean UI mockups.',
      education: [
        {
          institution: 'University of Texas at Austin',
          degree: 'B.F.A. in Design',
          startDate: '2020',
          endDate: '2024',
          gpa: '3.7'
        }
      ],
      coursework: ['Human-Computer Interaction', 'Information Architecture', 'Interaction Design', 'User Research Methods'],
      projects: [
        {
          title: 'EcoCart Mobile App Design',
          technologies: 'Figma, Wireframing, UX Research',
          description: 'Completed user testing and visual layout iterations for a sustainable shopping assistant app, leading to a 30% increase in user retention.'
        },
        {
          title: 'Prism Enterprise Design System',
          technologies: 'Figma, Component Tokens',
          description: 'Designed and deployed a comprehensive cross-platform Figma library containing over 500 components, speeding up dev implementation times by 40%.'
        }
      ],
      skills: [
        {
          category: 'Design Disciplines',
          list: ['UI/UX Design', 'Interaction Design', 'User Research', 'Information Architecture']
        },
        {
          category: 'Design & Dev Tools',
          list: ['Figma', 'Adobe Creative Cloud', 'HTML/CSS', 'Webflow']
        }
      ]
    }
  };

  const [resumeData, setResumeData] = useState<any>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: ''
    },
    summary: '',
    education: [],
    coursework: [],
    projects: [],
    skills: [],
    hiddenSections: {}
  });

  const loadMockProfile = (type: string) => {
    if (type === 'clear') {
      setResumeData({
        personalInfo: { name: '', title: '', email: '', phone: '', location: '', github: '', linkedin: '' },
        summary: '',
        education: [],
        coursework: [],
        projects: [],
        skills: [],
        hiddenSections: {}
      });
    } else if (MOCK_PROFILES[type]) {
      setResumeData({
        ...MOCK_PROFILES[type],
        hiddenSections: {}
      });
    }
  };

  // State update handlers
  const handlePersonalInfoChange = (key: string, value: string) => {
    setResumeData((prev: any) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [key]: value
      }
    }));
  };

  const handleSummaryChange = (value: string) => {
    setResumeData((prev: any) => ({
      ...prev,
      summary: value
    }));
  };

  const handleAIImproveSummary = async () => {
    if (!resumeData.summary) return;
    setIsImprovingSummary(true);
    try {
      const response = await api.post('/ai/improve-summary', {
        summary: resumeData.summary,
        role: resumeData.personalInfo.title || 'Student'
      });
      if (response.data.improved_summary) {
        handleSummaryChange(response.data.improved_summary);
      }
    } catch (error) {
      console.error('Failed to improve summary:', error);
    } finally {
      setIsImprovingSummary(false);
    }
  };

  const handleEducationChange = (index: number, key: string, value: string) => {
    const updated = [...resumeData.education];
    updated[index] = { ...updated[index], [key]: value };
    setResumeData((prev: any) => ({ ...prev, education: updated }));
  };

  const addEducation = () => {
    setResumeData((prev: any) => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', startDate: '', endDate: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    const updated = resumeData.education.filter((_: any, i: number) => i !== index);
    setResumeData((prev: any) => ({ ...prev, education: updated }));
  };

  const handleCourseworkChange = (value: string) => {
    const list = value.split(',').map(item => item.trim());
    setResumeData((prev: any) => ({ ...prev, coursework: list }));
  };

  const handleProjectChange = (index: number, key: string, value: string) => {
    const updated = [...resumeData.projects];
    updated[index] = { ...updated[index], [key]: value };
    setResumeData((prev: any) => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    setResumeData((prev: any) => ({
      ...prev,
      projects: [...prev.projects, { title: '', technologies: '', description: '' }]
    }));
  };

  const removeProject = (index: number) => {
    const updated = resumeData.projects.filter((_: any, i: number) => i !== index);
    setResumeData((prev: any) => ({ ...prev, projects: updated }));
  };

  const handleSkillChange = (index: number, key: string, value: any) => {
    const updated = [...resumeData.skills];
    if (key === 'list') {
      updated[index] = { ...updated[index], list: value.split(',').map((s: string) => s.trim()) };
    } else {
      updated[index] = { ...updated[index], category: value };
    }
    setResumeData((prev: any) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    setResumeData((prev: any) => ({
      ...prev,
      skills: [...prev.skills, { category: '', list: [] }]
    }));
  };

  const removeSkill = (index: number) => {
    const updated = resumeData.skills.filter((_: any, i: number) => i !== index);
    setResumeData((prev: any) => ({ ...prev, skills: updated }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save to backend (which is decoupled from authentications)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    // Triggers direct browser printing for perfect A4 output format
    window.print();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 -m-4 md:-m-8 print:p-0 print:m-0 print:h-auto print:overflow-visible">
      {/* Left Pane: Editor (hidden during print) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white border-r print:hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {resumeData.personalInfo.name || 'Resume'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                onChange={(e) => {
                  loadMockProfile(e.target.value);
                  e.target.value = ""; // Reset dropdown selection
                }}
                defaultValue=""
                className="pl-3 pr-8 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-gray-700"
              >
                <option value="" disabled>Load Demo Profile...</option>
                <option value="software">Software Engineer</option>
                <option value="marketing">Growth Marketer</option>
                <option value="data">Data Scientist</option>
                <option value="design">Product Designer</option>
                <option value="clear">❌ Clear All Fields</option>
              </select>
              <Plus className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-gray-700"
              >
                <option value="ats">LaTeX / ATS (Best Choice)</option>
                <option value="modern">Modern Template</option>
                <option value="corporate">Corporate Template</option>
                <option value="minimal">Minimal Template</option>
                <option value="developer">Developer Template</option>
              </select>
              <Layout className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-gray-400" />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Section Navigation */}
          <div className="w-40 border-r bg-gray-50 p-2 space-y-1 overflow-y-auto flex-shrink-0">
            {['personal', 'summary', 'education', 'coursework', 'projects', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md capitalize transition-all duration-150 ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-150'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Area & AI Assistant */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold capitalize text-gray-900">
                  {activeTab} Information
                </h2>
                {activeTab !== 'personal' && (
                  <button
                    onClick={() => {
                      setResumeData((prev: any) => ({
                        ...prev,
                        hiddenSections: {
                          ...prev.hiddenSections,
                          [activeTab]: !prev.hiddenSections?.[activeTab]
                        }
                      }));
                    }}
                    className={`flex items-center text-xs font-semibold px-2 py-1 rounded transition-colors ${
                      resumeData.hiddenSections?.[activeTab]
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {resumeData.hiddenSections?.[activeTab] ? (
                      <>👀 Include Section</>
                    ) : (
                      <>❌ Exclude Section</>
                    )}
                  </button>
                )}
              </div>

              {resumeData.hiddenSections?.[activeTab] && (
                <div className="p-3 mb-4 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                  ⚠️ This section is currently hidden from your resume preview. Click "Include Section" above to restore it.
                </div>
              )}

              {/* Personal Info Form */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.name || ''}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        />
                        {resumeData.personalInfo.name && (
                          <button
                            onClick={() => handlePersonalInfoChange('name', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Job Title / Tagline</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.title || ''}
                          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                        />
                        {resumeData.personalInfo.title && (
                          <button
                            onClick={() => handlePersonalInfoChange('title', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.email || ''}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        />
                        {resumeData.personalInfo.email && (
                          <button
                            onClick={() => handlePersonalInfoChange('email', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.phone || ''}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        />
                        {resumeData.personalInfo.phone && (
                          <button
                            onClick={() => handlePersonalInfoChange('phone', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        value={resumeData.personalInfo.location || ''}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      />
                      {resumeData.personalInfo.location && (
                        <button
                          onClick={() => handlePersonalInfoChange('location', '')}
                          className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                          title="Clear Field"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">GitHub</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.github || ''}
                          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        />
                        {resumeData.personalInfo.github && (
                          <button
                            onClick={() => handlePersonalInfoChange('github', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">LinkedIn</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2.5 pr-8 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          value={resumeData.personalInfo.linkedin || ''}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        />
                        {resumeData.personalInfo.linkedin && (
                          <button
                            onClick={() => handlePersonalInfoChange('linkedin', '')}
                            className="absolute right-2.5 top-3 text-gray-400 hover:text-red-500 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary / About Form */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-600 uppercase">Professional Summary</label>
                      <button
                        onClick={handleAIImproveSummary}
                        disabled={isImprovingSummary || !resumeData.summary}
                        className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        {isImprovingSummary ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <Wand2 className="w-3.5 h-3.5 mr-1" />
                        )}
                        AI Polish Summary
                      </button>
                    </div>
                    <textarea
                      className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      rows={8}
                      value={resumeData.summary}
                      onChange={(e) => handleSummaryChange(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Education Form */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  {resumeData.education.map((edu: any, index: number) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50/50 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeEducation(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Institution</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Degree / Certificate</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start Date</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={edu.startDate}
                            placeholder="e.g. 2022"
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End Date</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={edu.endDate}
                            placeholder="e.g. Present"
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">GPA / Score</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={edu.gpa}
                            placeholder="e.g. 5.74"
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addEducation}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50/50 font-semibold text-sm transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                  </button>
                </div>
              )}

              {/* Coursework Form */}
              {activeTab === 'coursework' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Relevant Coursework (Comma-separated)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      placeholder="e.g. Analog Electronics, Digital Design, Control Systems"
                      value={resumeData.coursework.join(', ')}
                      onChange={(e) => handleCourseworkChange(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Projects Form */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {resumeData.projects.map((proj: any, index: number) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50/50 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeProject(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Project Title</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={proj.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Technologies Used</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={proj.technologies}
                            placeholder="e.g. MATLAB, LabVIEW"
                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description / Key Outcome</label>
                        <textarea
                          className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                          rows={3}
                          value={proj.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addProject}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50/50 font-semibold text-sm transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Project / Lab Experience
                  </button>
                </div>
              )}

              {/* Skills Form */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  {resumeData.skills.map((skill: any, index: number) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50/50 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeSkill(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Skill Category</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={skill.category}
                            placeholder="e.g. Programming"
                            onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Skills (Comma-separated)</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            value={skill.list.join(', ')}
                            placeholder="e.g. C, C++, Python"
                            onChange={(e) => handleSkillChange(index, 'list', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addSkill}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50/50 font-semibold text-sm transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Category
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Pane */}
            <div className="pt-6 border-t">
              <AIAssistant resumeContent={JSON.stringify(resumeData)} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Live Preview & Print Export */}
      <div className="w-1/2 flex flex-col bg-gray-100 print:w-full print:bg-white print:p-0 overflow-y-auto">
        <div className="flex items-center justify-end p-4 border-b bg-white print:hidden">
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border shadow-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-blue-600" /> Export / Print A4 PDF
          </button>
        </div>
        
        <div className="flex-1 p-6 md:p-12 flex justify-center items-start print:p-0 print:m-0">
          {/* A4 Size Container */}
          <div className="w-full max-w-[21cm] min-h-[29.7cm] shadow-xl bg-white transition-all duration-300 print:shadow-none print:w-full print:max-w-none print:min-h-0 print:mx-0">
            <TemplateRenderer templateId={templateId} resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
