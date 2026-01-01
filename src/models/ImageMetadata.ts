/**
 * Domain Model: ImageMetadata
 * Represents the metadata of a generated image
 */
export class ImageMetadata {
  constructor(
    public readonly id: string,
    public readonly prompt: string,
    public readonly createdAt: Date,
    public readonly size?: string,
    public readonly quality?: string
  ) {}

  /**
   * Convert to plain object for JSON serialization
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      prompt: this.prompt,
      createdAt: this.createdAt.toISOString(),
      size: this.size,
      quality: this.quality,
    };
  }

  /**
   * Create from plain object
   */
  public static fromJSON(data: Record<string, any>): ImageMetadata {
    return new ImageMetadata(
      data.id,
      data.prompt,
      new Date(data.createdAt),
      data.size,
      data.quality
    );
  }
}

/**
 * Domain Model: ImageGenerationRequest
 * Represents a request to generate an image
 */
export class ImageGenerationRequest {
  constructor(
    public readonly prompt: string,
    public readonly size: ImageSize = ImageSize.SQUARE,
    public readonly quality: ImageQuality = ImageQuality.STANDARD
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.prompt || this.prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }
  }
}

/**
 * Enum: ImageSize
 */
export enum ImageSize {
  SQUARE = '1024x1024',
  LANDSCAPE = '1792x1024',
  PORTRAIT = '1024x1792',
}

/**
 * Enum: ImageQuality
 */
export enum ImageQuality {
  STANDARD = 'standard',
  HD = 'hd',
}

