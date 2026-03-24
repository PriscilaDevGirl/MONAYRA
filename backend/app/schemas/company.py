from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    sector: str
    website: str | None = None
    inclusive_commitments: str
    contact_email: str
    bias_training_enabled: bool = True
    inclusive_seal: bool = False


class CompanyRead(CompanyCreate):
    id: int
