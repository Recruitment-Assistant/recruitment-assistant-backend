export const RESUME_PARSER_PORT = Symbol('ResumeParserPort');
export const RESUME_ANALYZER_PORT = Symbol('ResumeAnalyzerPort');

export enum APPLICATION_STATUS {
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  HIRED = 'HIRED',
}
