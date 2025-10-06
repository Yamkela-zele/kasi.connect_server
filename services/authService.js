import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/dbconfig.js';
import { generateToken } from '../middleware/authorization.js';

// Register new user
export const registerUser = (userData, callback) => {
  const { email, password, name, role } = userData;

  // Check if user already exists
  const checkUserSql = 'SELECT id FROM users WHERE email = ?';
  
  query(checkUserSql, [email], (err, results) => {
    if (err) {
      return callback({ message: 'Database error while checking user', error: err }, null);
    }

    if (results.length > 0) {
      return callback({ message: 'User with this email already exists' }, null);
    }

    // Hash password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return callback({ message: 'Error hashing password', error: hashErr }, null);
      }

      const userId = uuidv4();
      const insertSql = `
        INSERT INTO users (id, email, password, name, role, verified) 
        VALUES (?, ?, ?, ?, ?, FALSE)
      `;

      query(insertSql, [userId, email, hashedPassword, name, role], (insertErr) => {
        if (insertErr) {
          return callback({ message: 'Error creating user', error: insertErr }, null);
        }

        const user = { id: userId, email, name, role, verified: false };
        
        // Generate token
        generateToken(user, (tokenErr, token) => {
          if (tokenErr) {
            return callback({ message: 'User created but error generating token', error: tokenErr }, null);
          }

          callback(null, { user, token });
        });
      });
    });
  });
};

// Login user
export const loginUser = (credentials, callback) => {
  const { email, password } = credentials;

  const sql = 'SELECT * FROM users WHERE email = ?';
  
  query(sql, [email], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'Invalid email or password' }, null);
    }

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        return callback({ message: 'Error comparing password', error: compareErr }, null);
      }

      if (!isMatch) {
        return callback({ message: 'Invalid email or password' }, null);
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      // Generate token
      generateToken(userWithoutPassword, (tokenErr, token) => {
        if (tokenErr) {
          return callback({ message: 'Error generating token', error: tokenErr }, null);
        }

        callback(null, { user: userWithoutPassword, token });
      });
    });
  });
};

// Get user by ID
export const getUserById = (userId, callback) => {
  const sql = 'SELECT id, email, name, role, verified, created_at, updated_at FROM users WHERE id = ?';
  
  query(sql, [userId], (err, results) => {
    if (err) {
      return callback({ message: 'Database error', error: err }, null);
    }

    if (results.length === 0) {
      return callback({ message: 'User not found' }, null);
    }

    callback(null, results[0]);
  });
};

// Update user profile
export const updateUserProfile = (userId, updates, callback) => {
  const allowedFields = ['name'];
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

  values.push(userId);
  const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

  query(sql, values, (err) => {
    if (err) {
      return callback({ message: 'Error updating user profile', error: err }, null);
    }

    getUserById(userId, callback);
  });
};
