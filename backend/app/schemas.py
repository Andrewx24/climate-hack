from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    location: str
    project_type: str = Field(..., pattern="^(solar|wind|bioenergy)$")
    survey_responses: Dict[str, str]

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    standard_esg_score: float
    european_esg_score: float
    us_esg_score: float
    community_engagement_score: float
    total_esg_score: float
    recommendations: List[str]
    risk_factors: List[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
