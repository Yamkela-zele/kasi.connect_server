import express from 'express';
import { register, login, getProfile, updateProfile, verifyUser } from '../controllers/authController.js';
import { verifyToken, checkRole } from '../middleware/authorization.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Municipal worker only
router.put('/verify/:userId', verifyToken, checkRole(['municipal_worker']), verifyUser);

export default router;
