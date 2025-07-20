import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import api from '../../../utils/api';

const AddDoctorModal = ({ consultantId, onAddMapping, onClose, loading }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [referrals, setReferrals] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await api.getDoctors({ limit: 100 });
      setDoctors(response.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !referrals) {
      setError('Please select a doctor and enter number of referrals');
      return;
    }

    const referralsNum = parseInt(referrals);
    if (isNaN(referralsNum) || referralsNum < 0) {
      setError('Please enter a valid number of referrals');
      return;
    }

    onAddMapping(selectedDoctor, referralsNum);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctorOptions = filteredDoctors.map(doctor => ({
    value: doctor._id,
    label: `${doctor.name} - ${doctor.specialization} (${doctor.location})`
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Add Doctor Mapping</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            disabled={loading}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Doctors */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Doctors
            </label>
            <Input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loadingDoctors}
            />
          </div>

          {/* Select Doctor */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Doctor
            </label>
            {loadingDoctors ? (
              <div className="p-3 border border-border rounded-md text-sm text-text-secondary">
                Loading doctors...
              </div>
            ) : (
              <Select
                placeholder="Choose a doctor to map"
                options={doctorOptions}
                value={selectedDoctor}
                onChange={(value) => setSelectedDoctor(value)}
                disabled={loading}
              />
            )}
          </div>

          {/* Referrals */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Number of Referrals
            </label>
            <Input
              type="number"
              placeholder="Enter number of referrals"
              value={referrals}
              onChange={(e) => setReferrals(e.target.value)}
              min="0"
              step="1"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} color="#DC2626" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              disabled={loading || !selectedDoctor || !referrals}
              fullWidth
              iconName="Plus"
              iconPosition="left"
            >
              {loading ? 'Adding...' : 'Add Mapping'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal; 