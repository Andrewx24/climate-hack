// components/SurveyForm.tsx
import React, { useState } from 'react';
import { ProjectData, SURVEY_QUESTIONS, PROJECT_TYPE_OPTIONS } from '@/lib/types';

interface SurveyFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isLoading, onError }) => {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    location: '',
    projectType: 'solar_utility',
    surveyResponses: {}
  });

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value;
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if location is not empty
    if (!formData.location.trim()) {
      onError?.('Please enter a location');
      return;
    }

    // Check if project name is not empty
    if (!formData.projectName.trim()) {
      onError?.('Please enter a project name');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
      {/* Basic Project Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData({...formData, projectName: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Project Location 
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Enter location (e.g., City, State)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
            Project Type
          </label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {PROJECT_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Survey Questions */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">ESG Assessment Questions</h3>
        
        {Object.entries(SURVEY_QUESTIONS).map(([id, question]) => (
          <div key={id} className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                {id}. {question}
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value="A"
                    checked={formData.surveyResponses[id] === "A"}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      surveyResponses: {
                        ...prev.surveyResponses,
                        [id]: e.target.value as "A" | "B"
                      }
                    }))}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value="B"
                    checked={formData.surveyResponses[id] === "B"}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      surveyResponses: {
                        ...prev.surveyResponses,
                        [id]: e.target.value as "A" | "B"
                      }
                    }))}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isLoading ? 'Processing...' : 'Submit Assessment'}
        </button>
      </div>
    </form>
  );
};