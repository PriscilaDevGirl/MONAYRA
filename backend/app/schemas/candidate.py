from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CandidateCreate(BaseModel):
    social_name: str = Field(min_length=2)
    self_declared_gender: str
    city: str
    state: str
    headline: str
    anonymity_level: str = "partial"
    avatar_style: str = "stylized-cat"
    avatar_palette: str = "sunrise"
    avatar_accessory: str = "star-pin"
    avatar_mood: str = "confident"
    trajectory: str
    real_skills: str
    growth_story: str
    years_out_of_market: int = 0
    wants_restart_mode: bool = False
    audio_pitch_url: Optional[str] = None
    video_pitch_url: Optional[str] = None
    legal_name: str
    email: str
    phone: str
    document_id: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_file_name: Optional[str] = None
    resume_pdf_base64: Optional[str] = None
    consent_to_share_after_hire: bool = True


class CandidatePublicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    social_name: str
    self_declared_gender: str
    city: str
    state: str
    headline: str
    anonymity_level: str
    avatar_style: str
    avatar_palette: str
    avatar_accessory: str
    avatar_mood: str
    trajectory: str
    real_skills: str
    growth_story: str
    years_out_of_market: int
    wants_restart_mode: bool
    audio_pitch_url: Optional[str]
    video_pitch_url: Optional[str]


class CandidateSensitiveRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    legal_name: str
    email: str
    phone: str
    document_id: Optional[str]
    linkedin_url: Optional[str]
    consent_to_share_after_hire: bool


class CandidateDashboardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    profile: CandidatePublicRead
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_file_name: Optional[str] = None
