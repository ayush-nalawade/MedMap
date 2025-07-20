const Consultant = require('../models/Consultant');
const Doctor = require('../models/Doctor');
const Activity = require('../models/Activity');
const { body, validationResult } = require('express-validator');

exports.validate = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
  body('specialization').notEmpty().trim().withMessage('Specialization is required'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('subLocation').notEmpty().trim().withMessage('Sub-location is required'),
  body('preferredHospitals').optional().isArray().withMessage('Preferred hospitals must be an array'),
  body('experience').notEmpty().trim().withMessage('Experience is required'),
  body('avatar').optional().custom((value) => {
    // Accept http(s) URLs or data:image/svg+xml URIs
    return (
      /^https?:\/\//.test(value) ||
      /^data:image\/svg\+xml/.test(value)
    );
  }).withMessage('Avatar must be a valid URL or SVG data URI'),
];

// Helper function to add 'Dr' prefix to names
const addDrPrefix = (name) => {
  const trimmedName = name.trim();
  if (trimmedName.toLowerCase().startsWith('dr.')) {
    return trimmedName;
  }
  if (trimmedName.toLowerCase().startsWith('dr ')) {
    return trimmedName.replace(/^dr\s/i, 'Dr. ');
  }
  return `Dr. ${trimmedName}`;
};

