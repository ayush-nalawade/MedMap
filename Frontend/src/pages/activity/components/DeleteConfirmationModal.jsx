import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmationModal = ({ activity, onConfirm, onClose, loading }) => {
  if (!activity) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Delete Activity
            </h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-text-primary mb-4">
            Are you sure you want to delete this activity? This action cannot be undone.
          </p>

          {/* Activity Details */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">{activity.doctorName}</h3>
                <p className="text-sm text-text-secondary">{formatDate(activity.activityDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon name="MapPin" size={14} />
              <span>{activity.location}</span>
            </div>
            
            {activity.notes && (
              <div className="mt-2">
                <p className="text-sm text-text-secondary line-clamp-2">
                  {activity.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm(activity)}
              disabled={loading}
              iconName={loading ? "Loader" : "Trash2"}
              iconPosition="left"
            >
              {loading ? 'Deleting...' : 'Delete Activity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 