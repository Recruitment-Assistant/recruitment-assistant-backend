import { ParsedResumeDto } from '../dto/parsed-resume.dto';

export interface ResumeParserPort {
  parse(buffer: Buffer): Promise<ParsedResumeDto>;
}
