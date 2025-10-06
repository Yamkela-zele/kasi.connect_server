import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/dbconfig.js';

// Submit funding application
export const submitFundingApplication = (userId, applicationData, callback) => {
  const applicationId = uuidv4();
  const { business_name, amount, purpose, business_plan, financial_statements } = applicationData;
  
  const sql = `
    INSERT INTO funding_applications (id, user_id, business_name, amount, purpose, business_plan, financial_statements, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  
  query(sql, [applicationId, userId, business_name, amount, purpose, business_plan, financial_statements], (err) => {
    if (err) {
      return callback({ message: 'Error submitting funding application', error: err }, null);
    }

    getFundingApplicationById(applicationId, callback);
  });
};

// Get funding application by ID
export const getFundingApplicationById = (applicationId, callback) => {
  const sql = `
    SELECT f.*, u.name as applicant_name, u.email as applicant_email 
    FROM funding_applications f
    JOIN users u ON f.user_id = u.id
    WHERE f.id = ?
  `;
  
  query(sql, [applicationId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'Funding application not found' }, null);
    }

    callback(null, results[0]);
  });
};

// Get all funding applications (for municipal workers)
export const getAllFundingApplications = (filters, callback) => {
  let sql = `
    SELECT f.*, u.name as applicant_name, u.email as applicant_email 
    FROM funding_applications f
    JOIN users u ON f.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    sql += ' AND f.status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY f.created_at DESC';

  query(sql, params, (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};

// Get user's funding applications
export const getUserFundingApplications = (userId, callback) => {
  const sql = `
    SELECT * FROM funding_applications 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  
  query(sql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};

// Review funding application (municipal workers only)
export const reviewFundingApplication = (applicationId, reviewerId, reviewData, callback) => {
  const { status, review_notes } = reviewData;
  
  const sql = `
    UPDATE funding_applications 
    SET status = ?, review_notes = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW()
    WHERE id = ?
  `;
  
  query(sql, [status, review_notes, reviewerId, applicationId], (err) => {
    if (err) {
      return callback({ message: 'Error reviewing funding application', error: err }, null);
    }

    getFundingApplicationById(applicationId, callback);
  });
};
