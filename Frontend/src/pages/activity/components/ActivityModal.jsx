import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import api from '../../../utils/api';

const ActivityModal = ({ activity, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    doctorName: '',
    activityDate: '',
    location: '',
    notes: '',
    doctorId: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});

  const locationOptions = [
    { value: 'kandivali', label: 'Kandivali' },
    { value: 'borivali', label: 'Borivali' },
    { value: 'malad', label: 'Malad' },
    { value: 'goregaon', label: 'Goregaon' },
    { value: 'ram-mandir', label: 'Ram Mandir' },
    { value: 'dahisar', label: 'Dahisar' },
    { value: 'santacruz', label: 'Santacruz' },
    { value: 'andheri', label: 'Andheri' }
  ];

  // Load doctors for dropdown
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (activity) {
      setFormData({
        doctorName: activity.doctorName || '',
        activityDate: activity.activityDate ? new Date(activity.activityDate).toISOString().slice(0, 16) : '',
        location: activity.location || '',
        notes: activity.notes || '',
        doctorId: activity.doctorId?._id || ''
      });
    } else {
      // Set default date to current date and time
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setFormData({
        doctorName: '',
        activityDate: localDateTime,
        location: '',
        notes: '',
        doctorId: ''
      });
    }
  }, [activity]);

  const fetchDoctors = async () => {
    try {
      const response = await api.getDoctors({ limit: 100 });
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(doc => doc._id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctorId: doctorId,
      doctorName: selectedDoctor ? selectedDoctor.name : prev.doctorName
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.activityDate) {
      newErrors.activityDate = 'Activity date is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const activityData = {
      ...formData,
      activityDate: new Date(formData.activityDate).toISOString()
    };

    // Remove doctorId if not selected
    if (!activityData.doctorId) {
      delete activityData.doctorId;
    }

    await onSave(activityData);
  };

  const doctorOptions = [
    { value: '', label: 'Select a doctor (optional)' },
    ...doctors.map(doctor => ({
      value: doctor._id,
      label: `${doctor.name} - ${doctor.specialization}`
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {activity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={loading}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Doctor
            </label>
            <Select
              placeholder="Select a doctor (optional)"
              options={doctorOptions}
              value={formData.doctorId}
              onChange={handleDoctorSelect}
              clearable
            />
            <p className="text-xs text-text-secondary">
              Select a doctor from your list to link this activity, or leave empty to add a custom doctor name
            </p>
          </div>

          {/* Doctor Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Doctor Name *
            </label>
            <Input
              type="text"
              placeholder="Enter doctor name"
              value={formData.doctorName}
              onChange={(e) => handleInputChange('doctorName', e.target.value)}
              error={errors.doctorName}
              required
            />
          </div>

          {/* Activity Date and Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Activity Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={formData.activityDate}
              onChange={(e) => handleInputChange('activityDate', e.target.value)}
              error={errors.activityDate}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Location *
            </label>
            <Select
              placeholder="Select location"
              options={locationOptions}
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              searchable
              clearable
            />
            {errors.location && (
              <p className="text-sm text-error">{errors.location}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Notes
            </label>
            <textarea
              placeholder="Add any additional notes about this activity..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              iconName={loading ? "Loader" : "Save"}
              iconPosition="left"
            >
              {loading ? 'Saving...' : (activity ? 'Update Activity' : 'Add Activity')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal; 