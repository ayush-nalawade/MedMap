const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['doctor_added', 'doctor_updated', 'doctor_deleted', 'consultant_added', 'consultant_updated', 'consultant_deleted', 'mapping_created', 'mapping_updated', 'mapping_removed', 'bulk_operation']
  },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId }, // ID of the affected doctor/consultant
  targetType: { type: String, enum: ['Doctor', 'Consultant', 'Mapping'] },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data like old/new values
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema); 