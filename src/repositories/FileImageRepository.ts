import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { IImageRepository } from './IImageRepository';
import { ImageMetadata } from '../models/ImageMetadata';
import { AppConfig } from '../config/AppConfig';

/**
 * Repository Pattern: File-based implementation
 * Handles image storage and retrieval from file system
 */
export class FileImageRepository implements IImageRepository {
  private readonly storagePath: string;

  constructor() {
    const config = AppConfig.getInstance();
    this.storagePath = config.storagePath;
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  public async save(
    imageUrl: string,
    prompt: string,
    size?: string,
    quality?: string
  ): Promise<string> {
    const imageId = uuidv4();
    const imagePath = this.getImagePath(imageId);
    const metadataPath = this.getMetadataPath(imageId);

    // Download and save image
    await this.downloadImage(imageUrl, imagePath);

    // Save metadata
    const metadata = new ImageMetadata(
      imageId,
      prompt,
      new Date(),
      size,
      quality
    );

    fs.writeFileSync(metadataPath, JSON.stringify(metadata.toJSON(), null, 2));

    return imageId;
  }

  public async findById(imageId: string): Promise<ImageMetadata | null> {
    const metadataPath = this.getMetadataPath(imageId);

    if (!fs.existsSync(metadataPath)) {
      return null;
    }

    try {
      const data = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      return ImageMetadata.fromJSON(data);
    } catch (error) {
      console.error(`Error reading metadata for ${imageId}:`, error);
      return null;
    }
  }

  public async findAll(): Promise<ImageMetadata[]> {
    if (!fs.existsSync(this.storagePath)) {
      return [];
    }

    const files = fs.readdirSync(this.storagePath);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    const images: ImageMetadata[] = [];

    for (const file of jsonFiles) {
      try {
        const metadataPath = path.join(this.storagePath, file);
        const data = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        images.push(ImageMetadata.fromJSON(data));
      } catch (error) {
        console.error(`Error reading metadata for ${file}:`, error);
      }
    }

    // Sort by creation date (newest first)
    return images.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  public getImagePath(imageId: string): string {
    return path.join(this.storagePath, `${imageId}.png`);
  }

  public async exists(imageId: string): Promise<boolean> {
    const imagePath = this.getImagePath(imageId);
    return fs.existsSync(imagePath);
  }

  private getMetadataPath(imageId: string): string {
    return path.join(this.storagePath, `${imageId}.json`);
  }

  private downloadImage(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      protocol
        .get(url, (response) => {
          if (response.statusCode === 200) {
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              resolve();
            });
            fileStream.on('error', reject);
          } else if (response.statusCode === 301 || response.statusCode === 302) {
            // Handle redirects
            if (response.headers.location) {
              this.downloadImage(response.headers.location, filePath)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error('Redirect without location header'));
            }
          } else {
            reject(
              new Error(`Failed to download image: ${response.statusCode}`)
            );
          }
        })
        .on('error', reject);
    });
  }
}

