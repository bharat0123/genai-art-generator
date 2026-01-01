import dotenv from 'dotenv';

dotenv.config();

/**
 * Enum: AI Provider
 * Supported AI providers for both prompt enhancement and image generation
 */
export enum AIProvider {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  // Future: STABLE_DIFFUSION = 'stable-diffusion',
  // Future: MIDJOURNEY = 'midjourney',
}

/**
 * Singleton Pattern: Configuration Manager
 * Ensures a single instance of configuration throughout the application
 */
export class AppConfig {
  private static instance: AppConfig;
  
  public readonly provider: AIProvider;
  public readonly openaiApiKey: string;
  public readonly geminiApiKey: string;
  public readonly port: number;
  public readonly nodeEnv: string;
  public readonly storagePath: string;

  private constructor() {
    const provider = (
      process.env.PROVIDER || 
      process.env.LLM_PROVIDER || 
      process.env.IMAGE_GENERATION_PROVIDER || 
      'openai'
    ).toLowerCase();
    
    this.provider = provider === 'gemini' ? AIProvider.GEMINI : AIProvider.OPENAI;
    
    // API Keys
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    
    // Server configuration
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.storagePath = process.env.STORAGE_PATH || './generated-images';

    this.validate();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  private validate(): void {
    // Validate based on selected provider (used for both LLM and image generation)
    if (this.provider === AIProvider.OPENAI && !this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required when PROVIDER is set to "openai"');
    }
    
    if (this.provider === AIProvider.GEMINI && !this.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is required when PROVIDER is set to "gemini"');
    }
  }

  public isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  public getProvider(): AIProvider {
    return this.provider;
  }

  /**
   * Get provider name as string (for backward compatibility)
   */
  public getProviderName(): string {
    return this.provider;
  }
}

