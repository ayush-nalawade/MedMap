import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActivityDetailsModal = ({ activity, onClose }) => {
  if (!activity) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Activity Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Doctor Information */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={32} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {activity.doctorName}
              </h3>
              {activity.doctorId && (
                <p className="text-text-secondary">
                  {activity.doctorId.specialization}
                </p>
              )}
              <p className="text-sm text-text-secondary">
                Activity ID: {activity._id}
              </p>
            </div>
          </div>

          {/* Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date and Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Activity Date & Time
              </label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-text-primary">
                  <Icon name="Calendar" size={16} />
                  <span className="font-medium">{formatDate(activity.activityDate)}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {getDayOfWeek(activity.activityDate)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Location
              </label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-text-primary">
                  <Icon name="MapPin" size={16} />
                  <span className="font-medium">{activity.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Notes
            </label>
            <div className="p-4 bg-muted/30 rounded-lg min-h-[100px]">
              {activity.notes ? (
                <p className="text-text-primary whitespace-pre-wrap">{activity.notes}</p>
              ) : (
                <p className="text-text-secondary italic">No notes provided</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Created At */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Created
              </label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-text-primary">
                  <Icon name="Clock" size={16} />
                  <span>{new Date(activity.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Updated At */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Last Updated
              </label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-text-primary">
                  <Icon name="RefreshCw" size={16} />
                  <span>{new Date(activity.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal; 