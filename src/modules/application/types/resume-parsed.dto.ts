export interface Education {
  school: string;
  degree: string;
  major: string;
  start_date: string;
  end_date: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  skills: string[];
  education: Education[];
  work_experience: WorkExperience[];
  certifications: string[];
  languages: string[];
  summary: string;
}
