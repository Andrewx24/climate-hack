// components/SurveyForm.tsx
import React, { useState } from 'react';
import { ProjectData, SURVEY_QUESTIONS } from '@/lib/types';

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

  const [zipError, setZipError] = useState<string>('');

  // ZIP code validation function
  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    setFormData(prev => ({ ...prev, location: zip }));
    
    if (zip && !validateZipCode(zip)) {
      setZipError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    } else {
      setZipError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ZIP code before submission
    if (!validateZipCode(formData.location)) {
      setZipError('Please enter a valid ZIP code');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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
            Project Location (ZIP Code)
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Enter ZIP code (e.g., 12345)"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
              ${zipError ? 'border-red-300' : 'border-gray-300'}`}
            required
            pattern="\d{5}(-\d{4})?"
          />
          {zipError && (
            <p className="mt-1 text-sm text-red-600">
              {zipError}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter the ZIP code to fetch local environmental data
          </p>
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
            <option value="solar_utility">Solar - Utility Scale</option>
            <option value="solar_commercial">Solar - Commercial</option>
            <option value="solar_residential">Solar - Residential</option>
            <option value="wind_onshore">Wind - Onshore</option>
            <option value="wind_offshore">Wind - Offshore</option>
            <option value="bioenergy">Bioenergy</option>
            <option value="geothermal">Geothermal</option>
            <option value="hydroelectric">Hydroelectric</option>
            <option value="energy_storage">Energy Storage</option>
            <option value="hydrogen">Hydrogen</option>
            <option value="other">Other Renewable Energy</option>
          </select>
        </div>
      </div>

      {/* Rest of your form code for survey questions */}

      <button
        type="submit"
        disabled={isLoading || !!zipError}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isLoading || !!zipError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {isLoading ? 'Processing...' : 'Submit Assessment'}
      </button>
    </form>
  );
};