import Groq from 'groq-sdk';
import { LLMProvider } from '../interfaces/llm.interface';

export class GroqStrategy implements LLMProvider {
  private openai = new Groq({ apiKey: process.env.GROQ_API_KEY });

  async chat(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }

  async praseCv(prompt: string): Promise<string> {
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
    return response.choices[0].message.content || '';
  }
}
