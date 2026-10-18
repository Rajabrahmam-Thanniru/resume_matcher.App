export type RequirementPriority = "required" | "preferred" | "unspecified" | "not_required"

export interface Requirement {
  skill: string
  priority: RequirementPriority
  evidence: string
}

export interface AnalyzerResponse {
  response_time_seconds: number
  error: string
  report: string
  mention_skills: string[]
  non_mention_skills: string[]
  preferred_skills_matched: string[]
  preferred_skills_not_found: string[]
  requirements: Requirement[]
  resume_evidence: Record<string, string>
  tailored_resume_text: string
  changes_made: string[]
  suggestions: string[]
  warnings: string[]
  download_id: string
}

export interface MatchResponse {
  error: string
  report: string
  is_valid: boolean
  evidence_valid: boolean
  mention_skills: string[]
  non_mention_skills: string[]
}
