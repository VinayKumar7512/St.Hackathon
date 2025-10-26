import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

// User management routes
router.get('/users', userController.getAllUsers);
router.get('/users/stats', userController.getUserStats);
router.get('/users/:id', userController.getUserById);
router.patch('/users/:id/deactivate', userController.deactivateUser);

export { router as userRoutes };
