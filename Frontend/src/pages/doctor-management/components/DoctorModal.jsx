import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DoctorModal = ({ doctor, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    specializationType: 'General Practitioner',
    preferredHospitals: [],
    location: '',
    phoneNumber: '',
    subLocation: ''
  });
  const [errors, setErrors] = useState({});

  const specializationOptions = [
    { value: 'cardiologist', label: 'Cardiologist' },
    { value: 'neurologist', label: 'Neurologist' },
    { value: 'orthopedist', label: 'Orthopedist' },
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'oncologist', label: 'Oncologist' },
    { value: 'gastroenterologist', label: 'Gastroenterologist' },
    { value: 'pulmonologist', label: 'Pulmonologist' },
    { value: 'endocrinologist', label: 'Endocrinologist' },
    { value: 'rheumatologist', label: 'Rheumatologist' },
    { value: 'ophthalmologist', label: 'Ophthalmologist' },
    { value: 'ent', label: 'ENT' },
    { value: 'general-surgeon', label: 'General Surgeon' },
    { value: 'bams', label: 'BAMS' },
    { value: 'bhms', label: 'BHMS' },
    { value: 'mbbs', label: 'MBBS' },
    { value: 'md', label: 'MD' }
  ];

  const specializationTypeOptions = [
    { value: 'Consultant', label: 'Consultant' },
    { value: 'General Practitioner', label: 'General Practitioner' }
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
    { value: 'NA', label: 'NA' },
    { value: 'eksar', label: 'Eksar' },
    { value: 'sv-road', label: 'S.V. Road' },
    { value: 'mg-road', label: 'M.G. Road' },
    { value: 'link-road', label: 'Link Road' },
    { value: 'chikoowadi', label: 'Chikoowadi' },
    { value: 'bangur-nagar', label: 'Bangur Nagar' },
    { value: 'tindongri', label: 'Tindongri' },
    { value: 'malvani', label: 'Malvani' },
    { value: 'ram-mandir', label: 'Ram Mandir' },
    { value: 'jawahar-nagar', label: 'Jawahar Nagar' },
    { value: 'bhagat-singh-nagar-1', label: 'Bhagat Singh Nagar No. 1' },
    { value: 'bhagat-singh-nagar-2', label: 'Bhagat Singh Nagar No. 2' },
    { value: 'motilal-nagar', label: 'Motilal Nagar' },
    { value: 'best-colony', label: 'Best Colony' },
    { value: 'evershine-nagar', label: 'Evershine Nagar' },
    { value: 'laljipada', label: 'Laljipada' },
    { value: 'marve-road', label: 'Marve Road' },
    { value: 'sai-nagar', label: 'Sai Nagar' },
    { value: 'patel-nagar', label: 'Patel Nagar' },
    { value: 'shantilal-modi-road', label: 'Shantilal Modi Road' },
    { value: 'irani-wadi', label: 'Irani Wadi' },
    { value: 'gorai-1', label: 'Gorai 1' },
    { value: 'gorai-2', label: 'Gorai 2' },
    { value: 'mhb-colony', label: 'MHB Colony' },
    { value: 'charkop-sector-8', label: 'Charkop Sector 8' },
    { value: 'charkop-sector-9', label: 'Charkop Sector 9' },
    { value: 'somwari-bazar', label: 'Somwari Bazar' },
    { value: 'prem-nagar', label: 'Prem Nagar' },
    { value: 'liberty-garden', label: 'Liberty Garden' },
    { value: 'behram-baug', label: 'Behram Baug' },
    { value: 'pandurang-wadi', label: 'Pandurang Wadi' },
    { value: 'santosh-nagar', label: 'Santosh Nagar' },
    { value: 'quarters-colony', label: 'Quarters Colony' },
    { value: 'bachchani-nagar', label: 'Bachchani Nagar' },
    { value: 'malad-east', label: 'Malad East' },
    { value: 'borivali-east', label: 'Borivali East' },
    { value: 'goregaon-east', label: 'Goregaon East' },
    { value: 'kandivali-east', label: 'Kandivali East' },
    { value: 'thakur-village', label: 'Thakur Village' },
    { value: 'thakur-complex', label: 'Thakur Complex' },
    { value: 'dahisar', label: 'Dahisar' },
    { value: 'dahisar-east', label: 'Dahisar East' },
    { value: 'anand-nagar', label: 'Anand Nagar' },
    { value: 'bhadran-nagar', label: 'Bhadran Nagar' },
    { value: 'ganesh-nagar', label: 'Ganesh Nagar' },
  ];
  

  const hospitalOptions = [
    { value: 'lilavati-hospital', label: 'Lilavati Hospital' },
    { value: 'kokilaben-hospital', label: 'Kokilaben Hospital' },
    { value: 'breach-candy-hospital', label: 'Breach Candy Hospital' },
    { value: 'bombay-hospital', label: 'Bombay Hospital' },
    { value: 'jaslok-hospital', label: 'Jaslok Hospital' },
    { value: 'saifee-hospital', label: 'Saifee Hospital' },
    { value: 'hinduja-hospital', label: 'Hinduja Hospital' },
    { value: 'nanavati-hospital', label: 'Nanavati Hospital' },
    { value: 'wockhardt-hospital', label: 'Wockhardt Hospital' },
    { value: 'fortis-hospital', label: 'Fortis Hospital' }
  ];

  const getRandomDoctorAvatar = () => {
    // Generate a random color for the SVG circle (blue shades)
    const blueShades = [
      '#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#1e40af',
      '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#0c4a6e'
    ];
    const idx = Math.floor(Math.random() * blueShades.length);
    const color = encodeURIComponent(blueShades[idx]);
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='${color}'/></svg>`;
  };

  const getDefaultDoctorAvatar = () => {
    // Default blue circle SVG data URI
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="%233b82f6"/></svg>';
  };

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        specializationType: doctor.specializationType || 'General Practitioner',
        preferredHospitals: doctor.preferredHospitals || [],
        location: doctor.location || '',
        phoneNumber: doctor.phoneNumber || '',
        subLocation: doctor.subLocation || '',
        avatar: doctor.avatar || getRandomDoctorAvatar()
      });
    } else {
      setFormData({
        name: '',
        specialization: '',
        specializationType: 'General Practitioner',
        preferredHospitals: [],
        location: '',
        phoneNumber: '',
        subLocation: '',
        avatar: getRandomDoctorAvatar()
      });
    }
    setErrors({});
  }, [doctor]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.specializationType) {
      newErrors.specializationType = 'Specialization type is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.subLocation) {
      newErrors.subLocation = 'Sub-location is required';
    }

    // Preferred hospitals are now optional, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const doctorData = {
        name: formData.name.trim(),
        specialization: formData.specialization,
        specializationType: formData.specializationType,
        preferredHospitals: formData.preferredHospitals,
        location: formData.location,
        phoneNumber: formData.phoneNumber.trim(),
        subLocation: formData.subLocation,
        avatar: formData.avatar || getDefaultDoctorAvatar()
      };
      onSave(doctorData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {doctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <p className="text-sm text-gray-600">
                {doctor ? 'Update doctor information' : 'Enter doctor details to add to the system'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <Input
            label="Doctor Name"
            type="text"
            placeholder="Enter doctor's full name (Dr. prefix will be added automatically)"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            disabled={loading}
          />

          {/* Phone Number Field */}
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number (e.g., +1-234-567-8900)"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
            required
            disabled={loading}
          />

          {/* Specialization Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Specialization"
              placeholder="Select specialization"
              options={specializationOptions}
              value={formData.specialization}
              onChange={(value) => handleInputChange('specialization', value)}
              error={errors.specialization}
              required
              searchable
              disabled={loading}
            />

            <Select
              label="Specialization Type"
              placeholder="Select specialization type"
              options={specializationTypeOptions}
              value={formData.specializationType}
              onChange={(value) => handleInputChange('specializationType', value)}
              error={errors.specializationType}
              required
              disabled={loading}
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Location"
              placeholder="Select location"
              options={locationOptions}
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors.location}
              required
              searchable
              disabled={loading}
            />

            <Select
              label="Sub-Location"
              placeholder="Select sub-location"
              options={subLocationOptions}
              value={formData.subLocation}
              onChange={(value) => handleInputChange('subLocation', value)}
              error={errors.subLocation}
              required
              searchable
              disabled={loading}
            />
          </div>

          {/* Preferred Hospitals Field */}
          <Select
            label="Preferred Hospitals"
            description="Select one or more hospitals where the doctor practices (optional)"
            placeholder="Select preferred hospitals"
            options={hospitalOptions}
            value={formData.preferredHospitals}
            onChange={(value) => handleInputChange('preferredHospitals', value)}
            error={errors.preferredHospitals}
            multiple
            searchable
            disabled={loading}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
              iconName={doctor ? "Save" : "Plus"}
              iconPosition="left"
            >
              {doctor ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;