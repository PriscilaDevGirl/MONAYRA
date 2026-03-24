from pydantic import BaseModel, EmailStr

from app.schemas.candidate import CandidateCreate, CandidatePublicRead
from app.schemas.company import CompanyCreate, CompanyRead


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenRead(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    account_id: int
    candidate_id: int | None = None
    company_id: int | None = None


class CandidateRegistration(BaseModel):
    profile: CandidateCreate
    password: str


class CompanyRegistration(BaseModel):
    profile: CompanyCreate
    password: str


class CandidateRegistrationRead(BaseModel):
    account_id: int
    role: str
    candidate: CandidatePublicRead


class CompanyRegistrationRead(BaseModel):
    account_id: int
    role: str
    company: CompanyRead
