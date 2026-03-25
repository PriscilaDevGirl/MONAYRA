import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cat, Users } from "lucide-react";

import { CatAvatar } from "@/components/CatAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  api,
  type CandidateApplicationDetails,
  type CandidateDashboard,
  type CandidateProfile,
  type CompanyApplicationDetails,
  type CompanyDashboard,
  type CompanyProfile,
  type JobPosting,
  type SensitiveCandidateProfile,
  type Session,
} from "@/lib/api";

const SESSION_KEY = "monayra.session";
const stages = ["applied", "screening", "interview", "offer", "hired"];
const candidateBase = {
  social_name: "",
  self_declared_gender: "",
  city: "",
  state: "",
  headline: "",
  anonymity_level: "partial",
  avatar_style: "stylized-cat",
  avatar_palette: "sunrise",
  avatar_accessory: "star-pin",
  avatar_mood: "confident",
  trajectory: "",
  real_skills: "",
  growth_story: "",
  years_out_of_market: 0,
  wants_restart_mode: true,
  audio_pitch_url: "",
  video_pitch_url: "",
  legal_name: "",
  email: "",
  phone: "",
  document_id: "",
  linkedin_url: "",
  portfolio_url: "",
  resume_file_name: "",
  consent_to_share_after_hire: true,
  password: "",
};
const companyBase = {
  name: "",
  sector: "",
  website: "",
  inclusive_commitments: "",
  contact_email: "",
  bias_training_enabled: true,
  inclusive_seal: false,
  password: "",
};
const jobBase = {
  company_id: "",
  title: "",
  location: "",
  work_model: "remoto",
  employment_type: "clt",
  summary: "",
  responsibilities: "",
  required_skills: "",
  preferred_skills: "",
  salary_range: "",
  inclusive_notes: "",
};
const companyFiltersBase = {
  search: "",
  stage: "all",
  jobId: "all",
};
const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapa" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceara" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espirito Santo" },
  { value: "GO", label: "Goias" },
  { value: "MA", label: "Maranhao" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Para" },
  { value: "PB", label: "Paraiba" },
  { value: "PR", label: "Parana" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piaui" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondonia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "Sao Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];
const genderOptions = [
  { value: "mulher_cis", label: "Mulher cis" },
  { value: "mulher_trans", label: "Mulher trans" },
  { value: "travesti", label: "Travesti" },
];
const avatarStyleOptions = [
  { value: "stylized-cat", label: "Gata estilizada" },
  { value: "cyber-cat", label: "Gata cyber" },
  { value: "soft-cat", label: "Gata delicada" },
  { value: "guardian-cat", label: "Gata guardia" },
  { value: "moon-cat", label: "Gata lunar" },
];
const avatarPaletteOptions = [
  { value: "sunrise", label: "Nascer do sol" },
  { value: "aurora", label: "Aurora" },
  { value: "midnight", label: "Meia-noite" },
  { value: "blossom", label: "Floracao" },
];
const avatarAccessoryOptions = [
  { value: "star-pin", label: "Broche de estrela" },
  { value: "crown", label: "Coroa" },
  { value: "headset", label: "Headset" },
  { value: "leaf-tag", label: "Folha" },
  { value: "shield-badge", label: "Escudo" },
];
const avatarMoodOptions = [
  { value: "confident", label: "Confiante" },
  { value: "playful", label: "Brincalhona" },
  { value: "focused", label: "Focada" },
  { value: "calm", label: "Calma" },
];

function getStoredSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null") as Session | null;
  } catch {
    return null;
  }
}

