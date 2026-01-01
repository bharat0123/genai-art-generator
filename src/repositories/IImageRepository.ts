import { ImageMetadata } from '../models/ImageMetadata';

/**
 * Repository Pattern: Interface for image data access
 * Defines the contract for image storage operations
 */
export interface IImageRepository {
  /**
   * Save image metadata and return the image ID
   */
  save(imageUrl: string, prompt: string, size?: string, quality?: string): Promise<string>;

  /**
   * Get image metadata by ID
   */
  findById(imageId: string): Promise<ImageMetadata | null>;

  /**
   * Get all images, sorted by creation date (newest first)
   */
  findAll(): Promise<ImageMetadata[]>;

  /**
   * Get the file path for an image
   */
  getImagePath(imageId: string): string;

  /**
   * Check if an image exists
   */
  exists(imageId: string): Promise<boolean>;
}

