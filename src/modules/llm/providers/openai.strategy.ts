import { OpenAI } from 'openai';
import { LLMProvider } from '../interfaces/llm.interface';

export class OpenAIStrategy implements LLMProvider {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async chat(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }

  async praseCv(prompt: string): Promise<string> {
    return prompt;
  }
}
