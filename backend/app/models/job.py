from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class JobPosting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id", index=True)
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
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class JobApplication(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidateprofile.id", index=True)
    job_id: int = Field(foreign_key="jobposting.id", index=True)
    stage: str = Field(default="triage")
    compatibility_score: float = Field(default=0.0, ge=0.0, le=100.0)
    growth_score: float = Field(default=0.0, ge=0.0, le=100.0)
    inclusion_score: float = Field(default=0.0, ge=0.0, le=100.0)
    recruiter_feedback: Optional[str] = None
    candidate_feedback: Optional[str] = None
    sensitive_data_released: bool = Field(default=False)
    applied_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
