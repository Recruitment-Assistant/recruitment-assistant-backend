import { LLMProvider } from './interfaces/llm.interface';
import { GroqStrategy } from './providers/groq.strategy';
import { OpenAIStrategy } from './providers/openai.strategy';

export class LLMFactory {
  static create(provider: string): LLMProvider {
    switch (provider) {
      case 'openai':
        return new OpenAIStrategy();
      case 'groq':
        return new GroqStrategy();
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}