// GET /api/consultants?location=&specialization=&search=&page=&limit=&sortBy=&sortOrder=
exports.getConsultants = async (req, res) => {
  try {
    const { 
      location, 
      specialization, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      subLocation,
      phoneNumber
    } = req.query;
    
    // Base query - only show consultants belonging to the authenticated user
    const query = { user: req.user._id };
    
    // Add filters
    if (location) query.location = location;
    if (specialization) query.specialization = specialization;
    if (subLocation) query.subLocation = { $regex: subLocation, $options: 'i' };
    if (phoneNumber) query.phone = { $regex: phoneNumber, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { subLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const consultants = await Consultant.find(query)
      .populate('mappedDoctors.doctor', 'name specialization')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Consultant.countDocuments(query);
    
    res.json({ 
      success: true,
      consultants, 
      total, 
      page: Number(page), 
      limit: Number(limit) 
    });
  } catch (error) {
    console.error('Error getting consultants:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// GET /api/consultants/stats
exports.getConsultantStats = async (req, res) => {
  try {
    // Only count consultants belonging to the authenticated user
    const userQuery = { user: req.user._id };
    
    const totalConsultants = await Consultant.countDocuments(userQuery);
    const specializations = await Consultant.aggregate([
      { $match: userQuery },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const locations = await Consultant.aggregate([
      { $match: userQuery },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get mapping statistics for user's consultants only
    const mappingStats = await Consultant.aggregate([
      { $match: userQuery },
      {
        $project: {
          mappingCount: { $size: { $ifNull: ["$mappedDoctors", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalMappings: { $sum: "$mappingCount" },
          avgMappings: { $avg: "$mappingCount" }
        }
      }
    ]);
    
    res.json({ 
      success: true,
      totalConsultants, 
      specializations, 
      locations,
      mappingStats: mappingStats[0] || { totalMappings: 0, avgMappings: 0 }
    });
  } catch (error) {
    console.error('Error getting consultant stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.getConsultantById = async (req, res) => {
  try {
    console.log('Getting consultant by ID:', req.params.id);
    
    // Only allow access to consultants belonging to the authenticated user
    const consultant = await Consultant.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('mappedDoctors.doctor');
    
    console.log('Found consultant:', consultant);
    
    if (!consultant) {
      console.log('Consultant not found or access denied');
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found' 
      });
    }
    
    res.json({
      success: true,
      consultant
    });
  } catch (error) {
    console.error('Error in getConsultantById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.createConsultant = async (req, res) => {
  try {
    console.log('Received consultant data:', req.body);
    
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Express-validator errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: errors.array().map(err => err.msg)
      });
    }

    // Cross-collection uniqueness check
    const emailExistsInDoctors = await Doctor.findOne({ email: req.body.email });
    if (emailExistsInDoctors) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists in doctors'
      });
    }
    const phoneExistsInDoctors = await Doctor.findOne({ phone: req.body.phone });
    if (phoneExistsInDoctors) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already exists in doctors'
      });
    }
    
    // Add user ID to consultant data and add 'Dr' prefix to name
    const consultantData = {
      ...req.body,
      name: addDrPrefix(req.body.name),
      user: req.user._id
    };
    
    const consultant = new Consultant(consultantData);
    await consultant.save();
    
    // Log activity
    await Activity.create({
      type: 'consultant_added',
      description: `New consultant ${consultant.name} added to ${consultant.specialization}`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Consultant'
    });
    
    res.status(201).json({
      success: true,
      consultant
    });
  } catch (error) {
    console.error('Error creating consultant:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      console.log('Mongoose validation errors:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors 
      });
    }
    
    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.updateConsultant = async (req, res) => {
  try {
    console.log('Updating consultant data:', req.body);
    
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Express-validator errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: errors.array().map(err => err.msg)
      });
    }

    // Cross-collection uniqueness check (if email/phone is being updated)
    if (req.body.email) {
      const emailExistsInDoctors = await Doctor.findOne({ email: req.body.email });
      if (emailExistsInDoctors) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists in doctors'
        });
      }
    }
    if (req.body.phone) {
      const phoneExistsInDoctors = await Doctor.findOne({ phone: req.body.phone });
      if (phoneExistsInDoctors) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists in doctors'
        });
      }
    }
    
    // Add 'Dr' prefix to name if it's being updated
    const updateData = { ...req.body };
    if (updateData.name) {
      updateData.name = addDrPrefix(updateData.name);
    }
    
    // Only allow updating consultants belonging to the authenticated user
    const consultant = await Consultant.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    
    if (!consultant) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found or access denied' 
      });
    }
    
    // Log activity
    await Activity.create({
      type: 'consultant_updated',
      description: `Consultant ${consultant.name} profile updated`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Consultant'
    });
    
    res.json({
      success: true,
      consultant
    });
  } catch (error) {
    console.error('Error updating consultant:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      console.log('Mongoose validation errors:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors 
      });
    }
    
    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.deleteConsultant = async (req, res) => {
  try {
    // Only allow deleting consultants belonging to the authenticated user
    const consultant = await Consultant.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!consultant) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found or access denied' 
      });
    }
    
    await Consultant.findByIdAndDelete(req.params.id);
    
    // Log activity
    await Activity.create({
      type: 'consultant_deleted',
      description: `Consultant ${consultant.name} deleted`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Consultant'
    });
    
    res.json({ 
      success: true,
      message: 'Consultant deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting consultant:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/consultants/:id/map-doctor { doctorId, referrals }
exports.addDoctorMapping = async (req, res) => {
  try {
    const { doctorId, referrals } = req.body;
    
    // Only allow mapping to consultants belonging to the authenticated user
    const consultant = await Consultant.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!consultant) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found or access denied' 
      });
    }
    
    // Check if doctor exists and belongs to the same user
    const doctor = await Doctor.findOne({
      _id: doctorId,
      user: req.user._id
    });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    // Prevent duplicate mapping
    if (consultant.mappedDoctors.some(md => md.doctor.toString() === doctorId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Doctor already mapped' 
      });
    }
    
    consultant.mappedDoctors.push({ doctor: doctorId, referrals: referrals || 0 });
    await consultant.save();
    
    // Log activity
    await Activity.create({
      type: 'mapping_created',
      description: `New doctor-consultant mapping created for ${doctor.name}`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Mapping',
      metadata: { doctorName: doctor.name, referrals: referrals || 0 }
    });
    
    res.json({
      success: true,
      consultant
    });
  } catch (error) {
    console.error('Error adding doctor mapping:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// PUT /api/consultants/:id/update-mapping/:doctorId { referrals }
exports.updateDoctorMapping = async (req, res) => {
  try {
    console.log('Updating doctor mapping:', {
      consultantId: req.params.id,
      doctorId: req.params.doctorId,
      referrals: req.body.referrals
    });

    const { referrals } = req.body;
    
    // Only allow updating mappings for consultants belonging to the authenticated user
    const consultant = await Consultant.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!consultant) {
      console.log('Consultant not found or access denied:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found or access denied' 
      });
    }
    
    // Check if doctor exists and belongs to the same user
    const doctor = await Doctor.findOne({
      _id: req.params.doctorId,
      user: req.user._id
    });
    
    if (!doctor) {
      console.log('Doctor not found or access denied:', req.params.doctorId);
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    // Find and update the mapping
    const mappingIndex = consultant.mappedDoctors.findIndex(md => md.doctor.toString() === req.params.doctorId);
    if (mappingIndex === -1) {
      console.log('Mapping not found for doctor:', req.params.doctorId);
      return res.status(404).json({ 
        success: false,
        message: 'Mapping not found' 
      });
    }
    
    console.log('Found mapping at index:', mappingIndex);
    console.log('Current referrals:', consultant.mappedDoctors[mappingIndex].referrals);
    console.log('New referrals:', referrals);
    
    consultant.mappedDoctors[mappingIndex].referrals = referrals || 0;
    await consultant.save();
    
    console.log('Mapping updated successfully');
    
    // Log activity
    await Activity.create({
      type: 'mapping_updated',
      description: `Doctor-consultant mapping updated for ${doctor.name}`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Mapping',
      metadata: { doctorName: doctor.name, referrals: referrals || 0 }
    });
    
    res.json({
      success: true,
      consultant
    });
  } catch (error) {
    console.error('Error updating mapping:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// DELETE /api/consultants/:id/unmap-doctor/:doctorId
exports.removeDoctorMapping = async (req, res) => {
  try {
    // Only allow removing mappings for consultants belonging to the authenticated user
    const consultant = await Consultant.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!consultant) {
      return res.status(404).json({ 
        success: false,
        message: 'Consultant not found or access denied' 
      });
    }
    
    const doctor = await Doctor.findOne({
      _id: req.params.doctorId,
      user: req.user._id
    });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    // Remove the mapping
    consultant.mappedDoctors = consultant.mappedDoctors.filter(
      md => md.doctor.toString() !== req.params.doctorId
    );
    await consultant.save();
    
    // Log activity
    await Activity.create({
      type: 'mapping_removed',
      description: `Doctor-consultant mapping removed for ${doctor.name}`,
      user: req.user._id,
      targetId: consultant._id,
      targetType: 'Mapping',
      metadata: { doctorName: doctor.name }
    });
    
    res.json({
      success: true,
      message: 'Mapping removed successfully',
      consultant
    });
  } catch (error) {
    console.error('Error removing doctor mapping:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/consultants/bulk-delete
exports.bulkDeleteConsultants = async (req, res) => {
  try {
    const { consultantIds } = req.body;
    if (!consultantIds || !Array.isArray(consultantIds)) {
      return res.status(400).json({ msg: 'Consultant IDs array is required' });
    }
    
    const deletedConsultants = await Consultant.find({ _id: { $in: consultantIds } });
    await Consultant.deleteMany({ _id: { $in: consultantIds } });
    
    // Log activity
    await Activity.create({
      type: 'bulk_operation',
      description: `Bulk deleted ${deletedConsultants.length} consultants`,
      user: req.user.id,
      metadata: { deletedCount: deletedConsultants.length, consultantNames: deletedConsultants.map(c => c.name) }
    });
    
    res.json({ msg: `${deletedConsultants.length} consultants deleted successfully` });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// POST /api/consultants/bulk-export
exports.bulkExportConsultants = async (req, res) => {
  try {
    const { consultantIds } = req.body;
    let query = {};
    
    if (consultantIds && Array.isArray(consultantIds) && consultantIds.length > 0) {
      query._id = { $in: consultantIds };
    }
    
    const consultants = await Consultant.find(query)
      .populate('mappedDoctors.doctor', 'name specialization')
      .select('-__v');
    res.json({ consultants });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
