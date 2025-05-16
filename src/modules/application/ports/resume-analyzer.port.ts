export interface ResumeAnalyzerPort {
  analyze(jdText: string, resumeText: string): Promise<any>;
}
