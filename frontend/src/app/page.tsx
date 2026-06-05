'use client';

import React, { useState, useRef } from 'react';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Save, Download, Layout, Wand2, Plus, Trash2, Loader2, Check, Upload, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('personal');
  const [templateId, setTemplateId] = useState('ats');
  const [isImprovingSummary, setIsImprovingSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [rawResumeText, setRawResumeText] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // ATS Optimization States
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Default resume state (starts empty/clean)
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
        role: resumeData.personalInfo.title || 'Professional'
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

  const handleAIImproveProject = async (index: number) => {
    const proj = resumeData.projects[index];
    if (!proj.description) return;
    
    try {
      const response = await api.post('/ai/improve-experience', {
        experience_text: proj.description
      });
      if (response.data.improved_experience) {
        handleProjectChange(index, 'description', response.data.improved_experience);
      }
    } catch (e) {
      console.error(e);
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
    const list = value.split(',').map(item => item.trim()).filter(Boolean);
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
      updated[index] = { ...updated[index], list: value.split(',').map((s: string) => s.trim()).filter(Boolean) };
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
      localStorage.setItem('saved_resume_data', JSON.stringify(resumeData));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Upload/Import Resume Handlers
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (parsed.personalInfo) {
            setResumeData(parsed);
            setIsUploading(false);
            return;
          }
          throw new Error('Invalid JSON resume schema.');
        }

        const response = await api.post('/ai/parse-resume', { text });
        setResumeData(response.data);
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse resume file.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleRawTextImport = async () => {
    if (!rawResumeText.trim()) return;
    setIsParsingText(true);
    setImportError(null);
    try {
      const response = await api.post('/ai/parse-resume', { text: rawResumeText });
      setResumeData(response.data);
      setShowImportDialog(false);
      setRawResumeText('');
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse resume text.');
    } finally {
      setIsParsingText(false);
    }
  };

  const handleAnalyzeATS = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await api.post('/ai/optimize-ats', {
        resume_content: JSON.stringify(resumeData),
        job_description: jobDescription
      });
      setAtsResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060a13] text-[#e2e8f0] font-sans print:p-0 print:m-0 print:h-auto print:overflow-visible">
      {/* Left Pane: Glassmorphic Editor */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#0b1220]/90 border-r border-white/5 print:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0e1627]/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#34d399] text-lg tracking-wide">
              Stitch AI Resume Builder
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Upload/Import buttons */}
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-emerald-400" />
              ) : (
                <Upload className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              )}
              Upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.txt"
              className="hidden"
            />

            <button
              onClick={() => setShowImportDialog(true)}
              className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Import Text
            </button>

            <div className="relative">
              <select
                onChange={(e) => {
                  loadMockProfile(e.target.value);
                  e.target.value = ""; // Reset dropdown selection
                }}
                defaultValue=""
                className="pl-3 pr-8 py-1.5 text-sm border border-white/10 rounded-lg bg-[#0d1628] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium text-gray-200"
              >
                <option value="" disabled>Load Demo Profile...</option>
                <option value="software">Software Engineer</option>
                <option value="marketing">Growth Marketer</option>
                <option value="data">Data Scientist</option>
                <option value="design">Product Designer</option>
                <option value="clear">❌ Clear All Fields</option>
              </select>
              <Plus className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-emerald-450" />
            </div>

            <div className="relative">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-sm border border-white/10 rounded-lg bg-[#0d1628] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium"
              >
                <option value="ats">LaTeX / ATS (100% Match)</option>
                <option value="modern">Modern Template</option>
                <option value="corporate">Corporate Template</option>
                <option value="minimal">Minimal Template</option>
                <option value="developer">Developer Template</option>
              </select>
              <Layout className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-gray-455" />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              {isSaving ? 'Saving' : saveSuccess ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor Tabs & Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Section Navigation */}
          <div className="w-36 border-r border-white/5 bg-[#080d17]/85 p-2 space-y-1 overflow-y-auto flex-shrink-0">
            {['personal', 'summary', 'education', 'coursework', 'projects', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg capitalize tracking-wide transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-500/20 text-emerald-300 border-l-2 border-emerald-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-[#0b1220] to-[#060a12]">
            {importError && (
              <div className="p-3.5 text-sm text-red-300 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
                <p>{importError}</p>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h2 className="text-md font-bold tracking-wide capitalize text-white">
                  {activeTab} Settings
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
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
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
                <div className="p-3.5 mb-4 text-xs bg-amber-950/40 border border-amber-900/60 text-amber-300 rounded-xl">
                  ⚠️ This section is currently hidden from your resume preview. Click "Include Section" above to restore it.
                </div>
              )}

              {/* Personal Info Form */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.name || ''}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        />
                        {resumeData.personalInfo.name && (
                          <button
                            onClick={() => handlePersonalInfoChange('name', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tagline / Title</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tagline"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.title || ''}
                          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                        />
                        {resumeData.personalInfo.title && (
                          <button
                            onClick={() => handlePersonalInfoChange('title', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
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
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.email || ''}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        />
                        {resumeData.personalInfo.email && (
                          <button
                            onClick={() => handlePersonalInfoChange('email', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Phone"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.phone || ''}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        />
                        {resumeData.personalInfo.phone && (
                          <button
                            onClick={() => handlePersonalInfoChange('phone', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        value={resumeData.personalInfo.location || ''}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      />
                      {resumeData.personalInfo.location && (
                        <button
                          onClick={() => handlePersonalInfoChange('location', '')}
                          className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
                          title="Clear Field"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">GitHub</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.github || ''}
                          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        />
                        {resumeData.personalInfo.github && (
                          <button
                            onClick={() => handlePersonalInfoChange('github', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
                            title="Clear Field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">LinkedIn</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          className="w-full p-2.5 pr-8 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          value={resumeData.personalInfo.linkedin || ''}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        />
                        {resumeData.personalInfo.linkedin && (
                          <button
                            onClick={() => handlePersonalInfoChange('linkedin', '')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-400 text-sm font-semibold font-sans leading-none"
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
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biography</label>
                      <button
                        onClick={handleAIImproveSummary}
                        disabled={isImprovingSummary || !resumeData.summary}
                        className="flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
                      >
                        {isImprovingSummary ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <Wand2 className="w-3.5 h-3.5 mr-1" />
                        )}
                        AI Sovereign Improve
                      </button>
                    </div>
                    <textarea
                      className="w-full p-3 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      rows={6}
                      placeholder="Write summary..."
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
                    <div key={index} className="p-4 border border-white/10 rounded-xl bg-[#080d19]/80 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeEducation(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-400 hover:bg-red-955/30 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Institution</label>
                          <input
                            type="text"
                            placeholder="College/School"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Degree</label>
                          <input
                            type="text"
                            placeholder="e.g. B.Tech / High School"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={edu.startDate}
                            placeholder="e.g. 2024"
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">End Date</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={edu.endDate}
                            placeholder="e.g. Present"
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">GPA / Score</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={edu.gpa}
                            placeholder="e.g. 8.5"
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addEducation}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/5 font-semibold text-xs tracking-wider uppercase transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                  </button>
                </div>
              )}

              {/* Coursework Form */}
              {activeTab === 'coursework' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Relevant Coursework (Comma-separated)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      placeholder="e.g. Digital Logic, Control Systems"
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
                    <div key={index} className="p-4 border border-white/10 rounded-xl bg-[#080d19]/80 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeProject(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-400 hover:bg-red-955/30 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Title</label>
                          <input
                            type="text"
                            placeholder="Project Title"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={proj.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tools / Technologies</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={proj.technologies}
                            placeholder="e.g. Python, Git"
                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                          <button
                            onClick={() => handleAIImproveProject(index)}
                            className="flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                          >
                            <Wand2 className="w-3.5 h-3.5 mr-1" />
                            AI Refine Bullets
                          </button>
                        </div>
                        <textarea
                          className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          rows={3}
                          placeholder="Project details..."
                          value={proj.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addProject}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/5 font-semibold text-xs tracking-wider uppercase transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Project / Lab Experience
                  </button>
                </div>
              )}

              {/* Skills Form */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  {resumeData.skills.map((skill: any, index: number) => (
                    <div key={index} className="p-4 border border-white/10 rounded-xl bg-[#080d19]/80 relative space-y-4 shadow-sm">
                      <button
                        onClick={() => removeSkill(index)}
                        className="absolute right-4 top-4 p-1.5 text-red-400 hover:bg-red-955/30 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</label>
                          <input
                            type="text"
                            placeholder="e.g. Languages"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={skill.category}
                            onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Skills (Comma-separated)</label>
                          <input
                            type="text"
                            placeholder="C++, Python, Java"
                            className="w-full p-2.5 text-sm border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            value={skill.list.join(', ')}
                            onChange={(e) => handleSkillChange(index, 'list', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addSkill}
                    className="w-full flex items-center justify-center p-3 border border-dashed rounded-xl text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/5 font-semibold text-xs tracking-wider uppercase transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Category
                  </button>
                </div>
              )}
            </div>

            {/* Centralized ATS Checker Hub */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white tracking-wide text-sm">Centralized ATS & Writing Optimizer</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Job Description / Target Criteria
                  </label>
                  <textarea
                    className="w-full p-3 text-xs border border-white/10 rounded-xl bg-[#0a0f1d] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    rows={3}
                    placeholder="Paste job posting to compare score and keyword compliance..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAnalyzeATS}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  className="w-full flex items-center justify-center py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl disabled:opacity-50 transition-all uppercase tracking-wider"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-white" /> Analyzing Criteria...</>
                  ) : (
                    'Run ATS Audit'
                  )}
                </button>

                {atsResult && (
                  <div className="p-4 bg-[#080d19]/80 border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-semibold text-gray-300">ATS Match Compliance</span>
                      <span className="text-xl font-black text-emerald-400">{atsResult.score}%</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-200 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400 flex-shrink-0" />
                        Writing expert suggestions:
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed text-justify">{atsResult.analysis}</p>
                    </div>

                    {atsResult.missing_keywords && atsResult.missing_keywords.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Missing Focus Terms</div>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.missing_keywords.map((kw: string) => (
                            <span key={kw} className="px-2 py-0.5 text-[10px] font-semibold bg-red-950/40 text-red-300 rounded-md border border-red-900/60">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Live A4 Preview & Print Export */}
      <div className="w-1/2 flex flex-col bg-gray-950 print:w-full print:bg-white print:p-0 overflow-y-auto">
        <div className="flex items-center justify-end p-4 border-b border-white/5 bg-[#0c1222]/80 backdrop-blur-md print:hidden">
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-1.5 text-sm font-semibold text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
          >
            <Download className="w-4 h-4 mr-2 text-emerald-400" /> Export / Print A4 PDF
          </button>
        </div>
        
        <div className="flex-1 p-6 md:p-12 flex justify-center items-start print:p-0 print:m-0">
          {/* A4 Document Wrapper */}
          <div className="w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl bg-white transition-all duration-300 print:shadow-none print:w-full print:max-w-none print:min-h-0 print:mx-0">
            <TemplateRenderer templateId={templateId} resumeData={resumeData} />
          </div>
        </div>
      </div>

      {/* Direct Raw Text Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm print:hidden">
          <div className="bg-[#0b101e] border border-[#1e293b] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-lg tracking-wide">Import Resume Text</h3>
              <button
                onClick={() => setShowImportDialog(false)}
                className="text-gray-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste the text content of your current CV. The AI engine will parse headers, sections, and populate your editor fields.
            </p>

            <textarea
              value={rawResumeText}
              onChange={(e) => setRawResumeText(e.target.value)}
              placeholder="Paste CV text here..."
              rows={8}
              className="w-full p-3 border border-white/10 rounded-xl text-sm bg-[#070b15] text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowImportDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRawTextImport}
                disabled={isParsingText || !rawResumeText.trim()}
                className="flex items-center px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg disabled:opacity-50"
              >
                {isParsingText && <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />}
                Analyze & Load
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
