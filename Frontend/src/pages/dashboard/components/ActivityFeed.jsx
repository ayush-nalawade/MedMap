import React from 'react';
import Icon from '../../../components/AppIcon';

// Error boundary for ActivityFeed
class ActivityFeedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ActivityFeed Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card border border-border rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">Unable to load activity feed</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ActivityFeed = ({ activities = [] }) => {
  // Defensive programming - ensure we have safe data
  const safeActivities = React.useMemo(() => {
    if (!Array.isArray(activities)) return [];
    
    return activities.filter(activity => {
      return activity && typeof activity === 'object';
    }).slice(0, 10); // Limit to 10 items
  }, [activities]);

  const getActivityIcon = (type) => {
    const iconMap = {
      'doctor_added': 'UserPlus',
      'consultant_added': 'UserCheck',
      'doctor_updated': 'Edit',
      'consultant_updated': 'Edit',
      'mapping_created': 'Link',
      'mapping_updated': 'RefreshCw'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'doctor_added': 'text-success',
      'consultant_added': 'text-success',
      'doctor_updated': 'text-warning',
      'consultant_updated': 'text-warning',
      'mapping_created': 'text-primary',
      'mapping_updated': 'text-primary'
    };
    return colorMap[type] || 'text-text-secondary';
  };

  const formatTime = (date) => {
    try {
      if (!date) return 'Recently';
      const now = new Date();
      const activityDate = new Date(date);
      const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  // Safe text rendering
  const SafeText = ({ children, className = "" }) => {
    try {
      const safeText = String(children || '').substring(0, 200);
      return <span className={className}>{safeText}</span>;
    } catch (error) {
      return <span className={className}>Activity performed</span>;
    }
  };

  // Safe icon rendering
  const SafeIcon = ({ name, size = 16, className = "" }) => {
    try {
      return <Icon name={name} size={size} className={className} />;
    } catch (error) {
      return <Icon name="Activity" size={size} className={className} />;
    }
  };

  return (
    <ActivityFeedErrorBoundary>
      <div className="bg-card border border-border rounded-lg p-6 card-shadow">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {safeActivities.length > 0 ? (
            safeActivities.map((activity, index) => {
              const safeType = activity?.type || 'default';
              const safeDescription = activity?.description || 'Activity performed';
              const safeUser = activity?.user || 'System';
              const safeTimestamp = activity?.timestamp;
              
              return (
                <div key={activity?.id || index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted ${getActivityColor(safeType)}`}>
                    <SafeIcon name={getActivityIcon(safeType)} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <SafeText>{safeDescription}</SafeText>
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      by <SafeText>{safeUser}</SafeText> • {formatTime(safeTimestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <SafeIcon name="Activity" size={48} className="text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </ActivityFeedErrorBoundary>
  );
};

export default ActivityFeed;