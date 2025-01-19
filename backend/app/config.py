from pydantic import BaseModel

class Settings(BaseModel):
    DATABASE_URL: str = "sqlite:///./esg_projects.db"
    API_VERSION: str = "v1"
    PROJECT_NAME: str = "ESG Scoring API"
    
    class Config:
        env_file = ".env"

settings = Settings()