// components/SurveyForm.tsx
import React, { useState, useEffect } from 'react';
import { ProjectData, SURVEY_QUESTIONS, PROJECT_TYPE_OPTIONS } from '@/lib/types';

interface SurveyFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

interface LocationData {
  environmental_data: {
    air_quality: any;
    water_quality: any;
  };
  economic_data: any;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isLoading, onError }) => {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    location: '',
    projectType: 'solar_utility',
    surveyResponses: {}
  });

  const [zipError, setZipError] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const fetchLocationData = async (zip: string) => {
    setIsLoadingLocation(true);
    try {
      const response = await fetch(`http://localhost:8000/projects/${zip}/location-data`);
      if (!response.ok) throw new Error('Failed to fetch location data');
      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error('Error fetching location data:', error);
      onError?.('Failed to fetch location data');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    setFormData(prev => ({ ...prev, location: zip }));
    
    if (zip && validateZipCode(zip)) {
      setZipError('');
      await fetchLocationData(zip);
    } else {
      setZipError('Please enter a valid ZIP code');
      setLocationData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateZipCode(formData.location)) {
      setZipError('Please enter a valid ZIP code');
      return;
    }

    // Check if all required fields are filled
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
            placeholder="Enter ZIP code (e.g., 12345)"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
              ${zipError ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
          {zipError && (
            <p className="mt-1 text-sm text-red-600">{zipError}</p>
          )}
        </div>

        {/* Location Data Display */}
        {isLoadingLocation && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Loading location data...</p>
          </div>
        )}

        {locationData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Location Data</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-medium text-gray-700">Environmental Data</h5>
                <p className="text-xs text-gray-600">
                  Air Quality Index: {locationData.environmental_data.air_quality?.aqi || 'N/A'}
                </p>
                <p className="text-xs text-gray-600">
                  Water Quality Score: {locationData.environmental_data.water_quality?.score || 'N/A'}
                </p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-700">Economic Data</h5>
                <p className="text-xs text-gray-600">
                  Median Income: {
                    locationData.economic_data?.[1]?.[0] 
                      ? `$${Number(locationData.economic_data[1][0]).toLocaleString()}`
                      : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

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
          disabled={isLoading || !!zipError}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading || !!zipError ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isLoading ? 'Processing...' : 'Submit Assessment'}
        </button>
      </div>
    </form>
  );
};