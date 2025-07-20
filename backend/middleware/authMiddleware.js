const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Enhanced authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is invalid. User not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated. Please contact administrator.' 
      });
    }

    if (user.isLocked) {
      return res.status(423).json({ 
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired. Please login again.' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Authentication failed.' 
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Rate limiting middleware (basic implementation)
const rateLimiter = {};
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // max 100 requests per window

  if (!rateLimiter[ip]) {
    rateLimiter[ip] = { count: 0, resetTime: now + windowMs };
  }

  if (now > rateLimiter[ip].resetTime) {
    rateLimiter[ip] = { count: 0, resetTime: now + windowMs };
  }

  rateLimiter[ip].count++;

  if (rateLimiter[ip].count > maxRequests) {
    return res.status(429).json({ 
      success: false,
      message: 'Too many requests. Please try again later.' 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRole,
  rateLimit
};
