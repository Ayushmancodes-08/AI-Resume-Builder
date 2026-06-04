import { create } from 'zustand';

// Temporary types until we import from a shared types file
export interface Resume {
  id: string;
  title: string;
  templateId: string;
  sections: any[];
}

interface ResumeState {
  currentResume: Resume | null;
  resumes: Resume[];
  isLoading: boolean;
  error: string | null;
  setCurrentResume: (resume: Resume) => void;
  setResumes: (resumes: Resume[]) => void;
  updateResumeSection: (sectionId: string, data: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: null,
  resumes: [],
  isLoading: false,
  error: null,
  setCurrentResume: (currentResume) => set({ currentResume }),
  setResumes: (resumes) => set({ resumes }),
  updateResumeSection: (sectionId, data) => 
    set((state) => {
      if (!state.currentResume) return state;
      
      const updatedSections = state.currentResume.sections.map(section => 
        section.id === sectionId ? { ...section, ...data } : section
      );
      
      return {
        currentResume: {
          ...state.currentResume,
          sections: updatedSections
        }
      };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
