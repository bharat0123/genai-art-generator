import { Request, Response } from 'express';
import { ImageGenerationService } from '../services/ImageGenerationService';
import { ImageGenerationRequest, ImageSize, ImageQuality } from '../models/ImageMetadata';
import path from 'path';
import fs from 'fs';

/**
 * Controller Pattern: Handles HTTP requests and responses
 * Separates HTTP concerns from business logic
 */
export class ImageController {
  constructor(private readonly imageService: ImageGenerationService) {}

  /**
   * Generate image endpoint handler
   */
  public async generate(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, size = '1024x1024', quality = 'standard' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      // Create request object
      const request = new ImageGenerationRequest(
        prompt,
        size as ImageSize,
        quality as ImageQuality
      );

      console.log(`Generating image for prompt: ${prompt}`);

      // Generate image
      const result = await this.imageService.generateImage(request);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error generating image:', error);
      res.status(500).json({
        error: 'Failed to generate image',
        message: error.message,
      });
    }
  }

  /**
   * Get image by ID endpoint handler
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { imageId } = req.params;
      const { path: imagePath } = await this.imageService.getImageById(imageId);
      res.sendFile(path.resolve(imagePath));
    } catch (error: any) {
      console.error('Error serving image:', error);
      if (error.message === 'Image not found' || error.message === 'Image file not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to serve image' });
      }
    }
  }

  /**
   * List all images endpoint handler
   */
  public async listAll(req: Request, res: Response): Promise<void> {
    try {
      const images = await this.imageService.getAllImages();
      res.json({ success: true, images });
    } catch (error: any) {
      console.error('Error listing images:', error);
      res.status(500).json({ error: 'Failed to list images' });
    }
  }

  /**
   * Download image endpoint handler
   */
  public async download(req: Request, res: Response): Promise<void> {
    try {
      const { imageId } = req.params;
      const { path: imagePath } = await this.imageService.getImageById(imageId);
      const filename = await this.imageService.getDownloadFilename(imageId);
      res.download(imagePath, filename);
    } catch (error: any) {
      console.error('Error downloading image:', error);
      if (error.message === 'Image not found' || error.message === 'Image file not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to download image' });
      }
    }
  }
}

