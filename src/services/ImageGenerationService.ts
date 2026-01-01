import { IImageGenerationStrategy } from '../strategies/IImageGenerationStrategy';
import { IImageRepository } from '../repositories/IImageRepository';
import { ImageGenerationRequest, ImageSize, ImageQuality } from '../models/ImageMetadata';

/**
 * Service Pattern: Business logic for image generation
 * Orchestrates the generation process using strategy and repository patterns
 */
export class ImageGenerationService {
  constructor(
    private readonly generationStrategy: IImageGenerationStrategy,
    private readonly imageRepository: IImageRepository
  ) {}

  /**
   * Generate an image from a request
   * @param request - The image generation request
   * @returns The generated image metadata
   */
  public async generateImage(
    request: ImageGenerationRequest
  ): Promise<{ imageId: string; imageUrl: string; prompt: string }> {
    try {
      // Generate image using the strategy
      const imageUrl = await this.generationStrategy.generate(
        request.prompt,
        request.size,
        request.quality
      );

      if (!imageUrl) {
        throw new Error('Image generation returned no URL');
      }

      // Save image using repository
      const imageId = await this.imageRepository.save(
        imageUrl,
        request.prompt,
        request.size,
        request.quality
      );

      return {
        imageId,
        imageUrl: `/api/images/${imageId}`,
        prompt: request.prompt,
      };
    } catch (error: any) {
      console.error('ImageGenerationService Error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  /**
   * Get image by ID
   */
  public async getImageById(imageId: string): Promise<{
    path: string;
    metadata: any;
  }> {
    const metadata = await this.imageRepository.findById(imageId);
    
    if (!metadata) {
      throw new Error('Image not found');
    }

    const path = this.imageRepository.getImagePath(imageId);
    const exists = await this.imageRepository.exists(imageId);

    if (!exists) {
      throw new Error('Image file not found');
    }

    return {
      path,
      metadata: metadata.toJSON(),
    };
  }

  /**
   * Get all images
   */
  public async getAllImages(): Promise<any[]> {
    const images = await this.imageRepository.findAll();
    return images.map((img) => img.toJSON());
  }

  /**
   * Get download filename for an image
   */
  public async getDownloadFilename(imageId: string): Promise<string> {
    const metadata = await this.imageRepository.findById(imageId);
    
    if (!metadata) {
      return `artwork-${imageId}.png`;
    }

    const sanitizedPrompt = metadata.prompt
      .substring(0, 50)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    
    return `artwork-${sanitizedPrompt}-${imageId}.png`;
  }
}

