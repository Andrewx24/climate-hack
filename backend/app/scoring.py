from typing import Dict, List, Tuple

class ESGScorer:
    def __init__(self):
        self.category_weights = {
            'standard_esg': {
                'weight': 0.3,
                'questions': range(1, 16),
                'subcategories': {
                    'basic_compliance': {'questions': range(1, 6), 'weight': 0.4},
                    'management_systems': {'questions': range(6, 11), 'weight': 0.3},
                    'reporting': {'questions': range(11, 16), 'weight': 0.3}
                }
            },
            'european_esg': {
                'weight': 0.2,
                'questions': range(16, 22),
                'subcategories': {
                    'taxonomy_alignment': {'questions': range(16, 18), 'weight': 0.4},
                    'reporting_requirements': {'questions': range(18, 20), 'weight': 0.3},
                    'green_deal': {'questions': range(20, 22), 'weight': 0.3}
                }
            },
            'us_esg': {
                'weight': 0.3,
                'questions': range(22, 32),
                'subcategories': {
                    'environmental': {'questions': range(22, 26), 'weight': 0.4},
                    'social': {'questions': range(26, 28), 'weight': 0.3},
                    'governance': {'questions': range(28, 32), 'weight': 0.3}
                }
            },
            'community_engagement': {
                'weight': 0.2,
                'questions': range(32, 36),
                'subcategories': {
                    'outreach': {'questions': range(32, 34), 'weight': 0.5},
                    'communication': {'questions': range(34, 36), 'weight': 0.5}
                }
            }
        }

    def calculate_category_score(self, responses: Dict[str, str], questions: range) -> float:
        """Calculate score for a specific category or subcategory"""
        total_questions = len(questions)
        if total_questions == 0:
            return 0
        
        positive_responses = sum(1 for q in questions if str(q) in responses and responses[str(q)] == 'A')
        return (positive_responses / total_questions) * 100

    def calculate_scores(self, responses: Dict[str, str]) -> Dict[str, float]:
        """Calculate scores for all categories"""
        scores = {}
        total_score = 0

        for category, config in self.category_weights.items():
            category_score = 0
            for subcategory, subconfig in config['subcategories'].items():
                sub_score = self.calculate_category_score(responses, subconfig['questions'])
                category_score += sub_score * subconfig['weight']
            
            scores[category] = category_score
            total_score += category_score * config['weight']

        scores['total'] = total_score
        return scores

    def generate_recommendations(self, scores: Dict[str, float]) -> List[str]:
        """Generate recommendations based on scores"""
        recommendations = []
        
        # Standard ESG recommendations
        if scores['standard_esg'] < 70:
            recommendations.append(
                "Improve basic ESG compliance measures and establish stronger management systems"
            )
        
        # European ESG recommendations
        if scores['european_esg'] < 70:
            recommendations.append(
                "Enhance alignment with EU Taxonomy and strengthen reporting mechanisms"
            )
        
        # US ESG recommendations
        if scores['us_esg'] < 70:
            recommendations.append(
                "Strengthen environmental and social impact measures to meet US standards"
            )
        
        # Community engagement recommendations
        if scores['community_engagement'] < 70:
            recommendations.append(
                "Develop more robust community engagement and communication strategies"
            )
        
        return recommendations

    def identify_risks(self, scores: Dict[str, float]) -> List[str]:
        """Identify risk factors based on scores"""
        risks = []
        
        if scores['standard_esg'] < 50:
            risks.append("Critical ESG compliance gaps present significant risk")
            
        if scores['european_esg'] < 50:
            risks.append("Non-compliance with EU standards may affect funding eligibility")
            
        if scores['us_esg'] < 50:
            risks.append("Below-standard US ESG practices pose regulatory risks")
            
        if scores['community_engagement'] < 50:
            risks.append("Poor community engagement may lead to project opposition")
            
        return risks