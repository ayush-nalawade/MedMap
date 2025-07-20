import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentDoctorsList = ({ doctors, onViewAll }) => {
  const formatLastUpdated = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Doctors</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="UserCheck" size={20} color="white" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">{doctor.name}</h4>
                <p className="text-sm text-text-secondary">{doctor.specialization}</p>
                <p className="text-xs text-text-secondary">{doctor.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary mb-1">
                {formatLastUpdated(doctor.lastUpdated)}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="xs">
                  <Icon name="Eye" size={14} />
                </Button>
                <Button variant="ghost" size="xs">
                  <Icon name="Edit" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {doctors.length === 0 && (
        <div className="text-center py-8">
          <Icon name="UserCheck" size={48} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No doctors added yet</p>
          <Link to="/doctor-management">
            <Button variant="outline" size="sm" className="mt-2">
              Add First Doctor
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentDoctorsList;