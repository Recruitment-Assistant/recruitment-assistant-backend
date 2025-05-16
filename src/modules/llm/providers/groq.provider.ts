import Groq from 'groq-sdk';

export class GroqProvider {
  private openai: Groq;

  constructor() {
    this.openai = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  getClient(): Groq {
    return this.openai;
  }

  async chat(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }
}
