from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class UserAccount(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: str = Field(index=True)
    candidate_id: Optional[int] = Field(default=None, foreign_key="candidateprofile.id")
    company_id: Optional[int] = Field(default=None, foreign_key="company.id")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
