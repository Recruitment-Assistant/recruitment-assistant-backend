import { ResumeData } from '../types/resume-parsed.dto';

export interface ResumeParserPort {
  parse(buffer: Buffer): Promise<ResumeData>;
}
