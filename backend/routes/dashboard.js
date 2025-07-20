const express = require('express');
const router = express.Router();
const { authenticateToken, rateLimit } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Apply rate limiting to all routes
router.use(rateLimit);

// All routes require authentication
router.use(authenticateToken);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent-doctors', dashboardController.getRecentDoctors);
router.get('/recent-consultants', dashboardController.getRecentConsultants);
router.get('/activity-feed', dashboardController.getActivityFeed);

module.exports = router; 