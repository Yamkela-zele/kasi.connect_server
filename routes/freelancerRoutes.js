import express from 'express';
import { createFreelancer, getFreelancer, listFreelancers } from '../controllers/freelancerController.js';
import { verifyToken, checkRole } from '../middleware/authorization.js';

const router = express.Router();

// Protected routes (freelancers only for create/update)
router.post('/profile', verifyToken, checkRole(['freelancer']), createFreelancer);
router.get('/profile', verifyToken, getFreelancer);

// Public route
router.get('/all', listFreelancers);

export default router;
