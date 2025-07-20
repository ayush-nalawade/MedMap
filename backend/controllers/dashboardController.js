const Doctor = require('../models/Doctor');
const Consultant = require('../models/Consultant');
const Activity = require('../models/Activity');

// GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Only count data belonging to the authenticated user
    const userQuery = { user: req.user._id };
    
    // Get total counts for the user
    const totalDoctors = await Doctor.countDocuments(userQuery);
    const totalConsultants = await Consultant.countDocuments(userQuery);
    
    // Get active mappings (consultants with mapped doctors) for the user
    const consultantsWithMappings = await Consultant.aggregate([
      { $match: userQuery },
      {
        $project: {
          mappingCount: { $size: { $ifNull: ["$mappedDoctors", []] } }
        }
      },
      {
        $match: { mappingCount: { $gt: 0 } }
      }
    ]);
    const activeMappings = consultantsWithMappings.length;
    
    // Calculate total referrals amount for the user
    const totalReferrals = await Consultant.aggregate([
      { $match: userQuery },
      {
        $unwind: "$mappedDoctors"
      },
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: "$mappedDoctors.referrals" }
        }
      }
    ]);
    
    // Get recent changes (last 30 days) for the user
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDoctors = await Doctor.countDocuments({ 
      ...userQuery,
      createdAt: { $gte: thirtyDaysAgo } 
    });
    const recentConsultants = await Consultant.countDocuments({ 
      ...userQuery,
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    res.json({
      success: true,
      stats: {
        totalDoctors,
        totalConsultants,
        activeMappings,
        totalReferrals: totalReferrals[0]?.totalReferrals || 0,
        recentDoctors,
        recentConsultants
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/dashboard/recent-doctors
exports.getRecentDoctors = async (req, res) => {
  try {
    // Only get doctors belonging to the authenticated user
    const recentDoctors = await Doctor.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name specialization location createdAt');
    
    res.json({
      success: true,
      doctors: recentDoctors
    });
  } catch (error) {
    console.error('Error getting recent doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/dashboard/recent-consultants
exports.getRecentConsultants = async (req, res) => {
  try {
    // Only get consultants belonging to the authenticated user
    const recentConsultants = await Consultant.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name specialization location createdAt');
    
    res.json({
      success: true,
      consultants: recentConsultants
    });
  } catch (error) {
    console.error('Error getting recent consultants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// GET /api/dashboard/activity-feed
exports.getActivityFeed = async (req, res) => {
  try {
    // Only get activities belonging to the authenticated user
    const activities = await Activity.find({ user: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // Convert to plain JavaScript objects
    
    // Transform activities to handle missing user data
    const transformedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      user: activity.user?.name || 'System',
      timestamp: activity.createdAt,
      targetId: activity.targetId,
      targetType: activity.targetType,
      metadata: activity.metadata
    }));
    
    res.json({
      success: true,
      activities: transformedActivities
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    // Return empty activities array instead of error
    res.json({
      success: true,
      activities: []
    });
  }
}; 