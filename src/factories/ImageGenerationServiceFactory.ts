import { IImageGenerationStrategy } from '../strategies/IImageGenerationStrategy';
import { LangChainImageGenerationStrategy } from '../strategies/LangChainImageGenerationStrategy';

/**
 * Factory Pattern: Creates image generation services
 * Allows easy switching between different generation strategies
 */
export class ImageGenerationServiceFactory {
  /**
   * Create an image generation strategy
   * @param strategyType - Type of strategy to create (default: 'langchain')
   */
  public static createStrategy(
    strategyType: string = 'langchain'
  ): IImageGenerationStrategy {
    switch (strategyType.toLowerCase()) {
      case 'langchain':
        return new LangChainImageGenerationStrategy();
      default:
        throw new Error(`Unknown image generation strategy: ${strategyType}`);
    }
  }

  /**
   * Get available strategy types
   */
  public static getAvailableStrategies(): string[] {
    return ['langchain'];
  }
}

