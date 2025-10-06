import { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  applyForJob, 
  getJobApplications, 
  getUserApplications 
} from '../services/jobService.js';

// Create job
export const createJobPosting = (req, res) => {
  const userId = req.user.id;
  const jobData = req.body;

  if (!jobData.title || !jobData.description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  createJob(userId, jobData, (err, job) => {
    if (err) {
      console.error('Create job error:', err);
      return res.status(500).json({ error: err.message || 'Error creating job' });
    }

    res.status(201).json({ 
      message: 'Job created successfully',
      job 
    });
  });
};

// Get all jobs
export const listJobs = (req, res) => {
  const filters = {
    status: req.query.status,
    category: req.query.category
  };

  getAllJobs(filters, (err, jobs) => {
    if (err) {
      console.error('List jobs error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching jobs' });
    }

    res.status(200).json({ jobs });
  });
};

// Get single job
export const getJob = (req, res) => {
  const { jobId } = req.params;

  getJobById(jobId, (err, job) => {
    if (err) {
      console.error('Get job error:', err);
      return res.status(404).json({ error: err.message || 'Job not found' });
    }

    res.status(200).json({ job });
  });
};

// Update job
export const updateJobPosting = (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  updateJob(jobId, userId, updates, (err, job) => {
    if (err) {
      console.error('Update job error:', err);
      return res.status(400).json({ error: err.message || 'Error updating job' });
    }

    res.status(200).json({ 
      message: 'Job updated successfully',
      job 
    });
  });
};

// Apply for job
export const submitJobApplication = (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  const applicationData = req.body;

  applyForJob(jobId, userId, applicationData, (err, application) => {
    if (err) {
      console.error('Apply for job error:', err);
      return res.status(400).json({ error: err.message || 'Error submitting application' });
    }

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application 
    });
  });
};

// Get applications for a job
export const listJobApplications = (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  getJobApplications(jobId, userId, (err, applications) => {
    if (err) {
      console.error('Get applications error:', err);
      return res.status(403).json({ error: err.message || 'Error fetching applications' });
    }

    res.status(200).json({ applications });
  });
};

// Get user's applications
export const getUserJobApplications = (req, res) => {
  const userId = req.user.id;

  getUserApplications(userId, (err, applications) => {
    if (err) {
      console.error('Get user applications error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching applications' });
    }

    res.status(200).json({ applications });
  });
};
