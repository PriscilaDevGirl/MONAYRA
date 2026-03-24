from typing import Optional

from pydantic import BaseModel


class JobCreate(BaseModel):
    company_id: int
    title: str
    location: str
    work_model: str
    employment_type: str
    summary: str
    responsibilities: str
    required_skills: str
    preferred_skills: str = ""
    salary_range: Optional[str] = None
    inclusive_notes: str = ""


class JobRead(JobCreate):
    id: int
    is_active: bool


class ApplicationCreate(BaseModel):
    candidate_id: int
    job_id: int


class ApplicationStageUpdate(BaseModel):
    stage: str
    recruiter_feedback: Optional[str] = None


class ApplicationRead(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    stage: str
    compatibility_score: float
    growth_score: float
    inclusion_score: float
    recruiter_feedback: Optional[str]
    candidate_feedback: Optional[str]
    sensitive_data_released: bool
