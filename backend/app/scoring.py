# app/scoring.py

class ESGScorer:
    def __init__(self):
        self.weights = {
            'standard_esg': {
                'weight': 0.35,
                'questions': range(1, 16),  # Questions 1-15
                'categories': {
                    'basic_compliance': {'questions': [1, 2, 3, 4, 5], 'weight': 0.4},
                    'environmental_practices': {'questions': [6, 7, 8, 9, 10], 'weight': 0.3},
                    'governance': {'questions': [11, 12, 13, 14, 15], 'weight': 0.3}
                }
            },
            'european_esg': {
                'weight': 0.25,
                'questions': range(16, 22),  # Questions 16-21
                'categories': {
                    'eu_taxonomy': {'questions': [16, 17], 'weight': 0.4},
                    'sustainability_reporting': {'questions': [18, 19], 'weight': 0.3},
                    'stakeholder_engagement': {'questions': [20, 21], 'weight': 0.3}
                }
            },
            'us_esg': {
                'weight': 0.25,
                'questions': range(22, 32),  # Questions 22-31
                'categories': {
                    'environmental': {'questions': [22, 23, 24, 25], 'weight': 0.4},
                    'social': {'questions': [26, 27], 'weight': 0.3},
                    'governance': {'questions': [28, 29, 30, 31], 'weight': 0.3}
                }
            },
            'community_engagement': {
                'weight': 0.15,
                'questions': range(32, 36),  # Questions 32-35
                'categories': {
                    'public_engagement': {'questions': [32, 33], 'weight': 0.5},
                    'communication': {'questions': [34, 35], 'weight': 0.5}
                }
            }
        }

    def calculate_scores(self, survey_responses: dict) -> dict:
        """Calculate ESG scores based on survey responses"""
        try:
            scores = {}
            total_score = 0

            # Convert string question IDs to integers
            responses = {int(k): v for k, v in survey_responses.items()}

            for category, config in self.weights.items():
                category_score = self._calculate_category_score(responses, config)
                scores[category] = round(category_score, 2)
                total_score += category_score * config['weight']

            scores['total'] = round(total_score, 2)
            return scores
        except Exception as e:
            print(f"Error in calculate_scores: {str(e)}")
            raise

    def _calculate_category_score(self, responses: dict, config: dict) -> float:
        """Calculate score for a specific category"""
        try:
            category_score = 0
            for subcategory, subconfig in config['categories'].items():
                subcategory_score = 0
                relevant_questions = subconfig['questions']
                answered_questions = 0

                for question in relevant_questions:
                    if question in responses:
                        if responses[question] == 'A':
                            subcategory_score += 1
                        answered_questions += 1

                if answered_questions > 0:
                    subcategory_score = (subcategory_score / answered_questions) * 100
                    category_score += subcategory_score * subconfig['weight']

            return category_score
        except Exception as e:
            print(f"Error in _calculate_category_score: {str(e)}")
            raise

    def generate_recommendations(self, scores: dict) -> list:
        """Generate recommendations based on scores"""
        recommendations = []

        if scores['standard_esg'] < 70:
            recommendations.append(
                "Improve basic ESG compliance measures, including materials recycling and workforce development programs."
            )

        if scores['european_esg'] < 70:
            recommendations.append(
                "Enhance alignment with EU Taxonomy and CSRD reporting requirements."
            )

        if scores['us_esg'] < 70:
            recommendations.append(
                "Strengthen environmental and social impact measures to meet US standards."
            )

        if scores['community_engagement'] < 70:
            recommendations.append(
                "Develop more robust community engagement and communication strategies."
            )

        return recommendations

    def identify_risks(self, scores: dict) -> list:
        """Identify risk factors based on scores"""
        risks = []

        if scores['standard_esg'] < 50:
            risks.append("Critical ESG compliance gaps may affect project viability")

        if scores['european_esg'] < 50:
            risks.append("Limited alignment with EU standards may restrict funding options")

        if scores['us_esg'] < 50:
            risks.append("Below-standard US ESG practices pose regulatory risks")

        if scores['community_engagement'] < 50:
            risks.append("Insufficient community engagement may lead to project opposition")

        return risks