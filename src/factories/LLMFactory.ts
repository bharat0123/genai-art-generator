import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AppConfig, AIProvider } from '../config/AppConfig';

/**
 * Factory Pattern: Creates LangChain chat models based on configuration
 * Supports multiple LLM providers (OpenAI, Gemini)
 */
export class LLMFactory {
  private static config: AppConfig = AppConfig.getInstance();

  /**
   * Create a chat model based on the configured LLM provider
   */
  public static createChatModel(): BaseChatModel {
    const provider = this.config.getProvider();

    switch (provider) {
      case AIProvider.OPENAI:
        return this.createOpenAIModel();
      
      case AIProvider.GEMINI:
        return this.createGeminiModel();
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Create OpenAI chat model
   */
  private static createOpenAIModel(): ChatOpenAI {
    if (!this.config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAI provider');
    }

    return new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      openAIApiKey: this.config.openaiApiKey,
    });
  }

  /**
   * Create Google Gemini chat model
   * Uses GEMINI_MODEL if set, otherwise defaults to text model
   */
  private static createGeminiModel(): ChatGoogleGenerativeAI {
    if (!this.config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is required for Gemini provider');
    }

    // Set the API key as environment variable for LangChain (fallback)
    process.env.GOOGLE_API_KEY = this.config.geminiApiKey;

    const configuredModel = process.env.GEMINI_MODEL;
    let modelName: string;
    
    if (configuredModel && !configuredModel.includes('image')) {
      // Use the configured model if it's a text model
      modelName = configuredModel;
    } else {
      // Default to text model for prompt enhancement
      modelName = 'gemini-pro';
    }

    return new ChatGoogleGenerativeAI({
      model: modelName,
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
      apiKey: this.config.geminiApiKey,
    });
  }

  /**
   * Get the current provider name
   */
  public static getProviderName(): string {
    return this.config.getProviderName();
  }
}

