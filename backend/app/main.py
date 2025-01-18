from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from . import models, schemas
from .database import SessionLocal, engine
from .scoring import ESGScorer
from .config import settings

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # Calculate ESG scores
    scorer = ESGScorer()
    scores = scorer.calculate_scores(project.survey_responses)
    recommendations = scorer.generate_recommendations(scores)
    risks = scorer.identify_risks(scores)
    
    # Create project in database
    db_project = models.Project(
        name=project.name,
        location=project.location,
        project_type=project.project_type,
        survey_responses=project.survey_responses,
        standard_esg_score=scores['standard_esg'],
        european_esg_score=scores['european_esg'],
        us_esg_score=scores['us_esg'],
        community_engagement_score=scores['community_engagement'],
        total_esg_score=scores['total'],
        recommendations="\n".join(recommendations),
        risk_factors="\n".join(risks)
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project

@app.get("/projects/", response_model=List[schemas.ProjectResponse])
def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@app.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects/analyze")
def analyze_project(project: schemas.ProjectCreate):
    scorer = ESGScorer()
    scores = scorer.calculate_scores(project.survey_responses)
    recommendations = scorer.generate_recommendations(scores)
    risks = scorer.identify_risks(scores)
    
    return {
        "scores": scores,
        "recommendations": recommendations,
        "risks": risks
    }
