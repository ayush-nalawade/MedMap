import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ActivityTable = ({ 
  activities, 
  loading, 
  selectedActivities, 
  onSelectActivity, 
  onSelectAll, 
  onEditActivity, 
  onDeleteActivity, 
  onViewDetails,
  sortConfig,
  onSort 
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (activityId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedRows(newExpanded);
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

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

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Doctor Name</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Activity Date</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Location</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Notes</th>
                <th className="text-center px-4 py-3 font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-4">
                    <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-40"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No activities found</h3>
        <p className="text-text-secondary mb-4">Try adjusting your filters or add a new activity to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedActivities.length === activities.length && activities.length > 0}
                  indeterminate={selectedActivities.length > 0 && selectedActivities.length < activities.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('doctorName')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Doctor Name
                  {getSortIcon('doctorName')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('activityDate')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Activity Date
                  {getSortIcon('activityDate')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('location')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Location
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-text-primary">Notes</th>
              <th className="text-center px-4 py-3 font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <React.Fragment key={activity._id}>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedActivities.includes(activity._id)}
                      onChange={(e) => onSelectActivity(activity._id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{activity.doctorName}</p>
                        {activity.doctorId && (
                          <p className="text-sm text-text-secondary">
                            {activity.doctorId.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {formatDate(activity.activityDate)}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {getDayOfWeek(activity.activityDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-text-primary">
                      <Icon name="MapPin" size={14} />
                      <span className="text-sm">{activity.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      {activity.notes ? (
                        <>
                          <p className="text-sm text-text-primary truncate" title={activity.notes}>
                            {activity.notes}
                          </p>
                          {activity.notes.length > 50 && (
                            <button
                              onClick={() => toggleRowExpansion(activity._id)}
                              className="text-xs text-primary hover:underline mt-1"
                            >
                              {expandedRows.has(activity._id) ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-text-secondary italic">No notes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(activity)}
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditActivity(activity)}
                        title="Edit Activity"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteActivity(activity)}
                        title="Delete Activity"
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row for Notes */}
                {expandedRows.has(activity._id) && activity.notes && activity.notes.length > 50 && (
                  <tr className="bg-muted/30">
                    <td colSpan="6" className="px-4 py-3">
                      <div className="ml-13">
                        <p className="text-sm font-medium text-text-primary mb-2">Full Notes:</p>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">{activity.notes}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {activities.map((activity) => (
          <div key={activity._id} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedActivities.includes(activity._id)}
                  onChange={(e) => onSelectActivity(activity._id, e.target.checked)}
                />
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} color="white" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{activity.doctorName}</h3>
                  {activity.doctorId && (
                    <p className="text-sm text-text-secondary">
                      {activity.doctorId.specialization}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(activity)}
                >
                  <Icon name="Eye" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditActivity(activity)}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteActivity(activity)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Date:</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {formatDate(activity.activityDate)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {getDayOfWeek(activity.activityDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Location:</span>
                <div className="flex items-center gap-1 text-text-primary">
                  <Icon name="MapPin" size={14} />
                  <span className="text-sm">{activity.location}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-text-secondary">Notes:</span>
                <div className="mt-1">
                  {activity.notes ? (
                    <p className="text-sm text-text-primary">
                      {activity.notes.length > 100 
                        ? `${activity.notes.substring(0, 100)}...` 
                        : activity.notes
                      }
                    </p>
                  ) : (
                    <span className="text-sm text-text-secondary italic">No notes</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTable; 