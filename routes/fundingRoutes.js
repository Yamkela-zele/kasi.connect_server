import express from 'express';
import { 
  applyForFunding, 
  listAllFundingApplications, 
  getMyFundingApplications,
  reviewApplication
} from '../controllers/fundingController.js';
import { verifyToken, checkRole } from '../middleware/authorization.js';

const router = express.Router();

// Protected routes
router.post('/apply', verifyToken, checkRole(['business_owner']), applyForFunding);
router.get('/my-applications', verifyToken, getMyFundingApplications);

// Municipal worker only routes
router.get('/applications', verifyToken, checkRole(['municipal_worker']), listAllFundingApplications);
router.put('/:applicationId/review', verifyToken, checkRole(['municipal_worker']), reviewApplication);

export default router;
