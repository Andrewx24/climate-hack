# app/scoring_config.py

ESG_WEIGHTS = {
    'standard_esg': {
        'weight': 0.35,
        'questions': range(1, 16),
        'subcategories': {
            'basic_compliance': {
                'questions': [1, 2, 3, 4, 5],
                'weight': 0.35
            },
            'environmental_practices': {
                'questions': [6, 7, 8, 9, 10],
                'weight': 0.35
            },
            'documentation_reporting': {
                'questions': [11, 12, 13, 14, 15],
                'weight': 0.30
            }
        }
    },
    'european_esg': {
        'weight': 0.25,
        'questions': range(16, 22),
        'subcategories': {
            'eu_taxonomy': {
                'questions': [16, 17],
                'weight': 0.4
            },
            'sustainability_reporting': {
                'questions': [18, 19],
                'weight': 0.3
            },
            'stakeholder_engagement': {
                'questions': [20, 21],
                'weight': 0.3
            }
        }
    },
    'us_esg': {
        'weight': 0.25,
        'questions': range(22, 32),
        'subcategories': {
            'environmental': {
                'questions': [22, 23, 24, 25],
                'weight': 0.4
            },
            'social': {
                'questions': [26, 27],
                'weight': 0.3
            },
            'governance': {
                'questions': [28, 29, 30, 31],
                'weight': 0.3
            }
        }
    },
    'community_engagement': {
        'weight': 0.15,
        'questions': range(32, 36),
        'subcategories': {
            'engagement_history': {
                'questions': [32, 33],
                'weight': 0.5
            },
            'public_communication': {
                'questions': [34, 35],
                'weight': 0.5
            }
        }
    }
}

PROJECT_TYPES = [
    'solar_utility',
    'solar_commercial',
    'solar_residential',
    'wind_onshore',
    'wind_offshore',
    'bioenergy',
    'geothermal',
    'hydroelectric',
    'energy_storage',
    'hydrogen',
    'other'
]

# Specific recommendations based on project type and scores
PROJECT_TYPE_RECOMMENDATIONS = {
    'solar_utility': {
        'low_score': [
            "Implement comprehensive land use and biodiversity assessment protocols",
            "Develop robust community engagement strategy for utility-scale installations",
            "Establish recycling programs for solar panels and materials"
        ],
        'medium_score': [
            "Enhance monitoring systems for environmental impact",
            "Strengthen stakeholder communication channels",
            "Consider additional certifications for sustainability practices"
        ]
    },
    'wind_onshore': {
        'low_score': [
            "Conduct detailed wildlife impact assessments",
            "Implement noise reduction measures",
            "Develop community benefit sharing programs"
        ],
        'medium_score': [
            "Enhance bird and bat monitoring systems",
            "Strengthen community engagement processes",
            "Improve supply chain sustainability"
        ]
    }
    # Add similar recommendations for other project types
}