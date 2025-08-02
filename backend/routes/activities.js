const express = require('express');
const router = express.Router();
const doctorActivityController = require('../controllers/doctorActivityController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/activities - Get all activities with filters
router.get('/', doctorActivityController.getActivities);

// GET /api/activities/stats - Get activity statistics
router.get('/stats', doctorActivityController.getActivityStats);

// GET /api/activities/:id - Get specific activity
router.get('/:id', doctorActivityController.getActivityById);

// POST /api/activities - Create new activity
router.post('/', doctorActivityController.validate, doctorActivityController.createActivity);

// PUT /api/activities/:id - Update activity
router.put('/:id', doctorActivityController.validate, doctorActivityController.updateActivity);

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', doctorActivityController.deleteActivity);

// POST /api/activities/bulk-delete - Bulk delete activities
router.post('/bulk-delete', doctorActivityController.bulkDeleteActivities);

module.exports = router; 