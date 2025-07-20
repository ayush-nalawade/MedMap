const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  logout, 
  changePassword,
  validateRegistration,
  validateLogin
} = require('../controllers/authController');
const { authenticateToken, authorizeRole, rateLimit } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
