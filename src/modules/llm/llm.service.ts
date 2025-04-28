import { Injectable } from '@nestjs/common';
import { generatePrompt } from '../cv/utils/generate-prompt.util';
import { LLMFactory } from './llm.factory';

@Injectable()
export class LlmService {
  private llmClient = LLMFactory.create('groq');

  async extractCVInfo(cvText: string) {
    const prompt = generatePrompt(cvText);
    const response = await this.llmClient.praseCv(prompt);
    const responseCleaned = this.cleanJsonResponse(response);
    return JSON.parse(responseCleaned);
  }

  cleanJsonResponse(raw: string): string {
    return raw
      .replace(/```json\s*/gi, '')
      .replace(/```/g, '')
      .trim();
  }
}
