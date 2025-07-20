const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole, rateLimit } = require('../middleware/authMiddleware');
const doctorController = require('../controllers/doctorController');
const { validate } = require('../utils/validate');

// Apply rate limiting to all routes
router.use(rateLimit);

// All routes require authentication
router.use(authenticateToken);

// Doctor CRUD operations
router.get('/', doctorController.getDoctors);
router.get('/stats', doctorController.getDoctorStats);
router.post('/', doctorController.validate, validate, doctorController.createDoctor);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id', doctorController.validate, validate, doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

// Bulk operations
router.post('/bulk-delete', doctorController.bulkDeleteDoctors);
router.post('/bulk-export', doctorController.bulkExportDoctors);

module.exports = router;
