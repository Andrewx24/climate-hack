import { useState } from 'react';
import { ProjectData } from '../lib/types';

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading: boolean;
}

const surveyCategories = {
  'Standard ESG Variables': { start: 1, end: 15 },
  'European ESG Requirements': { start: 16, end: 21 },
  'US ESG Indicators': { start: 22, end: 31 },
  'Community Engagement': { start: 32, end: 35 }
};

export const ProjectForm = ({ onSubmit, isLoading }: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    location: '',
    projectType: 'solar',
    surveyResponses: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResponse = (questionId: string, value: "A" | "B") => {
    setFormData(prev => ({
      ...prev,
      surveyResponses: {
        ...prev.surveyResponses,
        [questionId]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData({...formData, projectName: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Type
          </label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value as ProjectData['projectType']})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="solar">Solar</option>
            <option value="wind">Wind</option>
            <option value="bioenergy">Bioenergy</option>
          </select>
        </div>
      </div>

      {Object.entries(surveyCategories).map(([category, { start, end }]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          <div className="grid gap-4">
            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(questionId => (
              <div key={questionId} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Question {questionId}</span>
                <select
                  value={formData.surveyResponses[questionId] || ''}
                  onChange={(e) => handleResponse(questionId.toString(), e.target.value as "A" | "B")}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="A">Yes</option>
                  <option value="B">No</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {isLoading ? 'Analyzing...' : 'Submit Project'}
      </button>
    </form>
  );
};