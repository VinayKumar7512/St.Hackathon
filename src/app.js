import express from 'express';
import { config } from './config/env.js';
import { database } from './config/database.js';
import { router } from './routes/index.js';
import { 
  errorHandler, 
  notFoundHandler 
} from './middleware/errorHandler.js';
import {
  rateLimiter,
  oauthRateLimiter,
  securityHeaders,
  corsMiddleware,
  requestLogger,
  sanitizeInput
} from './middleware/security.js';

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(securityHeaders);
    this.app.use(corsMiddleware);
    this.app.use(rateLimiter);
    
    // Request processing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(sanitizeInput);
    
    // Logging
    if (config.NODE_ENV !== 'test') {
      this.app.use(requestLogger);
    }
    
    // OAuth specific rate limiting
    this.app.use('/auth', oauthRateLimiter);
    this.app.use('/callback', oauthRateLimiter);
  }

  setupRoutes() {
    this.app.use('/', router);
  }

  setupErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  async start() {
    try {
      // Connect to database
      await database.connect();
      
      // Start server
      const server = this.app.listen(config.PORT, () => {
        console.log(`🚀 OAuth Test Server running at http://localhost:${config.PORT}`);
        console.log(`📝 Environment: ${config.NODE_ENV}`);
        console.log(`🔗 Visit http://localhost:${config.PORT} to test OAuth flows`);
        console.log(`📊 View stored users at http://localhost:${config.PORT}/users`);
        console.log(`❤️ Health check at http://localhost:${config.PORT}/health`);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown(server));
      process.on('SIGINT', () => this.shutdown(server));
      
      return server;
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async shutdown(server) {
    console.log('🔄 Shutting down server gracefully...');
    
    server.close(async () => {
      console.log('📴 HTTP server closed');
      
      try {
        await database.disconnect();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }

  getApp() {
    return this.app;
  }
}

export { App };
