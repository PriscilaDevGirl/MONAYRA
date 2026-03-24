from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Company(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    sector: str
    website: Optional[str] = None
    inclusive_commitments: str
    contact_email: str
    bias_training_enabled: bool = Field(default=True)
    inclusive_seal: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
