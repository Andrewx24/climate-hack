'use client';

import { useState } from 'react';
import { ProjectForm } from '@/components/ProjectForm';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Header } from '@/components/Header';
import { ProjectData, ESGScores } from '@/lib/types';

export default function Home() {
  const [scores, setScores] = useState<ESGScores | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProjectSubmit = async (projectData: ProjectData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/projects/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze project');
      }
      
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error analyzing project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProjectForm onSubmit={handleProjectSubmit} isLoading={loading} />
          {scores && <ScoreDisplay scores={scores} />}
        </div>
      </main>
    </div>
  );
}