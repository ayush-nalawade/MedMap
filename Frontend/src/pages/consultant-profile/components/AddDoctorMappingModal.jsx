import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddDoctorMappingModal = ({ isOpen, onClose, onAdd, availableDoctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [referralCount, setReferralCount] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doctorOptions = availableDoctors.map(doctor => ({
    value: doctor.id,
    label: doctor.name,
    description: `${doctor.specialization} - ${doctor.location}`
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!selectedDoctor) {
      newErrors.doctor = 'Please select a doctor';
    }

    if (!referralCount) {
      newErrors.referralCount = 'Referral count is required';
    } else if (parseInt(referralCount) < 0) {
      newErrors.referralCount = 'Referral count must be 0 or greater';
    } else if (!Number.isInteger(parseFloat(referralCount))) {
      newErrors.referralCount = 'Referral count must be a whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const selectedDoctorData = availableDoctors.find(d => d.id === selectedDoctor);
      await onAdd({
        doctorId: selectedDoctor,
        doctorName: selectedDoctorData.name,
        specialization: selectedDoctorData.specialization,
        location: selectedDoctorData.location,
        referralCount: parseInt(referralCount)
      });
      
      // Reset form
      setSelectedDoctor('');
      setReferralCount('');
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to add doctor mapping. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedDoctor('');
    setReferralCount('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1100" onClick={handleClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popover border border-border rounded-lg w-full max-w-md z-1200 modal-shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="UserPlus" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Add Doctor Mapping</h3>
                <p className="text-sm text-text-secondary">Create a new doctor-consultant relationship</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Doctor"
              description="Choose a doctor to map to this consultant"
              options={doctorOptions}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              error={errors.doctor}
              required
              searchable
              placeholder="Search and select a doctor..."
            />

            <Input
              label="Referral Count"
              type="number"
              placeholder="Enter referral count"
              value={referralCount}
              onChange={(e) => setReferralCount(e.target.value)}
              error={errors.referralCount}
              required
              min="0"
              step="1"
              description="Number of referrals this consultant has made to the selected doctor"
            />

            {errors.submit && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} />
                  {errors.submit}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                iconName="Plus"
                iconPosition="left"
              >
                Add Mapping
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDoctorMappingModal;