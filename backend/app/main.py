# app/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import SessionLocal, engine
from .scoring import ESGScorer

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ESG Scoring API")

# Configure CORS - Update this with your frontend URL
origins = [
    "http://localhost:3000",      # Next.js default port
    "http://localhost:3001",      # Alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.get("/")
async def read_root():
    return {"message": "Welcome to the ESG Scoring API"}

@app.post("/projects/analyze", response_model=schemas.ESGAnalysisResponse)
async def analyze_project(project: schemas.ProjectCreate):
    try:
        print("Received project data:", project.dict())  # Debug print
        
        # Initialize scorer
        scorer = ESGScorer()
        
        # Calculate scores
        scores = scorer.calculate_scores(project.surveyResponses)
        print("Calculated scores:", scores)  # Debug print
        
        # Generate recommendations and risks
        recommendations = scorer.generate_recommendations(scores)
        risks = scorer.identify_risks(scores)
        
        response = {
            "scores": scores,
            "recommendations": recommendations,
            "risks": risks
        }
        print("Sending response:", response)  # Debug print
        
        return response
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debug print
        import traceback
        print(traceback.format_exc())  # Print full traceback
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while analyzing the project: {str(e)}"
        )

@app.post("/projects/", response_model=schemas.ProjectResponse)
async def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    try:
        scorer = ESGScorer()
        scores = scorer.calculate_scores(project.surveyResponses)
        
        db_project = models.Project(
            projectName=project.projectName,
            location=project.location,
            projectType=project.projectType,
            surveyResponses=project.surveyResponses,
            standard_esg_score=scores.get("standard_esg", 0),
            european_esg_score=scores.get("european_esg", 0),
            us_esg_score=scores.get("us_esg", 0),
            community_engagement_score=scores.get("community_engagement", 0),
            total_esg_score=scores.get("total", 0)
        )
        
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/", response_model=List[schemas.ProjectResponse])
async def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@app.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project