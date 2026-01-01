import { IImageGenerationClient } from '../services/IImageGenerationClient';
import { OpenAIImageGenerationClient } from '../services/OpenAIImageGenerationClient';
import { GeminiImageGenerationClient } from '../services/GeminiImageGenerationClient';
import { AppConfig, AIProvider } from '../config/AppConfig';

/**
 * Factory Pattern: Creates image generation clients
 * Supports different image generation services (OpenAI DALL-E, Gemini)
 */
export class ImageGenerationClientFactory {
  private static config: AppConfig = AppConfig.getInstance();
  public static createClient(
    provider?: string
  ): IImageGenerationClient {
    // Use provided provider, or get from config (same provider used for LLM)
    const imageProvider = provider 
      ? provider.toLowerCase() 
      : this.config.getProvider();

    switch (imageProvider) {
      case AIProvider.OPENAI:
        return new OpenAIImageGenerationClient();
      
      case AIProvider.GEMINI:
        return new GeminiImageGenerationClient();
      
      default:
        throw new Error(`Unsupported provider: ${imageProvider}`);
    }
  }

  /**
   * Get available providers
   */
  public static getAvailableProviders(): string[] {
    return [
      AIProvider.OPENAI,
      AIProvider.GEMINI,
    ];
  }
}

