'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface AIAssistantProps {
  resumeContent: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ resumeContent }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await api.post('/ai/optimize-ats', {
        resume_content: resumeContent,
        job_description: jobDescription
      });
      setAnalysisResult(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-white">AI Resume Assistant</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Target Job Description</label>
          <textarea
            className="w-full p-3 text-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[#070b15] text-white"
            rows={4}
            placeholder="Paste the job description here to get an ATS match score and keyword gap analysis..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Match...</>
          ) : (
            'Analyze ATS Compatibility'
          )}
        </button>

        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-medium text-gray-300">ATS Match Score</span>
              <span className="text-2xl font-bold text-emerald-400">{analysisResult.score || '85'}%</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Analysis
              </h4>
              <p className="text-sm text-gray-450">{analysisResult.analysis}</p>
            </div>
            {analysisResult.missing_keywords && analysisResult.missing_keywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missing_keywords.map((kw: string) => (
                    <span key={kw} className="px-2 py-1 text-xs bg-red-950/40 text-red-300 rounded-md border border-red-900/60">
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
  );
}
