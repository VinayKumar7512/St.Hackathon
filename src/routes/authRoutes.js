import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

// OAuth initiation routes
router.get('/auth/:provider', authController.initiateAuth);

// OAuth callback routes
router.get('/callback/:provider', authController.handleCallback);

export { router as authRoutes };
