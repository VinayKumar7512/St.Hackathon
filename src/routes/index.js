import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';
import { oauthService } from '../services/oauthService.js';
import { renderHomePage } from '../utils/htmlRenderer.js';

const router = Router();

// Home route
router.get('/', (req, res) => {
  const availableProviders = oauthService.getAvailableProviders();
  res.send(renderHomePage(availableProviders));
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    availableProviders: oauthService.getAvailableProviders()
  });
});

// Mount sub-routes
router.use('/', authRoutes);
router.use('/', userRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

export { router };
