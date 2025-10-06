import { createBusinessProfile, getBusinessProfile, getAllBusinesses } from '../services/businessService.js';

// Create business profile
export const createBusiness = (req, res) => {
  const userId = req.user.id;
  const businessData = req.body;

  if (!businessData.business_name) {
    return res.status(400).json({ error: 'Business name is required' });
  }

  createBusinessProfile(userId, businessData, (err, business) => {
    if (err) {
      console.error('Create business error:', err);
      return res.status(500).json({ error: err.message || 'Error creating business profile' });
    }

    res.status(201).json({ 
      message: 'Business profile created successfully',
      business 
    });
  });
};

// Get business profile
export const getBusiness = (req, res) => {
  const userId = req.user.id;

  getBusinessProfile(userId, (err, business) => {
    if (err) {
      console.error('Get business error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching business profile' });
    }

    res.status(200).json({ business });
  });
};

// Get all businesses
export const listBusinesses = (req, res) => {
  getAllBusinesses((err, businesses) => {
    if (err) {
      console.error('List businesses error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching businesses' });
    }

    res.status(200).json({ businesses });
  });
};
