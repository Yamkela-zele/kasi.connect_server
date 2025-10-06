import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/dbconfig.js';

// Create or update business profile
export const createBusinessProfile = (userId, businessData, callback) => {
  const checkSql = 'SELECT id FROM businesses WHERE user_id = ?';
  
  query(checkSql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length > 0) {
      // Update existing business
      updateBusinessProfile(results[0].id, businessData, callback);
    } else {
      // Create new business
      const businessId = uuidv4();
      const { business_name, description, category, services, location, phone, registration_number, website } = businessData;
      
      const insertSql = `
        INSERT INTO businesses (id, user_id, business_name, description, category, services, location, phone, registration_number, website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      query(insertSql, [businessId, userId, business_name, description, category, services, location, phone, registration_number, website], (insertErr) => {
        if (insertErr) {
          return callback({ message: 'Error creating business profile', error: insertErr }, null);
        }

        getBusinessProfile(userId, callback);
      });
    }
  });
};

// Update business profile
export const updateBusinessProfile = (businessId, businessData, callback) => {
  const { business_name, description, category, services, location, phone, registration_number, website } = businessData;
  
  const sql = `
    UPDATE businesses 
    SET business_name = ?, description = ?, category = ?, services = ?, 
        location = ?, phone = ?, registration_number = ?, website = ?,
        updated_at = NOW()
    WHERE id = ?
  `;
  
  query(sql, [business_name, description, category, services, location, phone, registration_number, website, businessId], (err) => {
    if (err) {
      return callback({ message: 'Error updating business profile', error: err }, null);
    }

    const selectSql = 'SELECT * FROM businesses WHERE id = ?';
    query(selectSql, [businessId], (selectErr, results) => {
      if (selectErr) {
        return callback({ message: 'Error fetching updated profile', error: selectErr }, null);
      }
      callback(null, results[0]);
    });
  });
};

// Get business profile by user ID
export const getBusinessProfile = (userId, callback) => {
  const sql = 'SELECT * FROM businesses WHERE user_id = ?';
  
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

// Get all businesses
export const getAllBusinesses = (callback) => {
  const sql = `
    SELECT b.*, u.name as owner_name, u.verified as owner_verified 
    FROM businesses b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `;
  
  query(sql, [], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }
    callback(null, results);
  });
};
