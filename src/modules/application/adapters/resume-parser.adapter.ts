import { GroqProvider } from '@modules/llm/providers/groq.provider';
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import pdfParse from 'pdf-parse';
import { ParsedResumeDto } from '../dto/parsed-resume.dto';
import { ResumeParserPort } from '../ports/resume-parser.port';

@Injectable()
export class ResumeParserAdapter implements ResumeParserPort {
  private openai: Groq;
  constructor(private readonly openaiProvider: GroqProvider) {
    this.openai = this.openaiProvider.getClient();
  }

  async parse(buffer: Buffer): Promise<ParsedResumeDto> {
    const resumeText = await this.extractText(buffer);

    const prompt = `
Parse the following resume text and extract the information into valid JSON with this format:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "linkedin": "string",
  "skills": ["string"],
  "education": [{ "school": "string", "degree": "string", "major": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }],
  "workExperience": [{ "company": "string", "position": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string" }],
  "certifications": ["string"],
  "languages": ["string"],
  "summary": "string"
}

Here is the CV text:
"""
${resumeText}
"""

Return only valid JSON without explanation.
`;

    const response = await this.openai.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that extracts structured information from a candidate's CV.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const json = response.choices[0].message?.content;

    return JSON.parse(this.cleanJsonResponse(json) || '{}') as ParsedResumeDto;
  }

  private async extractText(buffer: Buffer): Promise<string> {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  }

  private cleanJsonResponse(raw: string): string {
    return raw
      .replace(/```json\s*/gi, '')
      .replace(/```/g, '')
      .trim();
  }
}
