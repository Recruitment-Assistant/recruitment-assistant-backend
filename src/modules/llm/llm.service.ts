import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  // async extractCVInfo(cvText: string) {
  //   const prompt = generatePrompt(cvText);
  //   const response = await this.llmClient.praseCv(prompt);
  //   const responseCleaned = this.cleanJsonResponse(response);
  //   return JSON.parse(responseCleaned);
  // }
  // cleanJsonResponse(raw: string): string {
  //   return raw
  //     .replace(/```json\s*/gi, '')
  //     .replace(/```/g, '')
  //     .trim();
  // }
}
