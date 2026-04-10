export type Session = {
  access_token: string;
  token_type: string;
  role: "candidate" | "company";
  account_id: number;
  candidate_id?: number | null;
  company_id?: number | null;
};

export type CandidateProfile = {
  id: number;
  social_name: string;
  self_declared_gender: string;
  city: string;
  state: string;
  headline: string;
  anonymity_level: string;
  avatar_style: string;
  avatar_palette: string;
  avatar_accessory: string;
  avatar_mood: string;
  trajectory: string;
  real_skills: string;
  growth_story: string;
  years_out_of_market: number;
  wants_restart_mode: boolean;
  audio_pitch_url?: string | null;
  video_pitch_url?: string | null;
};

export type CandidateDashboard = {
  profile: CandidateProfile;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  resume_file_name?: string | null;
};

export type SensitiveCandidateProfile = {
  legal_name: string;
  email: string;
  phone: string;
  document_id?: string | null;
  linkedin_url?: string | null;
  consent_to_share_after_hire: boolean;
};

export type CompanyProfile = {
  id: number;
  name: string;
  sector: string;
  website?: string | null;
  inclusive_commitments: string;
  contact_email: string;
  bias_training_enabled: boolean;
  inclusive_seal: boolean;
};

export type JobPosting = {
  id: number;
  company_id: number;
  title: string;
  location: string;
  work_model: string;
  employment_type: string;
  summary: string;
  responsibilities: string;
  required_skills: string;
  preferred_skills: string;
  salary_range?: string | null;
  inclusive_notes: string;
  is_active: boolean;
};

export type JobApplication = {
  id: number;
  candidate_id: number;
  job_id: number;
  stage: string;
  compatibility_score: number;
  growth_score: number;
  inclusion_score: number;
  recruiter_feedback?: string | null;
  candidate_feedback?: string | null;
  sensitive_data_released: boolean;
};

export type CompanyDashboard = {
  company: CompanyProfile;
  open_positions: number;
  applications_in_pipeline: number;
  average_compatibility_score: number;
  bias_alert: string;
};

export type CandidateApplicationDetails = JobApplication & {
  job: JobPosting;
  company: CompanyProfile;
};

export type CompanyApplicationDetails = JobApplication & {
  job: JobPosting;
  candidate: CandidateProfile;
};

export type CandidateRegistrationPayload = {
  profile: {
    social_name: string;
    self_declared_gender: string;
    city: string;
    state: string;
    headline: string;
    anonymity_level: string;
    avatar_style: string;
    avatar_palette: string;
    avatar_accessory: string;
    avatar_mood: string;
    trajectory: string;
    real_skills: string;
    growth_story: string;
    years_out_of_market: number;
    wants_restart_mode: boolean;
    audio_pitch_url?: string | null;
    video_pitch_url?: string | null;
    legal_name: string;
    email: string;
    phone: string;
    document_id?: string | null;
    linkedin_url?: string | null;
    portfolio_url?: string | null;
    resume_file_name?: string | null;
    resume_pdf_base64?: string | null;
    consent_to_share_after_hire: boolean;
  };
  password: string;
};

export type CompanyRegistrationPayload = {
  profile: {
    name: string;
    sector: string;
    website?: string | null;
    inclusive_commitments: string;
    contact_email: string;
    bias_training_enabled: boolean;
    inclusive_seal: boolean;
  };
  password: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");

function getApiBaseUrl() {
  return API_BASE_URL;
}

async function request<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.detail || "Nao foi possivel concluir a requisicao.");
  }

  return data as T;
}

export const api = {
  registerCandidate(payload: CandidateRegistrationPayload) {
    return request<{ account_id: number; role: string; candidate: CandidateProfile }>("/auth/register/candidate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  registerCompany(payload: CompanyRegistrationPayload) {
    return request<{ account_id: number; role: string; company: CompanyProfile }>("/auth/register/company", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload: { email: string; password: string }) {
    return request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  me(token: string) {
    return request<Session>("/auth/me", { token });
  },
  getCandidateDashboard(token: string) {
    return request<CandidateDashboard>("/auth/me/candidate", { token });
  },
  getCompanyDashboard(token: string) {
    return request<CompanyDashboard>("/auth/me/company", { token });
  },
  listJobs() {
    return request<JobPosting[]>("/jobs");
  },
  listCandidates() {
    return request<CandidateProfile[]>("/candidates");
  },
  listCompanies() {
    return request<CompanyProfile[]>("/companies");
  },
  listApplications() {
    return request<JobApplication[]>("/applications");
  },
  listMyCandidateApplications(token: string) {
    return request<CandidateApplicationDetails[]>("/applications/me/candidate", { token });
  },
  listMyCompanyApplications(token: string) {
    return request<CompanyApplicationDetails[]>("/applications/me/company", { token });
  },
  createJob(payload: Omit<JobPosting, "id" | "is_active">, token: string) {
    return request<JobPosting>("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },
  applyToJob(payload: { candidate_id: number; job_id: number }) {
    return request<JobApplication>("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateApplicationStage(applicationId: number, payload: { stage: string; recruiter_feedback?: string }, token: string) {
    return request<JobApplication>(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    });
  },
  getSensitiveCandidateData(candidateId: number, applicationId: number, token: string) {
    return request<SensitiveCandidateProfile>(`/candidates/${candidateId}/sensitive?application_id=${applicationId}`, {
      token,
    });
  },
  getLegacyCompanyDashboard(companyId: number, token: string) {
    return request<Record<string, unknown>>(`/dashboard/company/${companyId}`, { token });
  },
};
