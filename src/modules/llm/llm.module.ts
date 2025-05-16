import { Module, Provider } from '@nestjs/common';
import { GroqProvider } from './providers/groq.provider';

const providers: Provider[] = [GroqProvider];

@Module({
  providers,
  exports: providers,
})
export class LlmModule {}
