const mongoose = require('mongoose');

const doctorActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  activityDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  location: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String,
    default: '' 
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false // Optional - if the doctor exists in the system
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
doctorActivitySchema.index({ user: 1, activityDate: -1 });
doctorActivitySchema.index({ user: 1, doctorName: 1 });
doctorActivitySchema.index({ user: 1, location: 1 });

module.exports = mongoose.model('DoctorActivity', doctorActivitySchema); 