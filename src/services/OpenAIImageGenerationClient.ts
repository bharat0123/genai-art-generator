import { IImageGenerationClient } from './IImageGenerationClient';
import { AppConfig } from '../config/AppConfig';

/**
 * OpenAI DALL-E Image Generation Client
 * Implements IImageGenerationClient for OpenAI's DALL-E service
 */
export class OpenAIImageGenerationClient implements IImageGenerationClient {
  private readonly apiKey: string;
  private openaiClient: any;

  constructor(apiKey?: string) {
    const config = AppConfig.getInstance();
    this.apiKey = apiKey || config.openaiApiKey;

    if (!this.apiKey) {
      throw new Error('OpenAI API key is required for image generation');
    }
  }

  /**
   * Lazy load OpenAI client to avoid importing it at module level
   */
  private async getOpenAIClient() {
    if (!this.openaiClient) {
      const { OpenAI } = await import('openai');
      this.openaiClient = new OpenAI({
        apiKey: this.apiKey,
      });
    }
    return this.openaiClient;
  }

  public async generateImage(
    prompt: string,
    size: string = '1024x1024',
    quality: string = 'standard'
  ): Promise<string> {
    try {
      const openai = await this.getOpenAIClient();

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size as '1024x1024' | '1792x1024' | '1024x1792',
        quality: quality as 'standard' | 'hd',
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return imageUrl;
    } catch (error: any) {
      console.error('OpenAI Image Generation Error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

