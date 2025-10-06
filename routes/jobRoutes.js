import express from 'express';
import { 
  createJobPosting, 
  listJobs, 
  getJob, 
  updateJobPosting, 
  submitJobApplication, 
  listJobApplications,
  getUserJobApplications
} from '../controllers/jobController.js';
import { verifyToken, checkRole } from '../middleware/authorization.js';

const router = express.Router();

// Public routes
router.get('/', listJobs);
router.get('/:jobId', getJob);

// Protected routes (clients and municipal workers can create jobs)
router.post('/', verifyToken, checkRole(['client', 'municipal_worker']), createJobPosting);
router.put('/:jobId', verifyToken, updateJobPosting);

// Application routes
router.post('/:jobId/apply', verifyToken, submitJobApplication);
router.get('/:jobId/applications', verifyToken, listJobApplications);
router.get('/user/applications', verifyToken, getUserJobApplications);

export default router;