function setStoredSession(session: Session | null) {
  if (!session) window.localStorage.removeItem(SESSION_KEY);
  else window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function AvatarSelect({
  value,
  onValueChange,
  items,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecionar" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const Platform = () => {
  const [tab, setTab] = useState("candidate");
  const [session, setSession] = useState<Session | null>(() => (typeof window === "undefined" ? null : getStoredSession()));
  const [candidateForm, setCandidateForm] = useState(candidateBase);
  const [companyForm, setCompanyForm] = useState(companyBase);
  const [jobForm, setJobForm] = useState(jobBase);
  const [candidateLogin, setCandidateLogin] = useState({ email: "", password: "" });
  const [companyLogin, setCompanyLogin] = useState({ email: "", password: "" });
  const [companyFilters, setCompanyFilters] = useState(companyFiltersBase);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [candidateDashboard, setCandidateDashboard] = useState<CandidateDashboard | null>(null);
  const [companyDashboard, setCompanyDashboard] = useState<CompanyDashboard | null>(null);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplicationDetails[]>([]);
  const [companyApplications, setCompanyApplications] = useState<CompanyApplicationDetails[]>([]);
  const [status, setStatus] = useState("Fluxo protegido de cadastro, triagem e contratação ativo.");
  const [busy, setBusy] = useState(false);
  const [stageDrafts, setStageDrafts] = useState<Record<number, string>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<number, string>>({});
  const [sensitiveMap, setSensitiveMap] = useState<Record<number, SensitiveCandidateProfile>>({});

  const currentCandidate = useMemo(() => candidateDashboard?.profile || null, [candidateDashboard]);
  const currentCompany = useMemo(() => companyDashboard?.company || null, [companyDashboard]);
  const companyJobs = useMemo(
    () => jobs.filter((item) => item.company_id === session?.company_id),
    [jobs, session?.company_id],
  );
  const filteredCompanyApplications = useMemo(() => {
    return companyApplications.filter((application) => {
      const matchesStage = companyFilters.stage === "all" || application.stage === companyFilters.stage;
      const matchesJob = companyFilters.jobId === "all" || String(application.job.id) === companyFilters.jobId;
      const haystack = `${application.candidate.social_name} ${application.candidate.headline} ${application.job.title} ${application.candidate.real_skills}`.toLowerCase();
      const matchesSearch = !companyFilters.search || haystack.includes(companyFilters.search.toLowerCase());
      return matchesStage && matchesJob && matchesSearch;
    });
  }, [companyApplications, companyFilters]);

  useEffect(() => setStoredSession(session), [session]);
  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    if (session?.access_token) {
      refreshSessionData(session);
    } else {
      setCandidateDashboard(null);
      setCompanyDashboard(null);
      setCandidateApplications([]);
      setCompanyApplications([]);
    }
  }, [session]);

  async function refresh() {
    try {
      const [nextJobs, nextCandidates, nextCompanies] = await Promise.all([
        api.listJobs(),
        api.listCandidates(),
        api.listCompanies(),
      ]);
      setJobs(nextJobs);
      setCandidates(nextCandidates);
      setCompanies(nextCompanies);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel carregar a plataforma.");
    }
  }

  async function refreshSessionData(nextSession: Session) {
    try {
      if (nextSession.role === "candidate") {
        const [dashboard, applications] = await Promise.all([
          api.getCandidateDashboard(nextSession.access_token),
          api.listMyCandidateApplications(nextSession.access_token),
        ]);
        setCandidateDashboard(dashboard);
        setCandidateApplications(applications);
      }

      if (nextSession.role === "company") {
        const [dashboard, applications] = await Promise.all([
          api.getCompanyDashboard(nextSession.access_token),
          api.listMyCompanyApplications(nextSession.access_token),
        ]);
        setCompanyDashboard(dashboard);
        setCompanyApplications(applications);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel carregar os dados da sessao.");
    }
  }

  function updateSetter(setter: (value: any) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, type, value, checked } = event.target;
      setter((current: any) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    };
  }

  function validatePassword(password: string) {
    if (password.length < 8 || password.length > 12) {
      return "A senha deve ter entre 8 e 12 caracteres.";
    }
    if (!/[A-Z]/.test(password)) {
      return "A senha precisa ter pelo menos uma letra maiuscula.";
    }
    if (!/[a-z]/.test(password)) {
      return "A senha precisa ter pelo menos uma letra minuscula.";
    }
    if (!/[0-9]/.test(password)) {
      return "A senha precisa ter pelo menos um numero.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "A senha precisa ter pelo menos um caractere especial.";
    }
    return null;
  }

  function validateCandidateForm() {
    const passwordError = validatePassword(candidateForm.password);
    if (passwordError) return passwordError;
    if (!candidateForm.state) return "Selecione o estado.";
    if (!candidateForm.self_declared_gender) return "Selecione a identidade de genero.";
    if (candidateForm.linkedin_url && !/^https?:\/\//i.test(candidateForm.linkedin_url)) {
      return "Informe o LinkedIn com http:// ou https://.";
    }
    if (candidateForm.portfolio_url && !/^https?:\/\//i.test(candidateForm.portfolio_url)) {
      return "Informe o portfolio com http:// ou https://.";
    }
    return null;
  }

  function handleResumeFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setResumeFile(null);
      setCandidateForm((current) => ({ ...current, resume_file_name: "" }));
      return;
    }
    if (file.type !== "application/pdf") {
      setStatus("O curriculo deve ser enviado em PDF.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("O PDF do curriculo deve ter no maximo 5 MB.");
      event.target.value = "";
      return;
    }
    setResumeFile(file);
    setCandidateForm((current) => ({ ...current, resume_file_name: file.name }));
    setStatus(`Curriculo ${file.name} pronto para o cadastro.`);
  }

  async function registerCandidate(event: FormEvent) {
    event.preventDefault();
    const validationError = validateCandidateForm();
    if (validationError) {
      setStatus(validationError);
      return;
    }
    setBusy(true);
    setStatus("Criando perfil com avatar protegido.");
    try {
      await api.registerCandidate({
        profile: {
          ...candidateForm,
          years_out_of_market: Number(candidateForm.years_out_of_market || 0),
          document_id: candidateForm.document_id || null,
          linkedin_url: candidateForm.linkedin_url || null,
          audio_pitch_url: resumeFile ? `arquivo:${candidateForm.resume_file_name}` : candidateForm.audio_pitch_url || null,
          video_pitch_url: candidateForm.portfolio_url || candidateForm.video_pitch_url || null,
        },
        password: candidateForm.password,
      });
      const nextSession = await api.login({ email: candidateForm.email, password: candidateForm.password });
      setSession(nextSession);
      setCandidateForm(candidateBase);
      setResumeFile(null);
      await refresh();
      await refreshSessionData(nextSession);
      setStatus("Candidata cadastrada e autenticada. LinkedIn, portfolio e referencia do curriculo foram enviados.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha ao cadastrar candidata.");
    } finally {
      setBusy(false);
    }
  }

  async function registerCompany(event: FormEvent) {
    event.preventDefault();
    const passwordError = validatePassword(companyForm.password);
    if (passwordError) {
      setStatus(passwordError);
      return;
    }
    setBusy(true);
    setStatus("Criando conta da empresa.");
    try {
      const result = await api.registerCompany({
        profile: {
          name: companyForm.name,
          sector: companyForm.sector,
          website: companyForm.website || null,
          inclusive_commitments: companyForm.inclusive_commitments,
          contact_email: companyForm.contact_email,
          bias_training_enabled: companyForm.bias_training_enabled,
          inclusive_seal: companyForm.inclusive_seal,
        },
        password: companyForm.password,
      });
      const nextSession = await api.login({ email: companyForm.contact_email, password: companyForm.password });
      setSession(nextSession);
      setCompanyForm(companyBase);
      setJobForm((current) => ({ ...current, company_id: String(result.company.id) }));
      await refresh();
      await refreshSessionData(nextSession);
      setStatus("Empresa pronta para publicar vagas.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha ao cadastrar empresa.");
    } finally {
      setBusy(false);
    }
  }

  async function loginAsCandidate(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const nextSession = await api.login(candidateLogin);
      setSession(nextSession);
      await refresh();
      await refreshSessionData(nextSession);
      setStatus("Sessao da candidata iniciada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha no login.");
    } finally {
      setBusy(false);
    }
  }

  async function loginAsCompany(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const next = await api.login(companyLogin);
      setSession(next);
      setJobForm((current) => ({ ...current, company_id: next.company_id ? String(next.company_id) : current.company_id }));
      await refresh();
      await refreshSessionData(next);
      setStatus("Sessao da empresa iniciada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha no login.");
    } finally {
      setBusy(false);
    }
  }

  async function createJob(event: FormEvent) {
    event.preventDefault();
    if (!session?.access_token || session.role !== "company") {
      setStatus("Entre como empresa para publicar vagas.");
      return;
    }
    setBusy(true);
    try {
      await api.createJob(
        {
          company_id: Number(jobForm.company_id || session.company_id),
          title: jobForm.title,
          location: jobForm.location,
          work_model: jobForm.work_model,
          employment_type: jobForm.employment_type,
          summary: jobForm.summary,
          responsibilities: jobForm.responsibilities,
          required_skills: jobForm.required_skills,
          preferred_skills: jobForm.preferred_skills,
          salary_range: jobForm.salary_range || null,
          inclusive_notes: jobForm.inclusive_notes,
        },
        session.access_token,
      );
      setJobForm((current) => ({ ...jobBase, company_id: current.company_id }));
      await refresh();
      await refreshSessionData(session);
      setStatus("Vaga publicada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha ao publicar vaga.");
    } finally {
      setBusy(false);
    }
  }

  async function applyToJob(jobId: number) {
    if (!session?.candidate_id) {
      setStatus("Entre como candidata para se candidatar.");
      return;
    }
    setBusy(true);
    try {
      await api.applyToJob({ candidate_id: session.candidate_id, job_id: jobId });
      await refresh();
      await refreshSessionData(session);
      setStatus("Candidatura enviada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha ao candidatar.");
    } finally {
      setBusy(false);
    }
  }

  async function saveStage(applicationId: number) {
    if (!session?.access_token || session.role !== "company" || !stageDrafts[applicationId]) return;
    setBusy(true);
    try {
      await api.updateApplicationStage(
        applicationId,
        { stage: stageDrafts[applicationId], recruiter_feedback: feedbackDrafts[applicationId] || undefined },
        session.access_token,
      );
      await refreshSessionData(session);
      setStatus("Etapa atualizada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Falha ao atualizar etapa.");
    } finally {
      setBusy(false);
    }
  }

  async function unlockSensitive(candidateId: number, applicationId: number) {
    if (!session?.access_token || session.role !== "company") return;
    setBusy(true);
    try {
      const data = await api.getSensitiveCandidateData(candidateId, applicationId, session.access_token);
      setSensitiveMap((current) => ({ ...current, [applicationId]: data }));
      setStatus("Dados sensiveis liberados.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Os dados seguem bloqueados até a contratação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-14">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 border-white/10 bg-white/5">Produto operacional</Badge>
              <h1 className="font-display text-4xl font-bold md:text-6xl">Contratação tipo ATS com avatar de gato e privacidade por padrão.</h1>
              <p className="mt-4 text-muted-foreground">A candidata cria um perfil de jogo, a empresa opera um funil tipo Gupy e os dados sensíveis só aparecem após contratação e consentimento.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MiniMetric title="Perfil de jogo" value="Avatar customizavel e narrativa profissional" />
              <MiniMetric title="Pipeline" value="Cadastro, triagem, entrevista, oferta e contratação" />
              <MiniMetric title="Dado protegido" value="Nome legal, email e documento bloqueados" />
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-muted-foreground">{status}</div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="candidate" className="gap-2">
              <Cat className="h-4 w-4" />
              Area da candidata
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Users className="h-4 w-4" />
              Area da empresa
            </TabsTrigger>
          </TabsList>
          <TabsContent value="candidate" className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="glass border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>{session?.role === "candidate" ? "Perfil da candidata" : "Cadastro da candidata"}</CardTitle>
                <CardDescription>Avatar de gato, trajetoria, habilidades e privacidade desde o primeiro contato.</CardDescription>
              </CardHeader>
              <CardContent>
                {session?.role === "candidate" && currentCandidate ? (
                  <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="space-y-4">
                      <CatAvatar style={currentCandidate.avatar_style} palette={currentCandidate.avatar_palette} accessory={currentCandidate.avatar_accessory} mood={currentCandidate.avatar_mood} size="lg" />
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-lg font-semibold">{currentCandidate.social_name}</p>
                        <p className="text-sm text-muted-foreground">{currentCandidate.headline}</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{currentCandidate.trajectory}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <MiniMetric title="Modo recomeco" value={currentCandidate.wants_restart_mode ? "Ativo" : "Inativo"} />
                      <MiniMetric title="Local" value={`${currentCandidate.city} - ${currentCandidate.state}`} />
                      <MiniMetric title="Anos fora do mercado" value={`${currentCandidate.years_out_of_market}`} />
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-muted-foreground">Habilidades</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {currentCandidate.real_skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => <Badge key={skill} variant="outline" className="border-white/10 bg-white/5">{skill}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="grid gap-4 md:grid-cols-2" onSubmit={registerCandidate}>
                    <div className="md:col-span-2 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-black/20 p-5">
                      <CatAvatar style={candidateForm.avatar_style} palette={candidateForm.avatar_palette} accessory={candidateForm.avatar_accessory} mood={candidateForm.avatar_mood} size="lg" />
                      <p className="text-sm text-muted-foreground">Preview do avatar publico</p>
                    </div>
                    <Input name="social_name" placeholder="Nome social" value={candidateForm.social_name} onChange={updateSetter(setCandidateForm)} required />
                    <Select value={candidateForm.self_declared_gender} onValueChange={(value) => setCandidateForm((current) => ({ ...current, self_declared_gender: value }))}>
                      <SelectTrigger><SelectValue placeholder="Identidade de genero" /></SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input name="headline" placeholder="Como voce quer se apresentar" value={candidateForm.headline} onChange={updateSetter(setCandidateForm)} required className="md:col-span-2" />
                    <Input name="city" placeholder="Cidade" value={candidateForm.city} onChange={updateSetter(setCandidateForm)} required />
                    <Select value={candidateForm.state} onValueChange={(value) => setCandidateForm((current) => ({ ...current, state: value }))}>
                      <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <AvatarSelect value={candidateForm.avatar_style} onValueChange={(value) => setCandidateForm((current) => ({ ...current, avatar_style: value }))} items={avatarStyleOptions} />
                    <AvatarSelect value={candidateForm.avatar_palette} onValueChange={(value) => setCandidateForm((current) => ({ ...current, avatar_palette: value }))} items={avatarPaletteOptions} />
                    <AvatarSelect value={candidateForm.avatar_accessory} onValueChange={(value) => setCandidateForm((current) => ({ ...current, avatar_accessory: value }))} items={avatarAccessoryOptions} />
                    <AvatarSelect value={candidateForm.avatar_mood} onValueChange={(value) => setCandidateForm((current) => ({ ...current, avatar_mood: value }))} items={avatarMoodOptions} />
                    <Textarea name="trajectory" placeholder="Trajetoria" value={candidateForm.trajectory} onChange={updateSetter(setCandidateForm)} required className="md:col-span-2" />
                    <Textarea name="real_skills" placeholder="Habilidades separadas por virgula" value={candidateForm.real_skills} onChange={updateSetter(setCandidateForm)} required className="md:col-span-2" />
                    <Textarea name="growth_story" placeholder="Historia de crescimento" value={candidateForm.growth_story} onChange={updateSetter(setCandidateForm)} required className="md:col-span-2" />
                    <Input name="linkedin_url" placeholder="LinkedIn" value={candidateForm.linkedin_url} onChange={updateSetter(setCandidateForm)} />
                    <Input name="portfolio_url" placeholder="Portfolio" value={candidateForm.portfolio_url} onChange={updateSetter(setCandidateForm)} />
                    <Input name="email" type="email" placeholder="Email protegido" value={candidateForm.email} onChange={updateSetter(setCandidateForm)} required />
                    <Input name="phone" placeholder="Telefone protegido" value={candidateForm.phone} onChange={updateSetter(setCandidateForm)} required />
                    <Input name="legal_name" placeholder="Nome legal protegido" value={candidateForm.legal_name} onChange={updateSetter(setCandidateForm)} required />
                    <Input name="password" type="password" placeholder="Senha" value={candidateForm.password} onChange={updateSetter(setCandidateForm)} required />
                    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <label className="mb-2 block text-sm text-muted-foreground">Curriculo em PDF</label>
                      <Input type="file" accept="application/pdf,.pdf" onChange={handleResumeFileChange} />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {candidateForm.resume_file_name ? `Arquivo selecionado: ${candidateForm.resume_file_name}` : "Aceita apenas PDF com ate 5 MB."}
                      </p>
                    </div>
                    <p className="md:col-span-2 text-xs text-muted-foreground">
                      Senha segura: 8 a 12 caracteres, com letra maiuscula, minuscula, numero e simbolo.
                    </p>
                    <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground"><Checkbox checked={candidateForm.wants_restart_mode} onCheckedChange={(checked) => setCandidateForm((current) => ({ ...current, wants_restart_mode: Boolean(checked) }))} />Ativar modo recomeco</label>
                    <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground"><Checkbox checked={candidateForm.consent_to_share_after_hire} onCheckedChange={(checked) => setCandidateForm((current) => ({ ...current, consent_to_share_after_hire: Boolean(checked) }))} />Liberar dados sensíveis somente após contratação</label>
                    <Button type="submit" variant="hero" className="md:col-span-2" disabled={busy}>Criar perfil</Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass border-white/10 bg-white/5">
                <CardHeader><CardTitle>{session?.role === "candidate" ? "Minha jornada" : "Login da candidata"}</CardTitle></CardHeader>
                <CardContent>
                  {session?.role === "candidate" ? (
                    <div className="space-y-4">
                      {candidateApplications.length === 0 ? <Empty text="Sem candidaturas ainda." /> : candidateApplications.map((application) => { const job = jobs.find((item) => item.id === application.job_id); const company = companies.find((item) => item.id === job?.company_id); return <div key={application.id} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{job?.title || "Vaga"}</p><p className="text-sm text-muted-foreground">{company?.name || "Empresa"}</p></div><Badge variant="outline">{application.stage}</Badge></div><div className="mt-4 grid grid-cols-3 gap-2"><MiniMetric title="Fit" value={`${Math.round(application.compatibility_score)}%`} /><MiniMetric title="Cres." value={`${Math.round(application.growth_score)}%`} /><MiniMetric title="Incl." value={`${Math.round(application.inclusion_score)}%`} /></div></div>; })}
                      <Button variant="glass" className="w-full" onClick={() => setSession(null)}>Sair</Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={loginAsCandidate}>
                      <Input type="email" placeholder="Email" value={candidateLogin.email} onChange={(event) => setCandidateLogin((current) => ({ ...current, email: event.target.value }))} required />
                      <Input type="password" placeholder="Senha" value={candidateLogin.password} onChange={(event) => setCandidateLogin((current) => ({ ...current, password: event.target.value }))} required />
                      <Button type="submit" variant="glass" className="w-full" disabled={busy}>Entrar como candidata</Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-white/10 bg-white/5">
                <CardHeader><CardTitle>Vagas abertas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {jobs.length === 0 ? <Empty text="Nenhuma vaga publicada ainda." /> : jobs.map((job) => { const company = companies.find((item) => item.id === job.company_id); const applied = candidateApplications.some((item) => item.job_id === job.id); return <div key={job.id} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-semibold">{job.title}</p><p className="text-sm text-muted-foreground">{company?.name || "Empresa"} - {job.location}</p><p className="mt-3 text-sm text-muted-foreground">{job.summary}</p><Button className="mt-4 w-full" variant={applied ? "glass" : "hero"} disabled={applied || busy} onClick={() => applyToJob(job.id)}>{applied ? "Candidatura enviada" : "Candidatar-se"}</Button></div>; })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <Card className="glass border-white/10 bg-white/5">
                <CardHeader><CardTitle>{session?.role === "company" ? "Conta da empresa" : "Cadastro da empresa"}</CardTitle></CardHeader>
                <CardContent>
                  {session?.role === "company" && currentCompany ? (
                    <div className="space-y-4">
                      <MiniMetric title="Empresa" value={currentCompany.name} />
                      <MiniMetric title="Setor" value={currentCompany.sector} />
                      <MiniMetric title="Vagas abertas" value={`${companyJobs.length}`} />
                      <MiniMetric title="Candidaturas" value={`${companyApplications.length}`} />
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">{currentCompany.inclusive_commitments}</div>
                      <Button variant="glass" className="w-full" onClick={() => setSession(null)}>Sair</Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={registerCompany}>
                      <Input name="name" placeholder="Nome da empresa" value={companyForm.name} onChange={updateSetter(setCompanyForm)} required />
                      <Input name="sector" placeholder="Setor" value={companyForm.sector} onChange={updateSetter(setCompanyForm)} required />
                      <Input name="contact_email" type="email" placeholder="Email corporativo" value={companyForm.contact_email} onChange={updateSetter(setCompanyForm)} required />
                      <Input name="website" placeholder="Site" value={companyForm.website} onChange={updateSetter(setCompanyForm)} />
                      <Textarea name="inclusive_commitments" placeholder="Compromissos inclusivos" value={companyForm.inclusive_commitments} onChange={updateSetter(setCompanyForm)} required />
                      <Input name="password" type="password" placeholder="Senha" value={companyForm.password} onChange={updateSetter(setCompanyForm)} required />
                      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground"><Checkbox checked={companyForm.bias_training_enabled} onCheckedChange={(checked) => setCompanyForm((current) => ({ ...current, bias_training_enabled: Boolean(checked) }))} />Time treinado em vies inconsciente</label>
                      <Button type="submit" variant="hero" className="w-full" disabled={busy}>Criar conta da empresa</Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-white/10 bg-white/5">
                <CardHeader><CardTitle>{session?.role === "company" ? "Publicar vaga" : "Login da empresa"}</CardTitle></CardHeader>
                <CardContent>
                  {session?.role === "company" ? (
                    <form className="space-y-4" onSubmit={createJob}>
                      <Input name="company_id" type="number" placeholder="ID da empresa" value={jobForm.company_id || session.company_id || ""} onChange={updateSetter(setJobForm)} required />
                      <Input name="title" placeholder="Titulo da vaga" value={jobForm.title} onChange={updateSetter(setJobForm)} required />
                      <Input name="location" placeholder="Localizacao" value={jobForm.location} onChange={updateSetter(setJobForm)} required />
                      <Input name="work_model" placeholder="Modelo de trabalho" value={jobForm.work_model} onChange={updateSetter(setJobForm)} required />
                      <Input name="employment_type" placeholder="Tipo de contrato" value={jobForm.employment_type} onChange={updateSetter(setJobForm)} required />
                      <Textarea name="summary" placeholder="Resumo da vaga" value={jobForm.summary} onChange={updateSetter(setJobForm)} required />
                      <Textarea name="responsibilities" placeholder="Responsabilidades" value={jobForm.responsibilities} onChange={updateSetter(setJobForm)} required />
                      <Textarea name="required_skills" placeholder="Skills obrigatorias" value={jobForm.required_skills} onChange={updateSetter(setJobForm)} required />
                      <Textarea name="inclusive_notes" placeholder="Notas inclusivas" value={jobForm.inclusive_notes} onChange={updateSetter(setJobForm)} />
                      <Button type="submit" variant="hero" className="w-full" disabled={busy}>Publicar vaga</Button>
                    </form>
                  ) : (
                    <form className="space-y-4" onSubmit={loginAsCompany}>
                      <Input type="email" placeholder="Email corporativo" value={companyLogin.email} onChange={(event) => setCompanyLogin((current) => ({ ...current, email: event.target.value }))} required />
                      <Input type="password" placeholder="Senha" value={companyLogin.password} onChange={(event) => setCompanyLogin((current) => ({ ...current, password: event.target.value }))} required />
                      <Button type="submit" variant="glass" className="w-full" disabled={busy}>Entrar como empresa</Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Pipeline de contratação</CardTitle>
                <CardDescription>Visão da empresa sem acesso aos dados sensíveis antes da hora.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {session?.role !== "company" ? <Empty text="Entre como empresa para ver o pipeline." /> : companyApplications.length === 0 ? <Empty text="Ainda nao ha candidaturas no funil." /> : <>
                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_180px_220px]">
                    <Input placeholder="Buscar por candidata, vaga ou skill" value={companyFilters.search} onChange={(event) => setCompanyFilters((current) => ({ ...current, search: event.target.value }))} />
                    <Select value={companyFilters.stage} onValueChange={(value) => setCompanyFilters((current) => ({ ...current, stage: value }))}>
                      <SelectTrigger><SelectValue placeholder="Etapa" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">todas as etapas</SelectItem>
                        {stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={companyFilters.jobId} onValueChange={(value) => setCompanyFilters((current) => ({ ...current, jobId: value }))}>
                      <SelectTrigger><SelectValue placeholder="Vaga" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">todas as vagas</SelectItem>
                        {companyJobs.map((job) => <SelectItem key={job.id} value={String(job.id)}>{job.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">
                    {filteredCompanyApplications.length} perfil(is) no shortlist atual.
                  </div>
                  {filteredCompanyApplications.map((application) => { const candidate = application.candidate; const job = application.job; const sensitive = sensitiveMap[application.id]; return <div key={application.id} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="flex gap-4"><CatAvatar style={candidate?.avatar_style || "stylized-cat"} palette={candidate?.avatar_palette || "sunrise"} accessory={candidate?.avatar_accessory || "star-pin"} mood={candidate?.avatar_mood || "confident"} size="sm" /><div><p className="font-semibold">{candidate?.social_name || "Perfil protegido"}</p><p className="text-sm text-muted-foreground">{job?.title || "Vaga"}</p><p className="mt-2 text-sm text-muted-foreground">{candidate?.headline || "Sem headline"}</p><div className="mt-3 flex flex-wrap gap-2">{candidate.real_skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 4).map((skill) => <Badge key={`${application.id}-${skill}`} variant="outline" className="border-white/10 bg-white/5">{skill}</Badge>)}</div></div></div><Badge variant="outline">{application.stage}</Badge></div><div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_0.3fr]"><div className="space-y-3"><div className="grid grid-cols-3 gap-2"><MiniMetric title="Fit" value={`${Math.round(application.compatibility_score)}%`} /><MiniMetric title="Cres." value={`${Math.round(application.growth_score)}%`} /><MiniMetric title="Incl." value={`${Math.round(application.inclusion_score)}%`} /></div><Select value={stageDrafts[application.id] || application.stage} onValueChange={(value) => setStageDrafts((current) => ({ ...current, [application.id]: value }))}><SelectTrigger><SelectValue placeholder="Etapa" /></SelectTrigger><SelectContent>{stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent></Select><Textarea placeholder="Feedback humanizado" value={feedbackDrafts[application.id] || application.recruiter_feedback || ""} onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [application.id]: event.target.value }))} /><Button variant="glass" className="w-full" onClick={() => saveStage(application.id)} disabled={busy}>Salvar etapa</Button></div><div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">{sensitive ? <div className="space-y-1"><p className="font-semibold text-foreground">{sensitive.legal_name}</p><p>{sensitive.email}</p><p>{sensitive.phone}</p></div> : <><p>Dados sensiveis bloqueados ate a contratacao.</p><Button variant="outline" className="mt-3 w-full border-white/10" disabled={application.stage !== "hired" || busy} onClick={() => unlockSensitive(application.candidate_id, application.id)}>Desbloquear</Button></>}</div></div></div>; })}
                </>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Platform;
