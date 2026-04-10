from sqlmodel import Session, select

from app.models.auth import UserAccount
from app.models.company import Company
from app.models.job import JobApplication, JobPosting
from app.models.user import CandidateAsset, CandidateProfile, SensitiveCandidateProfile
from app.services.auth import hash_password
from app.services.matching import calculate_match


DEMO_CANDIDATE_EMAIL = "teste.candidata@monayra.app"
DEMO_COMPANY_EMAIL = "gestora.empresa@monayra.app"
DEMO_PASSWORD = "Monayra1!"


def seed_demo_data(session: Session) -> None:
    candidate_account = session.exec(select(UserAccount).where(UserAccount.email == DEMO_CANDIDATE_EMAIL)).first()
    company_account = session.exec(select(UserAccount).where(UserAccount.email == DEMO_COMPANY_EMAIL)).first()

    candidate = session.get(CandidateProfile, candidate_account.candidate_id) if candidate_account and candidate_account.candidate_id else None
    company = session.get(Company, company_account.company_id) if company_account and company_account.company_id else None

    if candidate is None:
        candidate = CandidateProfile(
            social_name="Mona Teste",
            self_declared_gender="mulher_trans",
            city="Sao Paulo",
            state="SP",
            headline="Analista de Operacoes em recolocacao",
            anonymity_level="partial",
            avatar_style="stylized-cat",
            avatar_palette="sunrise",
            avatar_accessory="star-pin",
            avatar_mood="confident",
            trajectory="Profissional com experiencia em atendimento, operacoes e organizacao de processos.",
            real_skills="Atendimento, CRM, Operacoes, Excel, Comunicacao",
            growth_story="Retomando carreira com foco em ambientes inclusivos e operacao estruturada.",
            years_out_of_market=1,
            wants_restart_mode=True,
        )
        session.add(candidate)
        session.commit()
        session.refresh(candidate)

        session.add(
            SensitiveCandidateProfile(
                candidate_id=candidate.id,
                legal_name="Monayra Teste",
                email=DEMO_CANDIDATE_EMAIL,
                phone="11999990001",
                linkedin_url="https://linkedin.com/in/monayra-teste",
                consent_to_share_after_hire=True,
            )
        )
        session.add(
            CandidateAsset(
                candidate_id=candidate.id,
                portfolio_url="https://portfolio.monayra.app/mona",
            )
        )
        session.commit()

    if candidate_account is None:
        candidate_account = UserAccount(
            email=DEMO_CANDIDATE_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
            role="candidate",
            candidate_id=candidate.id,
        )
        session.add(candidate_account)
        session.commit()

    if company is None:
        company = Company(
            name="Monayra Gestora Demo",
            sector="Tecnologia e Operacoes",
            website="https://monayra.app",
            inclusive_commitments="Contratacao inclusiva com feedback humanizado, criterios claros e revisao de vies.",
            contact_email=DEMO_COMPANY_EMAIL,
            bias_training_enabled=True,
            inclusive_seal=True,
        )
        session.add(company)
        session.commit()
        session.refresh(company)

    if company_account is None:
        company_account = UserAccount(
            email=DEMO_COMPANY_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
            role="company",
            company_id=company.id,
        )
        session.add(company_account)
        session.commit()

    job = session.exec(select(JobPosting).where(JobPosting.company_id == company.id)).first()
    if job is None:
        job = JobPosting(
            company_id=company.id,
            title="Analista de Operacoes Inclusivas",
            location="Sao Paulo",
            work_model="hibrido",
            employment_type="clt",
            summary="Atuar no acompanhamento operacional do funil e experiencia de candidatas.",
            responsibilities="Organizar pipeline, atualizar status, apoiar comunicacao com candidatas e liderancas.",
            required_skills="Atendimento, Operacoes, Organizacao, Comunicacao",
            preferred_skills="CRM, Excel, Experiencia do cliente",
            salary_range="R$ 3.500 a R$ 4.500",
            inclusive_notes="Processo com feedback humanizado e criterios claros.",
        )
        session.add(job)
        session.commit()
        session.refresh(job)

    application = session.exec(
        select(JobApplication).where(
            JobApplication.candidate_id == candidate.id,
            JobApplication.job_id == job.id,
        )
    ).first()
    if application is None:
        scores = calculate_match(candidate, job)
        application = JobApplication(
            candidate_id=candidate.id,
            job_id=job.id,
            **scores,
        )
        session.add(application)
        session.commit()
