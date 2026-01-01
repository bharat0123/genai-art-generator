import express from 'express';
import { ImageController } from '../controllers/ImageController';
import { ImageGenerationService } from '../services/ImageGenerationService';
import { ImageGenerationServiceFactory } from '../factories/ImageGenerationServiceFactory';
import { FileImageRepository } from '../repositories/FileImageRepository';
import { IImageRepository } from '../repositories/IImageRepository';

const imageRepository: IImageRepository = new FileImageRepository();
const generationStrategy = ImageGenerationServiceFactory.createStrategy('langchain');
const imageService = new ImageGenerationService(generationStrategy, imageRepository);
const imageController = new ImageController(imageService);

export const imageRouter = express.Router();

imageRouter.post('/generate', (req, res) => imageController.generate(req, res));
imageRouter.get('/', (req, res) => imageController.listAll(req, res));
imageRouter.get('/:imageId', (req, res) => imageController.getById(req, res));
imageRouter.get('/:imageId/download', (req, res) => imageController.download(req, res));
