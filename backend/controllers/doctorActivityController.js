const DoctorActivity = require('../models/DoctorActivity');
const Doctor = require('../models/Doctor');
const { body, validationResult } = require('express-validator');

exports.validate = [
  body('doctorName').notEmpty().trim().withMessage('Doctor name is required'),
  body('activityDate').isISO8601().withMessage('Valid activity date is required'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('notes').optional().trim(),
  body('doctorId').optional().isMongoId().withMessage('Valid doctor ID is required if provided')
];

// GET /api/activities?page=&limit=&sortBy=&sortOrder=&doctorName=&location=&dateFrom=&dateTo=&dayOfWeek=
exports.getActivities = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      sortBy = 'activityDate',
      sortOrder = 'desc',
      doctorName,
      location,
      dateFrom,
      dateTo,
      dayOfWeek
    } = req.query;
    
    // Base query - only show activities belonging to the authenticated user
    const query = { user: req.user._id };
    
    // Add filters
    if (doctorName) {
      query.doctorName = { $regex: doctorName, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.activityDate = {};
      if (dateFrom) {
        query.activityDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.activityDate.$lte = new Date(dateTo);
      }
    }
    
    // Day of week filter
    if (dayOfWeek) {
      const dayNumber = parseInt(dayOfWeek);
      if (dayNumber >= 0 && dayNumber <= 6) {
        // MongoDB doesn't have a direct day of week filter, so we'll use aggregation
        const activities = await DoctorActivity.aggregate([
          { $match: { user: req.user._id } },
          {
            $addFields: {
              dayOfWeek: { $dayOfWeek: '$activityDate' }
            }
          },
          { $match: { dayOfWeek: dayNumber + 1 } }, // MongoDB dayOfWeek is 1-7 (Sunday=1)
          { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
          { $skip: (page - 1) * limit },
          { $limit: Number(limit) }
        ]);
        
        const total = await DoctorActivity.aggregate([
          { $match: { user: req.user._id } },
          {
            $addFields: {
              dayOfWeek: { $dayOfWeek: '$activityDate' }
            }
          },
          { $match: { dayOfWeek: dayNumber + 1 } },
          { $count: 'total' }
        ]);
        
        return res.json({ 
          success: true,
          activities, 
          total: total[0]?.total || 0, 
          page: Number(page), 
          limit: Number(limit) 
        });
      }
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const activities = await DoctorActivity.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('doctorId', 'name specialization');
      
    const total = await DoctorActivity.countDocuments(query);
    
    res.json({ 
      success: true,
      activities, 
      total, 
      page: Number(page), 
      limit: Number(limit) 
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// GET /api/activities/stats
exports.getActivityStats = async (req, res) => {
  try {
    const userQuery = { user: req.user._id };
    
    const totalActivities = await DoctorActivity.countDocuments(userQuery);
    
    // Get activities by day of week
    const activitiesByDay = await DoctorActivity.aggregate([
      { $match: userQuery },
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$activityDate' }
        }
      },
      { $group: { _id: '$dayOfWeek', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get activities by location
    const activitiesByLocation = await DoctorActivity.aggregate([
      { $match: userQuery },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get activities by doctor name
    const activitiesByDoctor = await DoctorActivity.aggregate([
      { $match: userQuery },
      { $group: { _id: '$doctorName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivities = await DoctorActivity.countDocuments({
      ...userQuery,
      activityDate: { $gte: sevenDaysAgo }
    });
    
    res.json({ 
      success: true,
      totalActivities,
      activitiesByDay,
      activitiesByLocation,
      activitiesByDoctor,
      recentActivities
    });
  } catch (error) {
    console.error('Error getting activity stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// GET /api/activities/:id
exports.getActivityById = async (req, res) => {
  try {
    const activity = await DoctorActivity.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('doctorId', 'name specialization');
    
    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found or access denied' 
      });
    }
    
    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error getting activity by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/activities
exports.createActivity = async (req, res) => {
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

    // If doctorId is provided, verify it exists and belongs to the user
    if (req.body.doctorId) {
      const doctor = await Doctor.findOne({
        _id: req.body.doctorId,
        user: req.user._id
      });
      
      if (!doctor) {
        return res.status(400).json({
          success: false,
          message: 'Doctor not found or access denied'
        });
      }
    }
    
    const activityData = {
      ...req.body,
      user: req.user._id,
      activityDate: new Date(req.body.activityDate)
    };
    
    const activity = new DoctorActivity(activityData);
    await activity.save();
    
    // Populate doctor info if doctorId exists
    if (activity.doctorId) {
      await activity.populate('doctorId', 'name specialization');
    }
    
    res.status(201).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// PUT /api/activities/:id
exports.updateActivity = async (req, res) => {
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

    // If doctorId is provided, verify it exists and belongs to the user
    if (req.body.doctorId) {
      const doctor = await Doctor.findOne({
        _id: req.body.doctorId,
        user: req.user._id
      });
      
      if (!doctor) {
        return res.status(400).json({
          success: false,
          message: 'Doctor not found or access denied'
        });
      }
    }
    
    const updateData = { ...req.body };
    if (updateData.activityDate) {
      updateData.activityDate = new Date(updateData.activityDate);
    }
    
    const activity = await DoctorActivity.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    ).populate('doctorId', 'name specialization');
    
    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found or access denied' 
      });
    }
    
    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// DELETE /api/activities/:id
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await DoctorActivity.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found or access denied' 
      });
    }
    
    await DoctorActivity.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// POST /api/activities/bulk-delete
exports.bulkDeleteActivities = async (req, res) => {
  try {
    const { activityIds } = req.body;
    if (!activityIds || !Array.isArray(activityIds)) {
      return res.status(400).json({ 
        success: false,
        message: 'Activity IDs array is required' 
      });
    }
    
    const deletedActivities = await DoctorActivity.find({ 
      _id: { $in: activityIds },
      user: req.user._id
    });
    
    if (deletedActivities.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No activities found or access denied' 
      });
    }
    
    await DoctorActivity.deleteMany({ 
      _id: { $in: activityIds },
      user: req.user._id
    });
    
    res.json({ 
      success: true,
      message: `${deletedActivities.length} activities deleted successfully` 
    });
  } catch (error) {
    console.error('Error bulk deleting activities:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
}; 