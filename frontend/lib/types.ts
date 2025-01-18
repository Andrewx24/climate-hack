// types.ts

// Response type for Yes/No questions
export interface SurveyResponse {
    [key: string]: "A" | "B" | "";
  }
  
  // Available project types
  export type ProjectType = 
    | 'solar_utility' 
    | 'solar_commercial' 
    | 'solar_residential'
    | 'wind_onshore'
    | 'wind_offshore'
    | 'bioenergy'
    | 'geothermal'
    | 'hydroelectric'
    | 'energy_storage'
    | 'hydrogen'
    | 'other';
  
  // Project data structure
  export interface ProjectData {
    projectName: string;
    location: string;
    projectType: ProjectType;
    surveyResponses: SurveyResponse;
  }
  
  // Detailed ESG score categories
  export interface ESGCategoryScores {
    standard_esg: {
      total: number;
      basic_compliance: number;
      environmental_practices: number;
      documentation_reporting: number;
    };
    european_esg: {
      total: number;
      eu_taxonomy: number;
      sustainability_reporting: number;
      stakeholder_engagement: number;
    };
    us_esg: {
      total: number;
      environmental: number;
      social: number;
      governance: number;
    };
    community_engagement: {
      total: number;
      engagement_history: number;
      public_communication: number;
    };
    total: number;
  }
  
  // Complete ESG assessment result
  export interface ESGScores {
    scores: ESGCategoryScores;
    recommendations: string[];
    risks: string[];
  }
  
  // Survey structure
  export interface SurveySection {
    title: string;
    startQuestion: number;
    endQuestion: number;
    questions: SurveyQuestion[];
  }
  
  export interface SurveyQuestion {
    id: number;
    text: string;
    category: 'standard' | 'european' | 'us' | 'community';
    subcategory?: string;
  }
  
  // Survey structure definition
  export const SURVEY_STRUCTURE = {
    standardESG: {
      title: "Standard ESG Variables",
      range: { start: 1, end: 15 },
      weight: 0.35
    },
    europeanESG: {
      title: "European ESG Requirements",
      range: { start: 16, end: 21 },
      weight: 0.25
    },
    usESG: {
      title: "High Level US ESG Indicators",
      subsections: {
        environmental: { start: 22, end: 25 },
        social: { start: 26, end: 27 },
        governance: { start: 28, end: 31 }
      },
      weight: 0.25
    },
    communityEngagement: {
      title: "Community Engagement",
      range: { start: 32, end: 35 },
      weight: 0.15
    }
  };
  
  // Question definitions
  export const SURVEY_QUESTIONS: Record<number, string> = {
    1: "Does the project have a materials recycling program?",
    2: "Does the project follow wage standards that meet or exceed the Davis-Bacon Act guidelines?",
    3: "Does the project have an apprenticeship program?",
    4: "Are vendors educated about ESG guidelines or given any specific ESG-related requirements?",
    5: "Is there any monitoring of or reporting from vendors required in relation to ESG requirements?",
    6: "Does the project implement energy efficiency measures, such as using renewable energy sources or optimizing energy use?",
    7: "Is there a biodiversity impact assessment conducted, and are there measures in place to mitigate negative impacts on local ecosystems?",
    8: "Are there programs in place for community engagement or contributions to local social initiatives?",
    9: "Does the project have a system in place to monitor and report greenhouse gas emissions?",
    10: "Are there measures to ensure ethical sourcing of materials, including rare earth elements, and how is this monitored?",
    11: "Are ESG principles formalized in project documentation, such as an ESG manual or employee handbook?",
    12: "Are there obligations written into the project finance documents that require certification, representations, or reporting to project funding partners regarding ESG compliance?",
    13: "Does the project include a formal human rights policy, particularly in relation to labor practices and supply chain management?",
    14: "Is there a diversity and inclusion policy in place?",
    15: "Are there any certifications or audits required by third parties to validate ESG practices?",
    16: "Does the project align with the EU Taxonomy for sustainable activities?",
    17: "Is compliance documented?",
    18: "Are there specific measures in place to address the EU's Corporate Sustainability Reporting Directive (CSRD) requirements?",
    19: "How does the project ensure alignment with the EU's Green Deal, particularly in terms of reducing carbon emissions?",
    20: "Are there mechanisms for stakeholder engagement, including reporting to or involving local communities and NGOs?",
    21: "How does the project address the EU's focus on circular economy principles, such as waste reduction and resource efficiency?",
    22: "Does the project adhere to a sustainable land use policy, including site selection that prioritizes ecological conservation?",
    23: "Is there a documented Net Zero Improvement Plan in place?",
    24: "Does the project have a comprehensive Site Waste Management Plan?",
    25: "Are there documented processes for the ethical sourcing of rare earth materials?",
    26: "Does the project include a framework for engaging with local communities and stakeholders?",
    27: "Are there guidelines ensuring fair labor practices and safe working conditions?",
    28: "Is there a system in place for ensuring compliance with all relevant regulations?",
    29: "Does the project enforce a Supplier Code of Conduct?",
    30: "Are there clear policies and procedures for whistleblowing and handling grievances?",
    31: "Is there an anti-bribery and corruption policy in place?",
    32: "Does the project have a documented history of community engagement?",
    33: "Has the project held public information or education meetings?",
    34: "Has the project issued press releases or given media interviews?",
    35: "Has the project generated educational or informational materials about its impact?"
  };
  
  // Project type options with labels
  export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
    { value: 'solar_utility', label: 'Solar - Utility Scale' },
    { value: 'solar_commercial', label: 'Solar - Commercial & Industrial' },
    { value: 'solar_residential', label: 'Solar - Residential' },
    { value: 'wind_onshore', label: 'Wind - Onshore' },
    { value: 'wind_offshore', label: 'Wind - Offshore' },
    { value: 'bioenergy', label: 'Bioenergy' },
    { value: 'geothermal', label: 'Geothermal' },
    { value: 'hydroelectric', label: 'Hydroelectric' },
    { value: 'energy_storage', label: 'Energy Storage' },
    { value: 'hydrogen', label: 'Hydrogen' },
    { value: 'other', label: 'Other Renewable Energy' }
  ];