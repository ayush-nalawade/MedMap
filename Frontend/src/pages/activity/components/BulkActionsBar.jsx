import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsBar = ({ selectedCount, onBulkDelete, onBulkExport }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {selectedCount} {selectedCount === 1 ? 'activity' : 'activities'} selected
            </p>
            <p className="text-sm text-text-secondary">
              Choose an action to perform on the selected items
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar; 