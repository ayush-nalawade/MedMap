import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DoctorDetailsModal = ({ isOpen, onClose, doctor }) => {
  if (!isOpen || !doctor) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLocationDisplayName = (locationValue) => {
    const locationMap = {
      'kandivali': 'Kandivali',
      'borivali': 'Borivali',
      'malad': 'Malad',
      'goregaon': 'Goregaon',
      'ram-mandir': 'Ram Mandir',
      'dahisar': 'Dahisar',
      'santacruz': 'Santacruz',
      'andheri': 'Andheri'
    };
    return locationMap[locationValue] || locationValue;
  };

  const getSpecializationDisplayName = (specializationValue) => {
    const specializationMap = {
      'cardiologist': 'Cardiologist',
      'neurologist': 'Neurologist',
      'orthopedist': 'Orthopedist',
      'pediatrician': 'Pediatrician',
      'dermatologist': 'Dermatologist',
      'psychiatrist': 'Psychiatrist',
      'oncologist': 'Oncologist',
      'gastroenterologist': 'Gastroenterologist',
      'pulmonologist': 'Pulmonologist',
      'endocrinologist': 'Endocrinologist',
      'rheumatologist': 'Rheumatologist',
      'ophthalmologist': 'Ophthalmologist',
      'ent': 'ENT',
      'general-surgeon': 'General Surgeon'
    };
    return specializationMap[specializationValue] || specializationValue;
  };

  const getHospitalDisplayName = (hospitalValue) => {
    const hospitalMap = {
      'general-hospital': 'General Hospital',
      'mercy-medical': 'Mercy Medical Center',
      'st-marys': "St. Mary\'s Hospital",
      'university-medical': 'University Medical Center',
      'regional-healthcare': 'Regional Healthcare System',
      'community-hospital': 'Community Hospital',
      'memorial-hospital': 'Memorial Hospital',
      'central-medical': 'Central Medical Center',
      'baptist-hospital': 'Baptist Hospital',
      'presbyterian-medical': 'Presbyterian Medical Center'
    };
    return hospitalMap[hospitalValue] || hospitalValue;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1300 p-4">
      <div className="bg-card rounded-lg shadow-modal-shadow w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={32} color="white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">{doctor.name}</h2>
              <p className="text-text-secondary">Doctor ID: {doctor.id}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {getSpecializationDisplayName(doctor.specialization)}
                </span>
                <div className="flex items-center gap-1 text-text-secondary">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">{getLocationDisplayName(doctor.location)}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Full Name:</span>
                    <span className="text-text-primary font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Doctor ID:</span>
                    <span className="text-text-primary font-medium">{doctor.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Specialization:</span>
                    <span className="text-text-primary font-medium">{getSpecializationDisplayName(doctor.specialization)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Location:</span>
                    <span className="text-text-primary font-medium">{getLocationDisplayName(doctor.location)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  System Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Date Added:</span>
                    <span className="text-text-primary font-medium">{formatDate(doctor.createdAt || '2024-01-15')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Last Updated:</span>
                    <span className="text-text-primary font-medium">{formatDate(doctor.updatedAt || '2024-07-15')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Consultant Mappings:</span>
                    <span className="text-text-primary font-medium">{doctor.consultantMappings || 3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Hospitals */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Icon name="Building2" size={20} />
              Preferred Hospitals
            </h3>
            {doctor.preferredHospitals && doctor.preferredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {doctor.preferredHospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border"
                  >
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Icon name="Building2" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{getHospitalDisplayName(hospital)}</p>
                      <p className="text-sm text-text-secondary">Healthcare Facility</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Building2" size={48} className="mx-auto mb-2 opacity-50" />
                <p>No preferred hospitals specified</p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Icon name="Info" size={20} />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Users" size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-medium text-text-primary">{doctor.totalPatients || 245}</p>
                <p className="text-text-secondary">Total Patients</p>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Star" size={24} className="mx-auto mb-2 text-warning" />
                <p className="font-medium text-text-primary">{doctor.rating || '4.8'}/5.0</p>
                <p className="text-text-secondary">Average Rating</p>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <Icon name="Clock" size={24} className="mx-auto mb-2 text-accent" />
                <p className="font-medium text-text-primary">{doctor.experience || '8'} years</p>
                <p className="text-text-secondary">Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="Edit"
            iconPosition="left"
            onClick={() => {
              onClose();
              // This would trigger edit mode
            }}
          >
            Edit Doctor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsModal;