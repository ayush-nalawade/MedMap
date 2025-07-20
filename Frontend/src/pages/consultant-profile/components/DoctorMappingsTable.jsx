import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DoctorMappingsTable = ({ mappings, onEditReferralCount, onRemoveMapping, onAddMapping }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const filteredMappings = mappings.filter(mapping =>
    mapping.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStart = (mapping) => {
    setEditingId(mapping.id);
    setEditValue(mapping.referralCount.toString());
  };

  const handleEditSave = (mappingId) => {
    const newValue = parseInt(editValue);
    if (!isNaN(newValue) && newValue >= 0) {
      onEditReferralCount(mappingId, newValue);
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleRemoveClick = (mappingId) => {
    setShowConfirmDelete(mappingId);
  };

  const handleConfirmRemove = () => {
    onRemoveMapping(showConfirmDelete);
    setShowConfirmDelete(null);
  };

  const handleCancelRemove = () => {
    setShowConfirmDelete(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg card-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Users" size={20} />
            Doctor Mappings ({filteredMappings.length})
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <Input
                type="search"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={onAddMapping}
              className="hover-scale"
            >
              Add Doctor Mapping
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredMappings.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto text-text-secondary mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No Doctor Mappings</h4>
            <p className="text-text-secondary mb-4">
              {searchTerm ? 'No doctors match your search criteria.' : 'Start by adding your first doctor mapping.'}
            </p>
            {!searchTerm && (
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={onAddMapping}
              >
                Add Doctor Mapping
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Doctor Name</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Specialization</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Referral Count</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{mapping.doctorName}</p>
                        <p className="text-sm text-text-secondary">{mapping.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-accent/10 text-accent text-sm rounded-full">
                      {mapping.specialization}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === mapping.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24"
                          min="0"
                          step="1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSave(mapping.id)}
                        >
                          <Icon name="Check" size={16} className="text-success" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleEditCancel}
                        >
                          <Icon name="X" size={16} className="text-error" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          {mapping.referralCount} referrals
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStart(mapping)}
                        >
                          <Icon name="Edit" size={14} className="text-text-secondary" />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveClick(mapping.id)}
                        className="text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDelete && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-1100" onClick={handleCancelRemove} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popover border border-border rounded-lg p-6 w-96 z-1200 modal-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-text-primary">Remove Doctor Mapping</h4>
                <p className="text-sm text-text-secondary">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-text-primary mb-6">
              Are you sure you want to remove this doctor mapping? This will permanently delete the relationship and referral information.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelRemove}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmRemove}>
                Remove Mapping
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorMappingsTable;