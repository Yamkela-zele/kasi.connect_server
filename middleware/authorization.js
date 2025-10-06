import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Access denied.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};

// Check if user has specific role
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (user, callback) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  };

  jwt.sign(payload, JWT_SECRET, options, (err, token) => {
    if (err) {
      console.error('Error generating token:', err.message);
      return callback(err, null);
    }
    callback(null, token);
  });
};

// Verify token utility function
export const verifyTokenUtil = (token, callback) => {
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, decoded);
  });
};
