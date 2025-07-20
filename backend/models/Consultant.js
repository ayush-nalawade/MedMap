const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  preferredHospitals: [{ type: String }], // Made optional
  location: { type: String, required: true },
  subLocation: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  experience: { type: String, required: true },
  avatar: { type: String },
  mappedDoctors: [{
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    referrals: { type: Number, required: true, default: 0 },
  }],
}, { timestamps: true });

// Index for better query performance
consultantSchema.index({ user: 1 });
consultantSchema.index({ email: 1 });

module.exports = mongoose.model('Consultant', consultantSchema);
