from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.database import create_db_and_tables, get_session
from app.models.auth import UserAccount
from app.models.company import Company
from app.models.job import JobApplication, JobPosting
from app.models.user import CandidateAsset, CandidateProfile, SensitiveCandidateProfile
from app.schemas.auth import (
    CandidateRegistration,
    CandidateRegistrationRead,
    CompanyRegistration,
    CompanyRegistrationRead,
    LoginRequest,
    TokenRead,
)
from app.schemas.candidate import CandidateCreate, CandidateDashboardRead, CandidatePublicRead, CandidateSensitiveRead
from app.schemas.company import CompanyCreate, CompanyDashboardRead, CompanyRead
from app.schemas.job import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationStageUpdate,
    CandidateApplicationRead,
    CompanyApplicationRead,
    JobCreate,
    JobRead,
)
from app.services.auth import (
    create_access_token,
    get_account_by_email,
    get_current_account,
    hash_password,
    require_role,
    verify_password,
)
from app.services.matching import calculate_match

api_router = APIRouter(prefix="/api")


@api_router.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


def _create_candidate_profile(payload: CandidateCreate, session: Session) -> CandidateProfile:
    candidate = CandidateProfile(
        social_name=payload.social_name,
        self_declared_gender=payload.self_declared_gender,
        city=payload.city,
        state=payload.state,
        headline=payload.headline,
        anonymity_level=payload.anonymity_level,
        avatar_style=payload.avatar_style,
        avatar_palette=payload.avatar_palette,
        avatar_accessory=payload.avatar_accessory,
        avatar_mood=payload.avatar_mood,
        trajectory=payload.trajectory,
        real_skills=payload.real_skills,
        growth_story=payload.growth_story,
        years_out_of_market=payload.years_out_of_market,
        wants_restart_mode=payload.wants_restart_mode,
        audio_pitch_url=payload.audio_pitch_url,
        video_pitch_url=payload.video_pitch_url,
    )
    session.add(candidate)
    session.commit()
    session.refresh(candidate)

    sensitive = SensitiveCandidateProfile(
        candidate_id=candidate.id,
        legal_name=payload.legal_name,
        email=payload.email,
        phone=payload.phone,
        document_id=payload.document_id,
        linkedin_url=payload.linkedin_url,
        consent_to_share_after_hire=payload.consent_to_share_after_hire,
    )
    session.add(sensitive)
    session.commit()

    assets = CandidateAsset(
        candidate_id=candidate.id,
        portfolio_url=payload.portfolio_url,
        resume_file_name=payload.resume_file_name,
        resume_pdf_base64=payload.resume_pdf_base64,
    )
    session.add(assets)
    session.commit()
    return candidate


