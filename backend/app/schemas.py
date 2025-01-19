# app/schemas.py
from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional
from datetime import datetime
import re

class SurveyResponse(BaseModel):
    """Schema for survey responses"""
    surveyResponses: Dict[str, str] = Field(
        description="Dictionary of question IDs to answers (A/B)"
    )

class EPAFacility(BaseModel):
    """Schema for EPA facility data"""
    facility_name: Optional[str] = None
    registry_id: Optional[str] = None
    facility_type: Optional[str] = None
    location_address: Optional[str] = None
    city_name: Optional[str] = None
    state_code: Optional[str] = None
    postal_code: Optional[str] = None
    latitude83: Optional[float] = None
    longitude83: Optional[float] = None

class EPAEnvironmentalData(BaseModel):
    """Schema for EPA environmental data"""
    air_quality_index: Optional[float] = Field(None, description="Local air quality index")
    water_quality_score: Optional[float] = Field(None, description="Local water quality score")
    nearby_facilities: List[EPAFacility] = Field(default_factory=list)
    compliance_metrics: Dict[str, float] = Field(default_factory=dict)
    environmental_justice_score: Optional[float] = Field(None, description="Environmental justice index")

class ProjectBase(BaseModel):
    """Base schema for project data"""
    projectName: str = Field(..., description="Name of the project")
    location: str = Field(..., description="Project location")
    projectType: str = Field(..., description="Type of renewable energy project")
    surveyResponses: Dict[str, str] = Field(
        ..., 
        description="Survey responses where key is question number and value is 'A' (Yes) or 'B' (No)"
    )

    @validator('location')
    def validate_location(cls, v):
        # Basic non-empty validation
        if not v or len(v.strip()) == 0:
            raise ValueError('Location cannot be empty')
        return v.strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "projectName": "Solar Farm Alpha",
                "location": "New York, NY",
                "projectType": "solar_utility",
                "surveyResponses": {"1": "A", "2": "B"}
            }
        }
    }

class ProjectCreate(ProjectBase):
    """Schema for creating a new project"""
    pass

class ProjectResponse(ProjectBase):
    """Schema for project response including scores"""
    id: Optional[int] = Field(None, description="Project ID")
    standard_esg_score: Optional[float] = Field(None, description="Standard ESG score")
    european_esg_score: Optional[float] = Field(None, description="European ESG score")
    us_esg_score: Optional[float] = Field(None, description="US ESG score")
    community_engagement_score: Optional[float] = Field(None, description="Community engagement score")
    total_esg_score: Optional[float] = Field(None, description="Total ESG score")
    epa_data: Optional[EPAEnvironmentalData] = Field(None, description="EPA environmental data")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

    model_config = {
        "from_attributes": True
    }

class ESGScores(BaseModel):
    """Schema for ESG scores"""
    standard_esg: float = Field(..., description="Standard ESG score")
    european_esg: float = Field(..., description="European ESG score")
    us_esg: float = Field(..., description="US ESG score")
    community_engagement: float = Field(..., description="Community engagement score")
    total: float = Field(..., description="Total ESG score")

class LocationRiskMetrics(BaseModel):
    """Schema for location-specific risk metrics"""
    air_quality_risk: Optional[float] = Field(None, description="Air quality risk score")
    water_quality_risk: Optional[float] = Field(None, description="Water quality risk score")
    facility_density: Optional[float] = Field(None, description="Nearby facility density score")
    environmental_justice_risk: Optional[float] = Field(None, description="Environmental justice risk score")

class ESGAnalysisResponse(BaseModel):
    """Schema for the complete ESG analysis response"""
    scores: Dict[str, float] = Field(..., description="ESG scores by category")
    recommendations: List[str] = Field(..., description="List of recommendations based on scores")
    risks: List[str] = Field(..., description="List of identified risks based on scores")
    epa_data: Optional[EPAEnvironmentalData] = Field(None, description="EPA environmental data")
    location_risks: Optional[LocationRiskMetrics] = Field(None, description="Location-specific risk metrics")

    model_config = {
        "json_schema_extra": {
            "example": {
                "scores": {
                    "standard_esg": 75.5,
                    "european_esg": 80.0,
                    "us_esg": 70.0,
                    "community_engagement": 85.0,
                    "total": 77.6
                },
                "recommendations": [
                    "Consider implementing stronger environmental practices",
                    "Enhance community engagement initiatives"
                ],
                "risks": [
                    "Limited alignment with EU standards may restrict funding options"
                ],
                "epa_data": {
                    "air_quality_index": 65.0,
                    "water_quality_score": 80.0,
                    "nearby_facilities": [],
                    "compliance_metrics": {},
                    "environmental_justice_score": 72.5
                },
                "location_risks": {
                    "air_quality_risk": 35.0,
                    "water_quality_risk": 20.0,
                    "facility_density": 45.0,
                    "environmental_justice_risk": 27.5
                }
            }
        }
    }