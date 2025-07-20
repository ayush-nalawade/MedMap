import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditMappingModal = ({ isOpen, onClose, mapping, onUpdate, loading }) => {
  const [referrals, setReferrals] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mapping) {
      setReferrals(mapping.referrals || 0);
    }
  }, [mapping]);

  const validateForm = () => {
    const newErrors = {};

    if (referrals < 0) {
      newErrors.referrals = 'Referrals cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(referrals);
    }
  };

  if (!isOpen || !mapping) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Edit Mapping</h2>
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
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">
                  {mapping.doctor?.name || 'Unknown Doctor'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {mapping.doctor?.specialization || 'Unknown Specialization'}
                </p>
              </div>
            </div>

            <Input
              label="Number of Referrals"
              type="number"
              placeholder="Enter number of referrals"
              value={referrals}
              onChange={(e) => setReferrals(parseInt(e.target.value) || 0)}
              error={errors.referrals}
              required
              min="0"
              description="Number of referrals this doctor has received"
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
              Update Mapping
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMappingModal; 