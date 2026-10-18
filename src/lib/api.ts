import type { AnalyzerResponse, MatchResponse } from "@/types/api"

const configuredBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
const apiBase = configuredBase || (import.meta.env.DEV ? "/backend" : "")

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function errorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === "object" && "detail" in payload) {
    const detail = (payload as { detail: unknown }).detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) return detail.map((item) => (typeof item === "object" && item && "msg" in item ? String(item.msg) : "Invalid request")).join(" ")
  }
  return status >= 500 ? "The service could not complete this request. Please try again." : "The request could not be completed."
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { ...init, credentials: "include" })
  if (response.status === 401 && retry && path !== "/login" && path !== "/refresh") {
    const refreshed = await fetch(`${apiBase}/refresh`, { method: "POST", credentials: "include" })
    if (refreshed.ok) return request<T>(path, init, false)
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new ApiError(errorMessage(payload, response.status), response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  session: () => request<{ message: string }>("/protected"),
  login: (username: string, password: string) => {
    const body = new URLSearchParams({ username, password })
    return request<{ message: string }>("/login", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }, false)
  },
  logout: () => request<{ message: string }>("/logout", { method: "POST" }, false),
  analyze: (values: { resume: File; jobDescription: string; tailor: boolean }) => {
    const body = new FormData()
    body.append("resume_pdf", values.resume)
    body.append("job_description", values.jobDescription)
    body.append("tailor", String(values.tailor))
    return request<AnalyzerResponse>("/api/analyze-resume", { method: "POST", body })
  },
  match: (resumeText: string, jobDescription: string) => request<MatchResponse>("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_txt: resumeText, job_description: jobDescription }),
  }),
  download: async (fileId: string) => {
    const response = await fetch(`${apiBase}/api/download-resume/${encodeURIComponent(fileId)}`, { credentials: "include" })
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new ApiError(errorMessage(payload, response.status), response.status)
    }
    return response.blob()
  },
}
