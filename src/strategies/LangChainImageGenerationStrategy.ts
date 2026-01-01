import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { PromptTemplate } from '@langchain/core/prompts';
import { IImageGenerationStrategy } from './IImageGenerationStrategy';
import { LLMFactory } from '../factories/LLMFactory';
import { ImageGenerationClientFactory } from '../factories/ImageGenerationClientFactory';
import { IImageGenerationClient } from '../services/IImageGenerationClient';

/**
 * Strategy Pattern: LangChain-based image generation
 * Uses LangChain for prompt engineering (supports OpenAI and Gemini)
 * Uses configurable image generation client (currently OpenAI DALL-E)
 */
export class LangChainImageGenerationStrategy
  implements IImageGenerationStrategy
{
  private readonly chatModel: BaseChatModel;
  private readonly imageClient: IImageGenerationClient;
  private readonly promptTemplate: PromptTemplate;

  constructor(imageClient?: IImageGenerationClient) {
    // Use factory to create the appropriate LLM model based on environment
    this.chatModel = LLMFactory.createChatModel();

    // Use factory to create image generation client (injectable for testing)
    this.imageClient = imageClient || ImageGenerationClientFactory.createClient();

    // Create a prompt template for enhancing prompts
    this.promptTemplate = PromptTemplate.fromTemplate(
      `You are an expert at creating detailed, artistic image prompts for AI image generation.
      Enhance the following prompt to be more descriptive, vivid, and artistic while maintaining the original intent.
      Add details about style, mood, lighting, composition, and artistic elements.
      
      Original prompt: {prompt}
      
      Enhanced prompt:`
    );
  }

  /**
   * Generate image using LangChain for prompt enhancement and configurable image generation client
   */
  public async generate(
    prompt: string,
    size: string = '1024x1024',
    quality: string = 'standard'
  ): Promise<string> {
    try {
      // Step 1: Use LangChain to enhance the prompt
      const enhancedPrompt = await this.enhancePromptWithLangChain(prompt);
      
      // Step 2: Generate image using the configured image generation client
      const imageUrl = await this.imageClient.generateImage(
        enhancedPrompt,
        size,
        quality
      );

      return imageUrl;
    } catch (error: any) {
      console.error('LangChain Image Generation Error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  /**
   * Enhance prompt using LangChain's prompt template and chat model
   * This demonstrates LangChain's capabilities for prompt engineering
   */
  private async enhancePromptWithLangChain(originalPrompt: string): Promise<string> {
    try {
      // Use LangChain's prompt template
      const formattedPrompt = await this.promptTemplate.format({
        prompt: originalPrompt,
      });

      // Use LangChain's chat model to enhance the prompt
      const response = await this.chatModel.invoke(formattedPrompt);
      
      const enhancedPrompt = response.content as string;
      
      // Validate and return enhanced prompt, fallback to original if enhancement fails
      if (enhancedPrompt && enhancedPrompt.trim().length > originalPrompt.length) {
        const provider = LLMFactory.getProviderName();
        console.log(`Prompt enhanced using LangChain with ${provider}`);
        return enhancedPrompt.trim();
      } else {
        console.warn('Prompt enhancement returned invalid result, using original');
        return originalPrompt;
      }
    } catch (error) {
      // If enhancement fails, return original prompt
      const provider = LLMFactory.getProviderName();
      console.warn(`Prompt enhancement failed with ${provider}, using original prompt:`, error);
      return originalPrompt;
    }
  }
}

