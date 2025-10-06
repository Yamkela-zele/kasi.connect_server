import express from 'express';
import { createBusiness, getBusiness, listBusinesses } from '../controllers/businessController.js';
import { verifyToken, checkRole } from '../middleware/authorization.js';

const router = express.Router();

// Protected routes (business owners only for create/update)
router.post('/profile', verifyToken, checkRole(['business_owner']), createBusiness);
router.get('/profile', verifyToken, getBusiness);

// Public route
router.get('/all', listBusinesses);

export default router;
