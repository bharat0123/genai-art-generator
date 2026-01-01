import express from 'express';
import cors from 'cors';
import path from 'path';
import { imageRouter } from './routes/imageRoutes';
import { AppConfig } from './config/AppConfig';

/**
 * Application Server
 * Uses singleton pattern for configuration
 */
class ApplicationServer {
  private app: express.Application;
  private config: AppConfig;

  constructor() {
    this.config = AppConfig.getInstance();
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  private setupRoutes(): void {
    // API Routes
    this.app.use('/api/images', imageRouter);

    // Serve frontend
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  public start(): void {
    this.app.listen(this.config.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.config.port}`);
      console.log(`📁 Images stored in: ${this.config.storagePath}`);
      console.log(`🌍 Environment: ${this.config.nodeEnv}`);
    });
  }
}

// Start the application
const server = new ApplicationServer();
server.start();

