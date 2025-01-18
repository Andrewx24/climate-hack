import { ESGScores } from '@/lib/types'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ScoreDisplayProps {
  scores: ESGScores;
}

export const ScoreDisplay = ({ scores }: ScoreDisplayProps) => {
  const radarData = [
    { category: 'Standard ESG', value: scores.scores.standard_esg },
    { category: 'European ESG', value: scores.scores.european_esg },
    { category: 'US ESG', value: scores.scores.us_esg },
    { category: 'Community', value: scores.scores.community_engagement }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4">ESG Score Breakdown</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="ESG Score"
                dataKey="value"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            Total Score: {Math.round(scores.scores.total)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {scores.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-2">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-medium text-red-600 mb-4">Risk Factors</h3>
        <ul className="space-y-2">
          {scores.risks.map((risk, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-red-500">•</span>
              <span className="ml-2 text-red-700">{risk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};