export class ParsedResumeDto {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  skills: string[];
  education: {
    school: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  certifications?: string[];
  languages?: string[];
  summary?: string;
}
