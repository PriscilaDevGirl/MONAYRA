import { useState } from "react";
import { AvatarCard } from "./components/AvatarCard";
import { candidates, companySignals, metrics } from "./data/mock";
import { api } from "./services/api";

const candidateInitialState = {
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
  consent_to_share_after_hire: true,
  password: "",
};

const companyInitialState = {
  name: "",
  sector: "",
  website: "",
  inclusive_commitments: "",
  contact_email: "",
  bias_training_enabled: true,
  inclusive_seal: false,
  password: "",
};

const jobInitialState = {
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

function App() {
  const [candidateForm, setCandidateForm] = useState(candidateInitialState);
  const [companyForm, setCompanyForm] = useState(companyInitialState);
  const [jobForm, setJobForm] = useState(jobInitialState);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("Pronta para receber candidatas e empresas.");
  const [session, setSession] = useState(null);

  async function handleCandidateSubmit(event) {
    event.preventDefault();
    setStatus("Criando perfil seguro da candidata...");

    try {
      const payload = {
        profile: {
          ...candidateForm,
          years_out_of_market: Number(candidateForm.years_out_of_market || 0),
          audio_pitch_url: candidateForm.audio_pitch_url || null,
          video_pitch_url: candidateForm.video_pitch_url || null,
          document_id: candidateForm.document_id || null,
          linkedin_url: candidateForm.linkedin_url || null,
          password: undefined,
        },
        password: candidateForm.password,
      };

      const result = await api.registerCandidate(payload);
      setStatus(`Perfil de ${result.candidate.social_name} criado com sucesso.`);
      setCandidateForm(candidateInitialState);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleCompanySubmit(event) {
    event.preventDefault();
    setStatus("Criando conta da empresa...");

    try {
      const result = await api.registerCompany({
        profile: {
          ...companyForm,
          password: undefined,
        },
        password: companyForm.password,
      });
      setStatus(`Empresa ${result.company.name} cadastrada. Faça login para publicar vagas.`);
      setCompanyForm(companyInitialState);
      setJobForm((current) => ({ ...current, company_id: String(result.company.id) }));
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("Entrando na plataforma...");

    try {
      const result = await api.login(loginForm);
      setSession(result);
      setStatus(`Sessao iniciada como ${result.role}.`);
      if (result.company_id) {
        setJobForm((current) => ({ ...current, company_id: String(result.company_id) }));
      }
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleJobSubmit(event) {
    event.preventDefault();
    if (!session?.access_token) {
      setStatus("Faça login como empresa antes de publicar vagas.");
      return;
    }

    setStatus("Publicando vaga inclusiva...");

    try {
      await api.createJob(
        {
          ...jobForm,
          company_id: Number(jobForm.company_id),
        },
        session.access_token,
      );
      setStatus("Vaga publicada com sucesso.");
      setJobForm((current) => ({ ...jobInitialState, company_id: current.company_id }));
    } catch (error) {
      setStatus(error.message);
    }
  }

  function updateForm(setter) {
    return (event) => {
      const { name, value, type, checked } = event.target;
      setter((current) => ({
        ...current,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">
            <span className="brand__mark">M</span>
            <div>
              <strong>Monayra</strong>
              <p>Empregabilidade inclusiva sem vies visual</p>
            </div>
          </div>
          <div className="topbar__actions">
            <a href="#empresa" className="ghost-button">
              Sou empresa
            </a>
            <a href="#candidatas" className="primary-button">
              Criar perfil
            </a>
          </div>
        </nav>

        <section className="hero__content">
          <div className="hero__copy">
            <p className="eyebrow">LinkedIn + Gupy com justica algoritmica</p>
            <h1>
              Contratacao mais humana para mulheres, mulheres trans e travestis.
            </h1>
            <p className="hero__text">
              A Monayra remove fotos do processo, protege dados sensiveis e entrega
              triagem com foco em potencial, habilidades reais e trajetorias de
              recomeco.
            </p>
            <div className="hero__actions">
              <a href="#candidatas" className="primary-button">
                Entrar como candidata
              </a>
              <a href="#empresa" className="secondary-button">
                Publicar vaga
              </a>
            </div>
          </div>

          <aside className="hero__panel">
            <div className="panel-card">
              <p className="panel-card__label">Triagem protegida</p>
              <h2>Nome social visivel. Dados sensiveis bloqueados.</h2>
              <ul>
                <li>Sem foto humana ou avatar realista</li>
                <li>Compatibilidade por habilidades e crescimento</li>
                <li>Desbloqueio de contatos apenas apos contratacao</li>
              </ul>
            </div>
          </aside>
        </section>
      </header>

      <main>
        <section className="metrics-section">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="form-hub">
          <div className="section-heading">
            <p className="eyebrow">MVP navegavel</p>
            <h2>Cadastre candidatas, empresas e vagas em um mesmo fluxo.</h2>
            <p>
              Esta primeira versao conecta o frontend a endpoints reais para cadastro,
              autenticacao e publicacao de vagas.
            </p>
          </div>

          <div className="status-banner">{status}</div>

          <div className="form-grid">
            <form className="form-card" onSubmit={handleCandidateSubmit}>
              <p className="eyebrow">Candidata</p>
              <h3>Perfil inclusivo e seguro</h3>
              <input name="social_name" placeholder="Nome social" value={candidateForm.social_name} onChange={updateForm(setCandidateForm)} required />
              <input name="self_declared_gender" placeholder="Genero autodeclarado" value={candidateForm.self_declared_gender} onChange={updateForm(setCandidateForm)} required />
              <input name="headline" placeholder="Como voce quer se apresentar" value={candidateForm.headline} onChange={updateForm(setCandidateForm)} required />
              <div className="form-row">
                <input name="city" placeholder="Cidade" value={candidateForm.city} onChange={updateForm(setCandidateForm)} required />
                <input name="state" placeholder="Estado" value={candidateForm.state} onChange={updateForm(setCandidateForm)} required />
              </div>
              <textarea name="trajectory" placeholder="Minha trajetoria" value={candidateForm.trajectory} onChange={updateForm(setCandidateForm)} required />
              <textarea name="real_skills" placeholder="Minhas habilidades reais" value={candidateForm.real_skills} onChange={updateForm(setCandidateForm)} required />
              <textarea name="growth_story" placeholder="Minha evolucao" value={candidateForm.growth_story} onChange={updateForm(setCandidateForm)} required />
              <div className="form-row">
                <input name="email" type="email" placeholder="Email protegido" value={candidateForm.email} onChange={updateForm(setCandidateForm)} required />
                <input name="phone" placeholder="Telefone" value={candidateForm.phone} onChange={updateForm(setCandidateForm)} required />
              </div>
              <input name="legal_name" placeholder="Nome legal protegido" value={candidateForm.legal_name} onChange={updateForm(setCandidateForm)} required />
              <input name="password" type="password" placeholder="Crie uma senha" value={candidateForm.password} onChange={updateForm(setCandidateForm)} required />
              <label className="checkbox-row">
                <input name="wants_restart_mode" type="checkbox" checked={candidateForm.wants_restart_mode} onChange={updateForm(setCandidateForm)} />
                Ativar modo recomeco
              </label>
              <button className="primary-button" type="submit">Criar perfil</button>
            </form>

            <form className="form-card" onSubmit={handleCompanySubmit}>
              <p className="eyebrow">Empresa</p>
              <h3>Cadastro para RH e liderancas</h3>
              <input name="name" placeholder="Nome da empresa" value={companyForm.name} onChange={updateForm(setCompanyForm)} required />
              <input name="sector" placeholder="Setor" value={companyForm.sector} onChange={updateForm(setCompanyForm)} required />
              <input name="contact_email" type="email" placeholder="Email corporativo" value={companyForm.contact_email} onChange={updateForm(setCompanyForm)} required />
              <input name="website" placeholder="Site" value={companyForm.website} onChange={updateForm(setCompanyForm)} />
              <textarea name="inclusive_commitments" placeholder="Compromissos inclusivos da empresa" value={companyForm.inclusive_commitments} onChange={updateForm(setCompanyForm)} required />
              <input name="password" type="password" placeholder="Crie uma senha" value={companyForm.password} onChange={updateForm(setCompanyForm)} required />
              <label className="checkbox-row">
                <input name="bias_training_enabled" type="checkbox" checked={companyForm.bias_training_enabled} onChange={updateForm(setCompanyForm)} />
                Time treinado em vies inconsciente
              </label>
              <button className="primary-button" type="submit">Cadastrar empresa</button>
            </form>

            <div className="stacked-panel">
              <form className="form-card" onSubmit={handleLogin}>
                <p className="eyebrow">Acesso</p>
                <h3>Login</h3>
                <input name="email" type="email" placeholder="Email" value={loginForm.email} onChange={updateForm(setLoginForm)} required />
                <input name="password" type="password" placeholder="Senha" value={loginForm.password} onChange={updateForm(setLoginForm)} required />
                <button className="secondary-button" type="submit">Entrar</button>
              </form>

              <form className="form-card" onSubmit={handleJobSubmit}>
                <p className="eyebrow">Vagas</p>
                <h3>Publicacao simplificada</h3>
                <input name="company_id" type="number" placeholder="ID da empresa" value={jobForm.company_id} onChange={updateForm(setJobForm)} required />
                <input name="title" placeholder="Titulo da vaga" value={jobForm.title} onChange={updateForm(setJobForm)} required />
                <div className="form-row">
                  <input name="location" placeholder="Localizacao" value={jobForm.location} onChange={updateForm(setJobForm)} required />
                  <input name="work_model" placeholder="Modelo de trabalho" value={jobForm.work_model} onChange={updateForm(setJobForm)} required />
                </div>
                <textarea name="summary" placeholder="Resumo da vaga" value={jobForm.summary} onChange={updateForm(setJobForm)} required />
                <textarea name="responsibilities" placeholder="Responsabilidades" value={jobForm.responsibilities} onChange={updateForm(setJobForm)} required />
                <textarea name="required_skills" placeholder="Habilidades obrigatorias separadas por virgula" value={jobForm.required_skills} onChange={updateForm(setJobForm)} required />
                <textarea name="inclusive_notes" placeholder="Notas inclusivas da vaga" value={jobForm.inclusive_notes} onChange={updateForm(setJobForm)} />
                <button className="primary-button" type="submit">Publicar vaga</button>
              </form>
            </div>
          </div>
        </section>

        <section className="content-grid" id="candidatas">
          <div className="section-heading">
            <p className="eyebrow">Perfis simbolicos</p>
            <h2>Curriculos humanizados com avatar de gato estilizado.</h2>
            <p>
              Cada perfil destaca historia, habilidades e evolucao sem expor a
              aparencia da candidata durante a triagem.
            </p>
          </div>

          <div className="avatar-grid">
            {candidates.map((candidate) => (
              <AvatarCard key={candidate.name} candidate={candidate} />
            ))}
          </div>
        </section>

        <section className="dual-panel">
          <article className="feature-panel">
            <p className="eyebrow">Modo recomeco</p>
            <h2>Visibilidade para quem esta voltando ao mercado.</h2>
            <p>
              O algoritmo considera cursos, esforco continuo e sinais de retomada
              profissional para reduzir o peso de lacunas no curriculo.
            </p>
          </article>

          <article className="feature-panel feature-panel--highlight">
            <p className="eyebrow">Feedback humanizado</p>
            <h2>Toda candidatura recebe retorno.</h2>
            <p>
              Empresas recebem apoio para escrever respostas empaticas com sugestoes
              de melhoria e orientacao de carreira.
            </p>
          </article>
        </section>

        <section className="company-section" id="empresa">
          <div className="section-heading">
            <p className="eyebrow">Dashboard para empresas</p>
            <h2>Shortlist rapida com alertas de vies inconsciente.</h2>
          </div>

          <div className="company-layout">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <div>
                  <p className="eyebrow">Empresa inclusiva</p>
                  <h3>Painel de contratacao</h3>
                </div>
                <span className="seal">Selo inclusivo</span>
              </div>

              <div className="dashboard-stats">
                <div>
                  <strong>14</strong>
                  <span>vagas ativas</span>
                </div>
                <div>
                  <strong>87%</strong>
                  <span>aderencia media</span>
                </div>
                <div>
                  <strong>3x</strong>
                  <span>contratacao mais rapida</span>
                </div>
              </div>
            </div>

            <div className="signal-list">
              {companySignals.map((signal) => (
                <article className="signal-item" key={signal}>
                  {signal}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
