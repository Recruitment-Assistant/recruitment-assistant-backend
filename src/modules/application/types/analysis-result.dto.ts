export interface AISummary {
  full_name: string;
  total_experience_years: number;
  education: string;
  recent_job_title: string;
  recent_company: string;
  notable_projects: string[];
  core_skills: string[];
}

export interface AnalysisResult {
  selected: boolean;
  score_resume_match: number;
  feedback: string;
  matching_skills: string[];
  missing_skills: string[];
  experience_level: 'junior' | 'mid' | 'senior' | string;
  ai_summary: AISummary;
}
