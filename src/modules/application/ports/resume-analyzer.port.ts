import { AnalysisResult } from '../types/analysis-result.dto';

export interface ResumeAnalyzerPort {
  analyze(jdText: string, resumeText: string): Promise<AnalysisResult>;
}
