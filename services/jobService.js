import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/dbconfig.js';

// Create job posting
export const createJob = (userId, jobData, callback) => {
  const jobId = uuidv4();
  const { title, description, category, budget, location, job_type, deadline } = jobData;
  
  const sql = `
    INSERT INTO jobs (id, user_id, title, description, category, budget, location, job_type, deadline, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `;
  
  query(sql, [jobId, userId, title, description, category, budget, location, job_type, deadline], (err) => {
    if (err) {
      return callback({ message: 'Error creating job', error: err }, null);
    }

    getJobById(jobId, callback);
  });
};

// Get all jobs
export const getAllJobs = (filters, callback) => {
  let sql = `
    SELECT j.*, u.name as poster_name, u.role as poster_role 
    FROM jobs j
    JOIN users u ON j.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    sql += ' AND j.status = ?';
    params.push(filters.status);
  }

  if (filters.category) {
    sql += ' AND j.category = ?';
    params.push(filters.category);
  }

  sql += ' ORDER BY j.created_at DESC';

  query(sql, params, (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};

// Get job by ID
export const getJobById = (jobId, callback) => {
  const sql = `
    SELECT j.*, u.name as poster_name, u.role as poster_role 
    FROM jobs j
    JOIN users u ON j.user_id = u.id
    WHERE j.id = ?
  `;
  
  query(sql, [jobId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'Job not found' }, null);
    }

    callback(null, results[0]);
  });
};

// Update job
export const updateJob = (jobId, userId, updates, callback) => {
  // First check if user owns the job
  const checkSql = 'SELECT user_id FROM jobs WHERE id = ?';
  
  query(checkSql, [jobId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'Job not found' }, null);
    }

    if (results[0].user_id !== userId) {
      return callback({ message: 'Unauthorized to update this job' }, null);
    }

    const allowedFields = ['title', 'description', 'category', 'budget', 'location', 'job_type', 'status', 'deadline'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      return callback({ message: 'No valid fields to update' }, null);
    }

    values.push(jobId);
    const updateSql = `UPDATE jobs SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

    query(updateSql, values, (updateErr) => {
      if (updateErr) {
        return callback({ message: 'Error updating job', error: updateErr }, null);
      }

      getJobById(jobId, callback);
    });
  });
};

// Apply for job
export const applyForJob = (jobId, userId, applicationData, callback) => {
  // Check if already applied
  const checkSql = 'SELECT id FROM job_applications WHERE job_id = ? AND user_id = ?';
  
  query(checkSql, [jobId, userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length > 0) {
      return callback({ message: 'You have already applied for this job' }, null);
    }

    const applicationId = uuidv4();
    const { cover_letter, proposal, proposed_budget } = applicationData;
    
    const insertSql = `
      INSERT INTO job_applications (id, job_id, user_id, cover_letter, proposal, proposed_budget, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    query(insertSql, [applicationId, jobId, userId, cover_letter, proposal, proposed_budget], (insertErr) => {
      if (insertErr) {
        return callback({ message: 'Error submitting application', error: insertErr }, null);
      }

      const selectSql = 'SELECT * FROM job_applications WHERE id = ?';
      query(selectSql, [applicationId], (selectErr, appResults) => {
        if (selectErr) {
          return callback({ message: 'Error fetching application', error: selectErr }, null);
        }
        callback(null, appResults[0]);
      });
    });
  });
};

// Get applications for a job
export const getJobApplications = (jobId, userId, callback) => {
  // Check if user owns the job
  const checkSql = 'SELECT user_id FROM jobs WHERE id = ?';
  
  query(checkSql, [jobId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'Job not found' }, null);
    }

    if (results[0].user_id !== userId) {
      return callback({ message: 'Unauthorized to view applications' }, null);
    }

    const sql = `
      SELECT a.*, u.name as applicant_name, u.email as applicant_email, u.verified as applicant_verified
      FROM job_applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `;
    
    query(sql, [jobId], (queryErr, applications) => {
      if (queryErr) {
        return callback({ message: 'Error fetching applications', error: queryErr }, null);
      }
      callback(null, applications);
    });
  });
};

// Get user's job applications
export const getUserApplications = (userId, callback) => {
  const sql = `
    SELECT a.*, j.title as job_title, j.category as job_category 
    FROM job_applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.user_id = ?
    ORDER BY a.created_at DESC
  `;
  
  query(sql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};
