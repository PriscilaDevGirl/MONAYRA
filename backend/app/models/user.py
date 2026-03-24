from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class CandidateProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    social_name: str
    self_declared_gender: str
    city: str
    state: str
    headline: str
    anonymity_level: str = Field(default="partial")
    avatar_style: str = Field(default="stylized-cat")
    avatar_palette: str = Field(default="sunrise")
    avatar_accessory: str = Field(default="star-pin")
    avatar_mood: str = Field(default="confident")
    trajectory: str
    real_skills: str
    growth_story: str
    years_out_of_market: int = Field(default=0, ge=0)
    wants_restart_mode: bool = Field(default=False)
    audio_pitch_url: Optional[str] = None
    video_pitch_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class SensitiveCandidateProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidateprofile.id", unique=True, index=True)
    legal_name: str
    email: str
    phone: str
    document_id: Optional[str] = None
    linkedin_url: Optional[str] = None
    consent_to_share_after_hire: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
