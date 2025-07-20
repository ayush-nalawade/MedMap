import React from 'react';
import Icon from '../../../components/AppIcon';

const ConsultantInfo = ({ consultant }) => {
  if (!consultant) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Avatar and Basic Info */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="User" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-1">
          {consultant.consultant.name}
        </h2>
        <p className="text-text-secondary">{consultant.consultant.specialization}</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Mail" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">{consultant.consultant.email}</span>
        </div>
        
        {consultant.phone && (
          <div className="flex items-center gap-3">
            <Icon name="Phone" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{consultant.consultant.phone}</span>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <Icon name="MapPin" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {consultant.consultant.location}
            {consultant.consultant.subLocation && `, ${consultant.consultant.subLocation}`}
          </span>
        </div>
      </div>

      {/* Preferred Hospitals */}
      {consultant.preferredHospitals && consultant.preferredHospitals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Preferred Hospitals</h3>
          <div className="space-y-2">
            {consultant.preferredHospitals.map((hospital, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name="Building" size={14} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">{hospital}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {consultant.consultant.mappedDoctors ? consultant.consultant.mappedDoctors.length : 0}
            </div>
            <div className="text-xs text-text-secondary">Mapped Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              ${consultant.consultant.mappedDoctors ? 
                consultant.consultant.mappedDoctors.reduce((sum, mapping) => sum + (mapping.cover_money || 0), 0).toLocaleString() 
                : 0}
            </div>
            <div className="text-xs text-text-secondary">Total Coverage</div>
          </div>
        </div>
      </div>

      {/* Created Date */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Icon name="Calendar" size={14} />
          <span>Joined {new Date(consultant.consultant.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ConsultantInfo; 