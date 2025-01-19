# app/models.py
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    projectName = Column(String, index=True)
    location = Column(String)
    projectType = Column(String)
    surveyResponses = Column(JSON)

    standard_esg_score = Column(Float)
    european_esg_score = Column(Float)
    us_esg_score = Column(Float)
    community_engagement_score = Column(Float)
    total_esg_score = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
