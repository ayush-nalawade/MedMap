import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ConsultantModal = ({ isOpen, onClose, consultant, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    preferredHospitals: [],
    location: '',
    subLocation: '',
    phone: '',
    experience: '',
    avatar: ''
  });

  const [errors, setErrors] = useState({});

  const specializationOptions = [
    { value: 'Cardiologist', label: 'Cardiologist' },
    { value: 'Neurologist', label: 'Neurologist' },
    { value: 'Orthopedist', label: 'Orthopedist' },
    { value: 'Pediatrician', label: 'Pediatrician' },
    { value: 'Dermatologist', label: 'Dermatologist' },
    { value: 'Oncologist', label: 'Oncologist' },
    { value: 'Psychiatrist', label: 'Psychiatrist' },
    { value: 'Radiologist', label: 'Radiologist' },
    { value: 'ENT', label: 'ENT' },
    { value: 'General Surgeon', label: 'General Surgeon' },
    { value: 'BAMS', label: 'BAMS' },
    { value: 'BHMS', label: 'BHMS' },
    { value: 'MBBS', label: 'MBBS' },
    { value: 'MD', label: 'MD' }
  ];

  const hospitalOptions = [
    { value: 'Lilavati Hospital', label: 'Lilavati Hospital' },
    { value: 'Kokilaben Hospital', label: 'Kokilaben Hospital' },
    { value: 'Breach Candy Hospital', label: 'Breach Candy Hospital' },
    { value: 'Bombay Hospital', label: 'Bombay Hospital' },
    { value: 'Jaslok Hospital', label: 'Jaslok Hospital' },
    { value: 'Saifee Hospital', label: 'Saifee Hospital' },
    { value: 'Hinduja Hospital', label: 'Hinduja Hospital' },
    { value: 'Nanavati Hospital', label: 'Nanavati Hospital' },
    { value: 'Wockhardt Hospital', label: 'Wockhardt Hospital' },
    { value: 'Fortis Hospital', label: 'Fortis Hospital' }
  ];

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

  const subLocationOptions = [
    { value: 'charkop', label: 'Charkop' },
    { value: 'bangur-nagar', label: 'Bangur Nagar' },
    { value: 'motilal-nagar', label: 'Motilal Nagar' },
    { value: 'mg-road', label: 'M G Road' },
    { value: 'sv-road', label: 'S V Road' },
    { value: 'teen-dongari', label: 'Teen Dongari' },
    { value: 'behram-baug', label: 'Behram Baug' },
    { value: 'malvani', label: 'Malvani' }
  ];

  const getRandomConsultantAvatar = () => {
    const idx = Math.floor(Math.random() * 10) + 1;
    return ``;
  };

  const getDefaultConsultantAvatar = () => {
    // Green circle SVG data URI
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="%2334d399"/></svg>';
  };

  useEffect(() => {
    if (consultant) {
      setFormData({
        name: consultant.name || '',
        email: consultant.email || '',
        specialization: consultant.specialization || '',
        preferredHospitals: consultant.preferredHospitals || [],
        location: consultant.location || '',
        subLocation: consultant.subLocation || '',
        phone: consultant.phone || '',
        experience: consultant.experience || '',
        avatar: consultant.avatar || getRandomConsultantAvatar()
      });
    } else {
      setFormData({
        name: '',
        email: '',
        specialization: '',
        preferredHospitals: [],
        location: '',
        subLocation: '',
        phone: '',
        experience: '',
        avatar: getRandomConsultantAvatar()
      });
    }
    setErrors({});
  }, [consultant, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.subLocation) {
      newErrors.subLocation = 'Sub-location is required';
    }

    // Preferred hospitals are now optional, so no validation needed

    // Strict 10-digit phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up the data to only send necessary fields
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        location: formData.location,
        subLocation: formData.subLocation,
        preferredHospitals: formData.preferredHospitals,
        experience: formData.experience,
        avatar: formData.avatar || getDefaultConsultantAvatar()
      };
      
      console.log('Sending consultant data:', consultantData);
      onSave(consultantData);
    }
  };

  const handleInputChange = (field, value) => {
    // Special handling for phone number formatting
    if (field === 'phone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const formattedPhone = digitsOnly.slice(0, 10);
      value = formattedPhone;
    }

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {consultant ? 'Edit Consultant' : 'Add New Consultant'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter consultant name (Dr. prefix will be added automatically)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Specialization"
              options={specializationOptions}
              value={formData.specialization}
              onChange={(value) => handleInputChange('specialization', value)}
              placeholder="Select specialization"
              error={errors.specialization}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter 10-digit phone number (e.g., 1234567890)"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
              maxLength={10}
              description="Enter exactly 10 digits without spaces or special characters"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Location"
              options={locationOptions}
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              placeholder="Select location"
              error={errors.location}
              required
            />

            <Select
              label="Sub-Location"
              options={subLocationOptions}
              value={formData.subLocation}
              onChange={(value) => handleInputChange('subLocation', value)}
              placeholder="Select sub-location"
              error={errors.subLocation}
              required
            />
          </div>

          <Select
            label="Preferred Hospitals"
            description="Select hospitals where the consultant prefers to work (optional)"
            options={hospitalOptions}
            value={formData.preferredHospitals}
            onChange={(value) => handleInputChange('preferredHospitals', value)}
            placeholder="Select preferred hospitals"
            error={errors.preferredHospitals}
            multiple
            searchable
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Years of Experience"
              type="number"
              placeholder="Enter years of experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              error={errors.experience}
              required
              min="0"
              max="50"
            />

            <Input
              label="Avatar URL"
              type="url"
              placeholder="Enter avatar image URL (optional)"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              description="Leave empty to use a random avatar"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
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
              loading={loading}
              iconName="Save"
              iconPosition="left"
            >
              {consultant ? 'Update Consultant' : 'Add Consultant'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultantModal;