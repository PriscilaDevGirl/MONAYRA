from pydantic import BaseModel, ConfigDict


class CompanyCreate(BaseModel):
    name: str
    sector: str
    website: str | None = None
    inclusive_commitments: str
    contact_email: str
    bias_training_enabled: bool = True
    inclusive_seal: bool = False


class CompanyRead(CompanyCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CompanyDashboardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    company: CompanyRead
    open_positions: int
    applications_in_pipeline: int
    average_compatibility_score: float
    bias_alert: str
