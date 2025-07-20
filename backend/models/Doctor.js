const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  specializationType: { 
    type: String, 
    required: true,
    enum: ['Consultant', 'General Practitioner'],
    default: 'General Practitioner'
  },
  preferredHospitals: [{ type: String }], // Made optional
  location: { type: String, required: true },
  subLocation: { type: String },
  phoneNumber: { type: String },
}, { timestamps: true });

// Index for better query performance
doctorSchema.index({ user: 1 });
doctorSchema.index({ location: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ specializationType: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
