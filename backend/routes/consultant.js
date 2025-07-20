const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole, rateLimit } = require('../middleware/authMiddleware');
const consultantController = require('../controllers/consultantController');
const { validate } = require('../utils/validate');

// Apply rate limiting to all routes
router.use(rateLimit);

// All routes require authentication
router.use(authenticateToken);

// Consultant CRUD operations
router.get('/', consultantController.getConsultants);
router.post('/', consultantController.validate, validate, consultantController.createConsultant);

// Stats and bulk operations (these must come before specific ID routes)
router.get('/stats', consultantController.getConsultantStats);
router.post('/bulk-delete', consultantController.bulkDeleteConsultants);
router.post('/bulk-export', consultantController.bulkExportConsultants);

// Mapping endpoints
router.post('/:id/map-doctor', consultantController.addDoctorMapping);
router.put('/:id/update-mapping/:doctorId', consultantController.updateDoctorMapping);
router.delete('/:id/unmap-doctor/:doctorId', consultantController.removeDoctorMapping);

// Individual consultant operations (these must come last)
router.get('/:id', consultantController.getConsultantById);
router.put('/:id', consultantController.validate, validate, consultantController.updateConsultant);
router.delete('/:id', consultantController.deleteConsultant);

module.exports = router;
