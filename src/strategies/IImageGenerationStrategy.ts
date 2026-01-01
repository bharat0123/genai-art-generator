/**
 * Strategy Pattern: Interface for image generation strategies
 * Allows different implementations of image generation (DALL-E, Stable Diffusion, etc.)
 */
export interface IImageGenerationStrategy {
  /**
   * Generate an image from a text prompt
   * @param prompt - The text description of the desired image
   * @param size - The size of the image to generate
   * @param quality - The quality of the image
   * @returns The URL of the generated image
   */
  generate(
    prompt: string,
    size: string,
    quality: string
  ): Promise<string>;
}

