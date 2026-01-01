import { IImageGenerationClient } from './IImageGenerationClient';
import { AppConfig } from '../config/AppConfig';

export class GeminiImageGenerationClient implements IImageGenerationClient {
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    const config = AppConfig.getInstance();
    this.apiKey = apiKey || config.geminiApiKey;

    if (!this.apiKey) {
      throw new Error('Gemini API key is required for image generation');
    }
  }

  async generateImage(prompt: string, size: string = '1024x1024', quality: string = 'standard') {
    return Promise.reject(new Error('Not implemented'));
  }
}
