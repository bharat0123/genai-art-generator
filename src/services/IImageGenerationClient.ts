/**
 * Interface for image generation clients
 * Abstracts different image generation services (OpenAI DALL-E, etc.)
 */
export interface IImageGenerationClient {
  /**
   * Generate an image from a prompt
   * @param prompt - The text description
   * @param size - Image size
   * @param quality - Image quality
   * @returns URL of the generated image
   */
  generateImage(
    prompt: string,
    size: string,
    quality: string
  ): Promise<string>;
}

