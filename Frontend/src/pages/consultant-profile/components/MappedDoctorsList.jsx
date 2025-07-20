import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import EditMappingModal from './EditMappingModal';

const MappedDoctorsList = ({ consultant, onRemoveMapping, onUpdateMapping }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  console.log('MappedDoctorsList received consultant:', consultant);
  console.log('Mapped doctors:', consultant?.consultant?.mappedDoctors);
  
  if (!consultant) return null;
 
  const mappedDoctors = consultant.consultant.mappedDoctors || [];
  console.log('MappedDoctorsList mappedDoctors:', consultant.consultant.mappedDoctors);
  const handleEditMapping = (mapping) => {
    setSelectedMapping(mapping);
    setEditModalOpen(true);
  };

  const handleUpdateMapping = async (referrals) => {
    try {
      setEditLoading(true);
      await onUpdateMapping(selectedMapping.doctor._id, referrals);
      setEditModalOpen(false);
      setSelectedMapping(null);
    } catch (error) {
      console.error('Error updating mapping:', error);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Mapped Doctors</h3>
          <div className="text-sm text-text-secondary">
            {mappedDoctors.length} doctor{mappedDoctors.length !== 1 ? 's' : ''} mapped
          </div>
        </div>

        {mappedDoctors.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-text-secondary" />
            </div>
            <h4 className="text-lg font-medium text-text-primary mb-2">No Doctors Mapped</h4>
            <p className="text-text-secondary mb-4">
              This consultant doesn't have any doctors mapped yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mappedDoctors.map((mapping, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">
                          {mapping.doctor?.name || 'Unknown Doctor'}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {mapping.doctor?.specialization || 'Unknown Specialization'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        <span>{mapping.doctor?.location || 'Unknown Location'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={14} />
                        <span className="font-medium text-text-primary">
                          {mapping.referrals || 0}
                        </span>
                        <span>referrals</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMapping(mapping)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveMapping(mapping.doctor?._id || mapping.doctor)}
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {mappedDoctors.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total Referrals:</span>
              <span className="text-lg font-semibold text-text-primary">
                {mappedDoctors.reduce((sum, mapping) => sum + (mapping.referrals || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Mapping Modal */}
      <EditMappingModal
        isOpen={editModalOpen}
        mapping={selectedMapping}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMapping(null);
        }}
        onUpdate={handleUpdateMapping}
        loading={editLoading}
      />
    </>
  );
};

export default MappedDoctorsList; 