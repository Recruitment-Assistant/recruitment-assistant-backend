import { LLMProvider } from './interfaces/llm.interface';
import { OpenAIStrategy } from './providers/openai.strategy';

export class LLMFactory {
  static create(provider: string): LLMProvider {
    switch (provider) {
      case 'openai':
        return new OpenAIStrategy();
      // case 'azure':
      //   return new AzureOpenAIStrategy();
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}
