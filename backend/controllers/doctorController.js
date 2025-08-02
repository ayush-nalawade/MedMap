const Doctor = require('../models/Doctor');
const Activity = require('../models/Activity');
const Consultant = require('../models/Consultant');
const { body, validationResult } = require('express-validator');

exports.validate = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('specialization').notEmpty().trim().withMessage('Specialization is required'),
  body('specializationType').isIn(['Consultant', 'General Practitioner']).withMessage('Specialization type must be either Consultant or General Practitioner'),
  body('location').notEmpty().trim().withMessage('Location is required'),
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

// GET /api/doctors?location=&specialization=&search=&page=&limit=&sortBy=&sortOrder=
exports.getDoctors = async (req, res) => {
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
      phoneNumber,
      specializationType,
      specializations,
      specializationTypes
    } = req.query;
    
    // Base query - only show doctors belonging to the authenticated user
    const query = { user: req.user._id };
    
    // Add filters
    if (location) query.location = location;
    if (subLocation) query.subLocation = { $regex: subLocation, $options: 'i' };
    if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    
    // Handle specialization filters (support both single and multiple)
    if (specializations) {
      const specArray = Array.isArray(specializations) ? specializations : [specializations];
      query.specialization = { $in: specArray };
    } else if (specialization) {
      query.specialization = specialization;
    }
    
    // Handle specialization type filters (support both single and multiple)
    if (specializationTypes) {
      const typeArray = Array.isArray(specializationTypes) ? specializationTypes : [specializationTypes];
      query.specializationType = { $in: typeArray };
    } else if (specializationType) {
      query.specializationType = specializationType;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { subLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Doctor.countDocuments(query);
    
    res.json({ 
      success: true,
      doctors, 
      total, 
      page: Number(page), 
      limit: Number(limit) 
    });
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// GET /api/doctors/stats
exports.getDoctorStats = async (req, res) => {
  try {
    // Only count doctors belonging to the authenticated user
    const userQuery = { user: req.user._id };
    
    const totalDoctors = await Doctor.countDocuments(userQuery);
    const specializations = await Doctor.aggregate([
      { $match: userQuery },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const specializationTypes = await Doctor.aggregate([
      { $match: userQuery },
      { $group: { _id: '$specializationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const locations = await Doctor.aggregate([
      { $match: userQuery },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({ 
      success: true,
      totalDoctors, 
      specializations, 
      specializationTypes,
      locations 
    });
  } catch (error) {
    console.error('Error getting doctor stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    // Only allow access to doctors belonging to the authenticated user
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    // Cross-collection uniqueness check
    const emailExistsInConsultants = await Consultant.findOne({ email: req.body.email });
    if (emailExistsInConsultants) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists in consultants'
      });
    }
    const phoneExistsInConsultants = await Consultant.findOne({ phone: req.body.phone });
    if (phoneExistsInConsultants) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already exists in consultants'
      });
    }
    
    // Add user ID to doctor data and add 'Dr' prefix to name
    const doctorData = {
      ...req.body,
      name: addDrPrefix(req.body.name),
      user: req.user._id
    };
    
    const doctor = new Doctor(doctorData);
    await doctor.save();
    
    // Log activity
    await Activity.create({
      type: 'doctor_added',
      description: `New doctor ${doctor.name} added to ${doctor.specialization}`,
      user: req.user._id,
      targetId: doctor._id,
      targetType: 'Doctor'
    });
    
    res.status(201).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    // Cross-collection uniqueness check (if email/phone is being updated)
    if (req.body.email) {
      const emailExistsInConsultants = await Consultant.findOne({ email: req.body.email });
      if (emailExistsInConsultants) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists in consultants'
        });
      }
    }
    if (req.body.phone) {
      const phoneExistsInConsultants = await Consultant.findOne({ phone: req.body.phone });
      if (phoneExistsInConsultants) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists in consultants'
        });
      }
    }
    
    // Add 'Dr' prefix to name if it's being updated
    const updateData = { ...req.body };
    if (updateData.name) {
      updateData.name = addDrPrefix(updateData.name);
    }
    
    // Only allow updating doctors belonging to the authenticated user
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    // Log activity
    await Activity.create({
      type: 'doctor_updated',
      description: `Doctor ${doctor.name} profile updated`,
      user: req.user._id,
      targetId: doctor._id,
      targetType: 'Doctor'
    });
    
    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    // Only allow deleting doctors belonging to the authenticated user
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found or access denied' 
      });
    }
    
    await Doctor.findByIdAndDelete(req.params.id);
    
    // Log activity
    await Activity.create({
      type: 'doctor_deleted',
      description: `Doctor ${doctor.name} deleted`,
      user: req.user._id,
      targetId: doctor._id,
      targetType: 'Doctor'
    });
    
    res.json({ 
      success: true,
      message: 'Doctor deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/doctors/bulk-delete
exports.bulkDeleteDoctors = async (req, res) => {
  try {
    const { doctorIds } = req.body;
    if (!doctorIds || !Array.isArray(doctorIds)) {
      return res.status(400).json({ 
        success: false,
        message: 'Doctor IDs array is required' 
      });
    }
    
    // Only allow deleting doctors belonging to the authenticated user
    const deletedDoctors = await Doctor.find({ 
      _id: { $in: doctorIds },
      user: req.user._id
    });
    
    if (deletedDoctors.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No doctors found or access denied' 
      });
    }
    
    await Doctor.deleteMany({ 
      _id: { $in: doctorIds },
      user: req.user._id
    });
    
    // Log activity
    await Activity.create({
      type: 'bulk_operation',
      description: `Bulk deleted ${deletedDoctors.length} doctors`,
      user: req.user._id,
      metadata: { 
        deletedCount: deletedDoctors.length, 
        doctorNames: deletedDoctors.map(d => d.name) 
      }
    });
    
    res.json({ 
      success: true,
      message: `${deletedDoctors.length} doctors deleted successfully` 
    });
  } catch (error) {
    console.error('Error bulk deleting doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/doctors/bulk-export
exports.bulkExportDoctors = async (req, res) => {
  try {
    const { doctorIds } = req.body;
    let query = { user: req.user._id }; // Only export user's doctors
    
    if (doctorIds && Array.isArray(doctorIds) && doctorIds.length > 0) {
      query._id = { $in: doctorIds };
    }
    
    const doctors = await Doctor.find(query).select('-__v');
    res.json({ 
      success: true,
      doctors 
    });
  } catch (error) {
    console.error('Error bulk exporting doctors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
