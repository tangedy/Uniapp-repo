import { useState, useCallback } from 'react';
import { UserApplication, Program } from '../types';

export const useApplications = () => {
  const [applications, setApplications] = useState<UserApplication[]>([]);

  const addApplication = useCallback((program: Program) => {
    const newApplication: UserApplication = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '1', // Mock user ID
      programId: program.id,
      program,
      status: 'Planning',
      supplementaryStatus: {},
      notes: '',
      createdAt: new Date().toISOString(),
    };

    setApplications(prev => [...prev, newApplication]);
  }, []);

  const updateApplication = useCallback((applicationId: string, updates: Partial<UserApplication>) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, ...updates }
          : app
      )
    );
  }, []);

  const removeApplication = useCallback((applicationId: string) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  }, []);

  const getAppliedProgramIds = useCallback(() => {
    return applications.map(app => app.programId);
  }, [applications]);

  return {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    getAppliedProgramIds,
  };
};