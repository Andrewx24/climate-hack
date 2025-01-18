from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    project_type = Column(String)  # solar, wind, bioenergy
    
    # Survey responses and scores
    survey_responses = Column(JSON)
    standard_esg_score = Column(Float)
    european_esg_score = Column(Float)
    us_esg_score = Column(Float)
    community_engagement_score = Column(Float)
    total_esg_score = Column(Float)
    
    # Analysis results
    recommendations = Column(Text)
    risk_factors = Column(Text)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
