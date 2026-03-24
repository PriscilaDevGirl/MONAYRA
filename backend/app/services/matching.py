from app.models.job import JobPosting
from app.models.user import CandidateProfile


def _contains_any(text: str, terms: list[str]) -> int:
    normalized = text.lower()
    return sum(1 for term in terms if term.lower() in normalized)


def calculate_match(candidate: CandidateProfile, job: JobPosting) -> dict[str, float]:
    skill_hits = _contains_any(candidate.real_skills, job.required_skills.split(","))
    preferred_hits = _contains_any(candidate.real_skills, job.preferred_skills.split(","))

    compatibility = min(100.0, 40.0 + (skill_hits * 15.0) + (preferred_hits * 5.0))
    growth = min(100.0, 45.0 + (12.0 if candidate.wants_restart_mode else 0.0) + (candidate.years_out_of_market * 2.0))
    inclusion = 80.0

    if candidate.avatar_style and candidate.anonymity_level in {"partial", "high"}:
        inclusion += 5.0

    return {
        "compatibility_score": round(compatibility, 2),
        "growth_score": round(growth, 2),
        "inclusion_score": round(min(inclusion, 100.0), 2),
    }
