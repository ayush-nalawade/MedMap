import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BulkActionsBar = ({ selectedCount, onBulkDelete, onBulkExport, onBulkAssign, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'export', label: 'Export Selected' },
    { value: 'assign', label: 'Assign to Consultant' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleBulkAction = () => {
    switch (bulkAction) {
      case 'export':
        onBulkExport();
        break;
      case 'assign':
        setShowAssignModal(true);
        break;
      case 'delete':
        onBulkDelete();
        break;
      default:
        break;
    }
    setBulkAction('');
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {selectedCount} doctor{selectedCount > 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-text-secondary">
              Choose an action to apply to selected doctors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            placeholder="Select bulk action..."
            options={bulkActionOptions}
            value={bulkAction}
            onChange={setBulkAction}
            className="w-48"
          />
          
          <Button
            variant="default"
            onClick={handleBulkAction}
            disabled={!bulkAction}
            iconName="Play"
            iconPosition="left"
          >
            Apply
          </Button>

          <Button
            variant="outline"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/20">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          iconName="Download"
          iconPosition="left"
        >
          Export ({selectedCount})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAssignModal(true)}
          iconName="UserPlus"
          iconPosition="left"
        >
          Assign to Consultant
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          iconName="Trash2"
          iconPosition="left"
        >
          Delete ({selectedCount})
        </Button>
      </div>

      {/* Assign to Consultant Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1300 p-4">
          <div className="bg-card rounded-lg shadow-modal-shadow w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Assign to Consultant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAssignModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="p-6">
              <p className="text-text-secondary mb-4">
                Select a consultant to assign {selectedCount} selected doctor{selectedCount > 1 ? 's' : ''} to:
              </p>
              
              <Select
                label="Consultant"
                placeholder="Select consultant..."
                options={[
                  { value: 'consultant-1', label: 'Dr. Michael Chen - Cardiology' },
                  { value: 'consultant-2', label: 'Dr. Sarah Williams - Neurology' },
                  { value: 'consultant-3', label: 'Dr. James Rodriguez - Orthopedics' }
                ]}
                searchable
              />
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  onBulkAssign();
                  setShowAssignModal(false);
                }}
                iconName="UserPlus"
                iconPosition="left"
              >
                Assign Doctors
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;