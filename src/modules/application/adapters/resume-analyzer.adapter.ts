import { GroqProvider } from '@modules/llm/providers/groq.provider';
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { PROMPT_ANALYSIS_RESUME } from '../constants/prompt-analysis-resume.constant';
import { ResumeAnalyzerPort } from '../ports/resume-analyzer.port';
import { AnalysisResult } from '../types/analysis-result.dto';

@Injectable()
export class ResumeAnalyzerAdapter implements ResumeAnalyzerPort {
  private openai: Groq;
  constructor(private readonly openaiProvider: GroqProvider) {
    this.openai = this.openaiProvider.getClient();
  }

  async analyze(jdText: string, resumeText: string): Promise<any> {
    const prompt = PROMPT_ANALYSIS_RESUME(jdText, resumeText);

    const response = await this.openai.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that evaluates candidate resumes based on a scoring formula. 
Your job is to analyze the resume against the role requirements and return a structured JSON result including scoring components such as skill matching, experience level, project experience, and learning adaptability. 
You must strictly follow the JSON format requested by the user.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const json = response.choices[0].message?.content;

    return JSON.parse(this.cleanJsonResponse(json) || '{}') as AnalysisResult;
  }

  private cleanJsonResponse(raw: string): string {
    return raw
      .replace(/```json\s*/gi, '')
      .replace(/```/g, '')
      .trim();
  }
}
