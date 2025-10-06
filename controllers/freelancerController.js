import { createFreelancerProfile, getFreelancerProfile, getAllFreelancers } from '../services/freelancerService.js';

// Create freelancer profile
export const createFreelancer = (req, res) => {
  const userId = req.user.id;
  const freelancerData = req.body;

  createFreelancerProfile(userId, freelancerData, (err, freelancer) => {
    if (err) {
      console.error('Create freelancer error:', err);
      return res.status(500).json({ error: err.message || 'Error creating freelancer profile' });
    }

    res.status(201).json({ 
      message: 'Freelancer profile created successfully',
      freelancer 
    });
  });
};

// Get freelancer profile
export const getFreelancer = (req, res) => {
  const userId = req.user.id;

  getFreelancerProfile(userId, (err, freelancer) => {
    if (err) {
      console.error('Get freelancer error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching freelancer profile' });
    }

    res.status(200).json({ freelancer });
  });
};

// Get all freelancers
export const listFreelancers = (req, res) => {
  getAllFreelancers((err, freelancers) => {
    if (err) {
      console.error('List freelancers error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching freelancers' });
    }

    res.status(200).json({ freelancers });
  });
};