@api_router.post("/auth/register/candidate", response_model=CandidateRegistrationRead, status_code=status.HTTP_201_CREATED)
def register_candidate(payload: CandidateRegistration, session: Session = Depends(get_session)) -> CandidateRegistrationRead:
    if get_account_by_email(session, payload.profile.email):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    candidate = _create_candidate_profile(payload.profile, session)
    account = UserAccount(
        email=payload.profile.email,
        hashed_password=hash_password(payload.password),
        role="candidate",
        candidate_id=candidate.id,
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    return CandidateRegistrationRead(account_id=account.id, role=account.role, candidate=candidate)


@api_router.post("/auth/register/company", response_model=CompanyRegistrationRead, status_code=status.HTTP_201_CREATED)
def register_company(payload: CompanyRegistration, session: Session = Depends(get_session)) -> CompanyRegistrationRead:
    if get_account_by_email(session, payload.profile.contact_email):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    company = Company(**payload.profile.model_dump())
    session.add(company)
    session.commit()
    session.refresh(company)

    account = UserAccount(
        email=payload.profile.contact_email,
        hashed_password=hash_password(payload.password),
        role="company",
        company_id=company.id,
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    return CompanyRegistrationRead(account_id=account.id, role=account.role, company=company)


@api_router.post("/auth/login", response_model=TokenRead)
def login(payload: LoginRequest, session: Session = Depends(get_session)) -> TokenRead:
    account = get_account_by_email(session, str(payload.email))
    if not account or not verify_password(payload.password, account.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(subject=account.email, role=account.role)
    return TokenRead(
        access_token=token,
        role=account.role,
        account_id=account.id,
        candidate_id=account.candidate_id,
        company_id=account.company_id,
    )


@api_router.get("/auth/me", response_model=TokenRead)
def me(account: UserAccount = Depends(get_current_account)) -> TokenRead:
    return TokenRead(
        access_token="session-active",
        role=account.role,
        account_id=account.id,
        candidate_id=account.candidate_id,
        company_id=account.company_id,
    )


@api_router.get("/auth/me/candidate", response_model=CandidateDashboardRead)
def me_candidate(
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("candidate")),
) -> CandidateDashboardRead:
    if account.candidate_id is None:
        raise HTTPException(status_code=404, detail="Candidate account is not linked to a profile.")

    candidate = session.get(CandidateProfile, account.candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")

    sensitive = session.exec(
        select(SensitiveCandidateProfile).where(SensitiveCandidateProfile.candidate_id == candidate.id)
    ).first()
    assets = session.exec(
        select(CandidateAsset).where(CandidateAsset.candidate_id == candidate.id)
    ).first()

    return CandidateDashboardRead(
        profile=candidate,
        linkedin_url=sensitive.linkedin_url if sensitive else None,
        portfolio_url=assets.portfolio_url if assets else None,
        resume_file_name=assets.resume_file_name if assets else None,
    )


@api_router.get("/auth/me/company", response_model=CompanyDashboardRead)
def me_company(
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> CompanyDashboardRead:
    if account.company_id is None:
        raise HTTPException(status_code=404, detail="Company account is not linked to a company profile.")

    company = session.get(Company, account.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found.")

    jobs = session.exec(select(JobPosting).where(JobPosting.company_id == company.id)).all()
    job_ids = {job.id for job in jobs}
    applications = session.exec(select(JobApplication)).all()
    filtered_apps = [app for app in applications if app.job_id in job_ids]

    return CompanyDashboardRead(
        company=company,
        open_positions=len([job for job in jobs if job.is_active]),
        applications_in_pipeline=len(filtered_apps),
        average_compatibility_score=round(
            sum(app.compatibility_score for app in filtered_apps) / len(filtered_apps), 2
        )
        if filtered_apps
        else 0.0,
        bias_alert="Review job requirements for unnecessary experience barriers.",
    )


@api_router.post("/candidates", response_model=CandidatePublicRead, status_code=status.HTTP_201_CREATED)
def create_candidate(payload: CandidateCreate, session: Session = Depends(get_session)) -> CandidateProfile:
    return _create_candidate_profile(payload, session)


@api_router.get("/candidates", response_model=list[CandidatePublicRead])
def list_candidates(session: Session = Depends(get_session)) -> list[CandidateProfile]:
    return session.exec(select(CandidateProfile)).all()


@api_router.get("/candidates/{candidate_id}/sensitive", response_model=CandidateSensitiveRead)
def get_sensitive_candidate_data(
    candidate_id: int,
    application_id: int,
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> SensitiveCandidateProfile:
    application = session.get(JobApplication, application_id)
    if not application or application.candidate_id != candidate_id:
        raise HTTPException(status_code=404, detail="Application not found for candidate.")

    if account.company_id is None:
        raise HTTPException(status_code=403, detail="Company account is not linked to a company profile.")

    job = session.get(JobPosting, application.job_id)
    if not job or job.company_id != account.company_id:
        raise HTTPException(status_code=403, detail="This application does not belong to your company.")

    if application.stage != "hired":
        raise HTTPException(
            status_code=403,
            detail="Sensitive data is only available after confirmed hiring.",
        )

    sensitive = session.exec(
        select(SensitiveCandidateProfile).where(SensitiveCandidateProfile.candidate_id == candidate_id)
    ).first()
    if not sensitive:
        raise HTTPException(status_code=404, detail="Sensitive candidate profile not found.")

    if not sensitive.consent_to_share_after_hire:
        raise HTTPException(status_code=403, detail="Candidate did not authorize sensitive data sharing.")

    application.sensitive_data_released = True
    session.add(application)
    session.commit()
    return sensitive


@api_router.post("/companies", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
def create_company(
    payload: CompanyCreate,
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> Company:
    company = Company(**payload.model_dump())
    session.add(company)
    session.commit()
    session.refresh(company)
    return company


@api_router.get("/companies", response_model=list[CompanyRead])
def list_companies(session: Session = Depends(get_session)) -> list[Company]:
    return session.exec(select(Company)).all()


@api_router.post("/jobs", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> JobPosting:
    if account.company_id != payload.company_id:
        raise HTTPException(status_code=403, detail="You can only publish jobs for your own company.")

    company = session.get(Company, payload.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    job = JobPosting(**payload.model_dump())
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


@api_router.get("/jobs", response_model=list[JobRead])
def list_jobs(session: Session = Depends(get_session)) -> list[JobPosting]:
    return session.exec(select(JobPosting)).all()


@api_router.post("/applications", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, session: Session = Depends(get_session)) -> JobApplication:
    candidate = session.get(CandidateProfile, payload.candidate_id)
    job = session.get(JobPosting, payload.job_id)
    if not candidate or not job:
        raise HTTPException(status_code=404, detail="Candidate or job not found.")

    scores = calculate_match(candidate, job)
    application = JobApplication(candidate_id=payload.candidate_id, job_id=payload.job_id, **scores)
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@api_router.get("/applications", response_model=list[ApplicationRead])
def list_applications(session: Session = Depends(get_session)) -> list[JobApplication]:
    statement = select(JobApplication).order_by(JobApplication.compatibility_score.desc())
    return session.exec(statement).all()


@api_router.get("/applications/me/candidate", response_model=list[CandidateApplicationRead])
def list_my_candidate_applications(
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("candidate")),
) -> list[CandidateApplicationRead]:
    if account.candidate_id is None:
        raise HTTPException(status_code=404, detail="Candidate account is not linked to a profile.")

    applications = session.exec(
        select(JobApplication).where(JobApplication.candidate_id == account.candidate_id)
    ).all()

    result: list[CandidateApplicationRead] = []
    for application in applications:
        job = session.get(JobPosting, application.job_id)
        if not job:
            continue
        company = session.get(Company, job.company_id)
        if not company:
            continue

        result.append(
            CandidateApplicationRead(
                **application.model_dump(),
                job=job,
                company=company,
            )
        )

    return result


@api_router.get("/applications/me/company", response_model=list[CompanyApplicationRead])
def list_my_company_applications(
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> list[CompanyApplicationRead]:
    if account.company_id is None:
        raise HTTPException(status_code=404, detail="Company account is not linked to a profile.")

    jobs = session.exec(select(JobPosting).where(JobPosting.company_id == account.company_id)).all()
    job_map = {job.id: job for job in jobs}
    applications = session.exec(select(JobApplication)).all()

    result: list[CompanyApplicationRead] = []
    for application in applications:
        job = job_map.get(application.job_id)
        if not job:
            continue

        candidate = session.get(CandidateProfile, application.candidate_id)
        if not candidate:
            continue

        result.append(
            CompanyApplicationRead(
                **application.model_dump(),
                job=job,
                candidate=candidate,
            )
        )

    return result


@api_router.patch("/applications/{application_id}", response_model=ApplicationRead)
def update_application_stage(
    application_id: int,
    payload: ApplicationStageUpdate,
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> JobApplication:
    application = session.get(JobApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    job = session.get(JobPosting, application.job_id)
    if not job or job.company_id != account.company_id:
        raise HTTPException(status_code=403, detail="You can only update applications for your own jobs.")

    application.stage = payload.stage
    application.recruiter_feedback = payload.recruiter_feedback
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@api_router.get("/dashboard/company/{company_id}")
def company_dashboard(
    company_id: int,
    session: Session = Depends(get_session),
    account: UserAccount = Depends(require_role("company")),
) -> dict:
    if account.company_id != company_id:
        raise HTTPException(status_code=403, detail="You can only access your own company dashboard.")

    company = session.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    jobs = session.exec(select(JobPosting).where(JobPosting.company_id == company_id)).all()
    applications = session.exec(select(JobApplication)).all()
    company_job_ids = {job.id for job in jobs}
    filtered_apps = [app for app in applications if app.job_id in company_job_ids]

    return {
        "company": company.name,
        "inclusive_seal": company.inclusive_seal,
        "bias_training_enabled": company.bias_training_enabled,
        "open_positions": len([job for job in jobs if job.is_active]),
        "applications_in_pipeline": len(filtered_apps),
        "average_compatibility_score": round(
            sum(app.compatibility_score for app in filtered_apps) / len(filtered_apps), 2
        )
        if filtered_apps
        else 0.0,
        "bias_alert": "Review job requirements for unnecessary experience barriers.",
    }
