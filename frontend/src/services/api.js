const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.detail || "Nao foi possivel concluir a requisicao.");
  }

  return data;
}

export const api = {
  registerCandidate(payload) {
    return request("/auth/register/candidate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  registerCompany(payload) {
    return request("/auth/register/company", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  createJob(payload, token) {
    return request("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });
  },
};
