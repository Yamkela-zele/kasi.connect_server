import { 
  submitFundingApplication, 
  getAllFundingApplications, 
  getUserFundingApplications,
  reviewFundingApplication 
} from '../services/fundingService.js';

// Submit funding application
export const applyForFunding = (req, res) => {
  const userId = req.user.id;
  const applicationData = req.body;

  if (!applicationData.business_name || !applicationData.amount || !applicationData.purpose) {
    return res.status(400).json({ error: 'Business name, amount, and purpose are required' });
  }

  submitFundingApplication(userId, applicationData, (err, application) => {
    if (err) {
      console.error('Submit funding application error:', err);
      return res.status(500).json({ error: err.message || 'Error submitting funding application' });
    }

    res.status(201).json({ 
      message: 'Funding application submitted successfully',
      application 
    });
  });
};

// Get all funding applications (municipal workers only)
export const listAllFundingApplications = (req, res) => {
  const filters = {
    status: req.query.status
  };

  getAllFundingApplications(filters, (err, applications) => {
    if (err) {
      console.error('List funding applications error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching funding applications' });
    }

    res.status(200).json({ applications });
  });
};

// Get user's funding applications
export const getMyFundingApplications = (req, res) => {
  const userId = req.user.id;

  getUserFundingApplications(userId, (err, applications) => {
    if (err) {
      console.error('Get user funding applications error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching your applications' });
    }

    res.status(200).json({ applications });
  });
};

// Review funding application (municipal workers only)
export const reviewApplication = (req, res) => {
  const { applicationId } = req.params;
  const reviewerId = req.user.id;
  const { status, review_notes } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['approved', 'rejected', 'under_review'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  reviewFundingApplication(applicationId, reviewerId, { status, review_notes }, (err, application) => {
    if (err) {
      console.error('Review funding application error:', err);
      return res.status(500).json({ error: err.message || 'Error reviewing application' });
    }

    res.status(200).json({ 
      message: 'Funding application reviewed successfully',
      application 
    });
  });
};
