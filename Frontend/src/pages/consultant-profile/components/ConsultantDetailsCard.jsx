import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConsultantDetailsCard = ({ consultant, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Icon name="UserCheck" size={24} color="white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">{consultant.name}</h2>
            <p className="text-text-secondary">{consultant.specialization}</p>
          </div>
        </div>
        <Button
          variant="outline"
          iconName="Edit"
          iconPosition="left"
          onClick={handleEditClick}
          className="hover-scale"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Icon name="MapPin" size={16} />
            Location
          </h3>
          <p className="text-text-primary">{consultant.location}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Icon name="Building2" size={16} />
            Preferred Hospitals
          </h3>
          <div className="flex flex-wrap gap-2">
            {consultant.preferredHospitals.map((hospital, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted text-text-primary text-sm rounded-full"
              >
                {hospital}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Icon name="Calendar" size={16} />
            Joined Date
          </h3>
          <p className="text-text-primary">{consultant.joinedDate}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Icon name="Phone" size={16} />
            Contact
          </h3>
          <p className="text-text-primary">{consultant.phone}</p>
          <p className="text-text-secondary text-sm">{consultant.email}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
          <Icon name="FileText" size={16} />
          Bio
        </h3>
        <p className="text-text-primary text-sm leading-relaxed">{consultant.bio}</p>
      </div>
    </div>
  );
};

export default ConsultantDetailsCard;