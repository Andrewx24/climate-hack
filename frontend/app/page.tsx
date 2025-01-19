// app/page.tsx
'use client';

import { useState } from 'react';
import { SurveyForm } from '@/components/SurveyForm';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ProjectData, ESGScores } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Create an API service for data fetching
async function analyzeProject(projectData: ProjectData) {
  try {
    const response = await fetch('http://localhost:8000/projects/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      // Try to parse error details, but have a fallback
      let errorDetails = 'Failed to analyze project';
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse || 'Unknown error occurred';
      } catch {
        // If parsing fails, use default error message
      }

      throw new Error(errorDetails);
    }

    return response.json();
  } catch (error) {
    // Log the full error for debugging
    console.error('API call error:', error);
    
    // Throw a user-friendly error message
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while analyzing the project'
    );
  }
}

export default function Home() {
  const [scores, setScores] = useState<ESGScores | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProjectSubmit = async (projectData: ProjectData) => {
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!projectData.projectName || !projectData.location || !projectData.projectType) {
        throw new Error('Please fill in all required fields');
      }

      const data = await analyzeProject(projectData);
      setScores(data);

      // Handle mobile scrolling
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        const resultsElement = document.getElementById('results-section');
        resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error('Error analyzing project:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            ESG Project Assessment
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete the survey to evaluate your project's ESG compliance and receive detailed recommendations
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
            <SurveyForm 
              onSubmit={handleProjectSubmit} 
              isLoading={loading}
              onError={setError}
            />
          </div>

          {scores && (
            <div id="results-section" className="space-y-6">
              <ScoreDisplay 
                scores={scores}
                className="lg:sticky lg:top-8"
              />
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Steps
                </h3>
                <div className="space-y-4">
                  {scores.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-blue-600">•</span>
                      <p className="ml-2 text-gray-600">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!scores && (
          <div className="mt-8 lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Why ESG Assessment Matters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Funding Access</h3>
                  <p className="text-gray-600 text-sm">
                    Strong ESG scores can improve access to European and federal funding sources, including DOE's Justice 40 program.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Risk Management</h3>
                  <p className="text-gray-600 text-sm">
                    Identify and address potential environmental, social, and governance risks early in your project.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Community Support</h3>
                  <p className="text-gray-600 text-sm">
                    Build stronger relationships with local communities and stakeholders through transparent ESG practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            This ESG assessment tool helps renewable energy projects evaluate their compliance with environmental, social, and governance standards.
          </p>
        </div>
      </footer>
    </div>
  );
}