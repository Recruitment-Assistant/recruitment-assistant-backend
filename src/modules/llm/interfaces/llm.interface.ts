export interface LLMProvider {
  chat(prompt: string): Promise<string>;
  praseCv(prompt: string): Promise<string>;
}
