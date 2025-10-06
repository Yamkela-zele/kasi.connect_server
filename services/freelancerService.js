import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/dbconfig.js';

// Create or update freelancer profile
export const createFreelancerProfile = (userId, freelancerData, callback) => {
  const checkSql = 'SELECT id FROM freelancers WHERE user_id = ?';
  
  query(checkSql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length > 0) {
      // Update existing freelancer
      updateFreelancerProfile(results[0].id, freelancerData, callback);
    } else {
      // Create new freelancer
      const freelancerId = uuidv4();
      const { title, bio, skills, experience_years, hourly_rate, portfolio_url, location, phone } = freelancerData;
      
      const insertSql = `
        INSERT INTO freelancers (id, user_id, title, bio, skills, experience_years, hourly_rate, portfolio_url, location, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      query(insertSql, [freelancerId, userId, title, bio, skills, experience_years, hourly_rate, portfolio_url, location, phone], (insertErr) => {
        if (insertErr) {
          return callback({ message: 'Error creating freelancer profile', error: insertErr }, null);
        }

        getFreelancerProfile(userId, callback);
      });
    }
  });
};

// Update freelancer profile
export const updateFreelancerProfile = (freelancerId, freelancerData, callback) => {
  const { title, bio, skills, experience_years, hourly_rate, portfolio_url, location, phone } = freelancerData;
  
  const sql = `
    UPDATE freelancers 
    SET title = ?, bio = ?, skills = ?, experience_years = ?, 
        hourly_rate = ?, portfolio_url = ?, location = ?, phone = ?,
        updated_at = NOW()
    WHERE id = ?
  `;
  
  query(sql, [title, bio, skills, experience_years, hourly_rate, portfolio_url, location, phone, freelancerId], (err) => {
    if (err) {
      return callback({ message: 'Error updating freelancer profile', error: err }, null);
    }

    const selectSql = 'SELECT * FROM freelancers WHERE id = ?';
    query(selectSql, [freelancerId], (selectErr, results) => {
      if (selectErr) {
        return callback({ message: 'Error fetching updated profile', error: selectErr }, null);
      }
      callback(null, results[0]);
    });
  });
};

// Get freelancer profile by user ID
export const getFreelancerProfile = (userId, callback) => {
  const sql = 'SELECT * FROM freelancers WHERE user_id = ?';
  
  query(sql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback(null, null);
    }

    callback(null, results[0]);
  });
};

// Get all freelancers
export const getAllFreelancers = (callback) => {
  const sql = `
    SELECT f.*, u.name as freelancer_name, u.verified as freelancer_verified 
    FROM freelancers f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
  `;
  
  query(sql, [], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};
