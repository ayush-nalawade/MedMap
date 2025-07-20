import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmationModal = ({ doctor, onClose, onConfirm, loading }) => {
  if (!doctor) return null;

  const handleConfirm = () => {
    onConfirm(doctor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} color="#DC2626" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Doctor</h2>
            <p className="text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-900 mb-2">
              Are you sure you want to delete the following doctor?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization} • {doctor.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} color="#DC2626" />
              <div>
                <h4 className="font-medium text-red-600 mb-1">Warning</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• This will permanently delete the doctor's profile</li>
                  <li>• All consultant mappings will be removed</li>
                  <li>• Historical data will be lost</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            If you're sure you want to proceed, click "Delete Doctor" below.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={loading}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Doctor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;