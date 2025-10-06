import { registerUser, loginUser, getUserById, updateUserProfile } from '../services/authService.js';

// Register controller
export const register = (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const validRoles = ['business_owner', 'freelancer', 'client', 'municipal_worker'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  registerUser({ email, password, name, role }, (err, result) => {
    if (err) {
      console.error('Registration error:', err);
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  });
};

// Login controller
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  loginUser({ email, password }, (err, result) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(401).json({ error: err.message || 'Login failed' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  });
};

// Get profile controller
export const getProfile = (req, res) => {
  const userId = req.user.id;

  getUserById(userId, (err, user) => {
    if (err) {
      console.error('Get profile error:', err);
      return res.status(404).json({ error: err.message || 'User not found' });
    }

    res.status(200).json({ user });
  });
};

// Update profile controller
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  updateUserProfile(userId, updates, (err, user) => {
    if (err) {
      console.error('Update profile error:', err);
      return res.status(400).json({ error: err.message || 'Update failed' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user 
    });
  });
};

// Verify user (municipal workers only)
export const verifyUser = (req, res) => {
  const { userId } = req.params;
  const reviewerId = req.user.id;

  import('../config/dbconfig.js').then(({ query }) => {
    const sql = `
      UPDATE users 
      SET verified = TRUE, verified_by = ?, verified_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `;

    query(sql, [reviewerId, userId], (err) => {
      if (err) {
        console.error('Verify user error:', err);
        return res.status(500).json({ error: 'Error verifying user' });
      }

      getUserById(userId, (getUserErr, user) => {
        if (getUserErr) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ 
          message: 'User verified successfully',
          user 
        });
      });
    });
  });
};
