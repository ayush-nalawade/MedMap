import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConsultantTable = ({ 
  consultants, 
  onEdit, 
  onDelete, 
  onView, 
  loading,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange
}) => {
  const navigate = useNavigate();
  const [selectedConsultants, setSelectedConsultants] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedConsultants(consultants.map(c => c._id));
    } else {
      setSelectedConsultants([]);
    }
  };

  const handleSelectConsultant = (consultantId, checked) => {
    if (checked) {
      setSelectedConsultants(prev => [...prev, consultantId]);
    } else {
      setSelectedConsultants(prev => prev.filter(id => id !== consultantId));
    }
  };

  const handleDeleteClick = (consultant) => {
    setDeleteConfirm(consultant);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm._id);
      setDeleteConfirm(null);
    }
  };

  const handleViewProfile = (consultant) => {
    navigate(`/consultant-profile?id=${consultant._id}`);
  };

  const handleMappedDoctorsClick = (consultant) => {
    navigate(`/consultant-profile?id=${consultant._id}`);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedConsultants.length === consultants.length && consultants.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Consultant
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Specialization
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Preferred Hospitals
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Sub-Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">
                  Mapped Doctors
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {consultants.map((consultant) => (
                <tr key={consultant._id} className="hover:bg-muted/50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedConsultants.includes(consultant._id)}
                      onChange={(e) => handleSelectConsultant(consultant._id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={consultant.avatar}
                          alt={consultant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{consultant.name}</p>
                        <p className="text-xs text-text-secondary">{consultant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-text-primary">
                      <Icon name="Phone" size={14} />
                      {consultant.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {consultant.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {consultant.preferredHospitals && consultant.preferredHospitals.slice(0, 2).map((hospital, index) => (
                        <p key={index} className="text-sm text-text-primary">{hospital}</p>
                      ))}
                      {consultant.preferredHospitals && consultant.preferredHospitals.length > 2 && (
                        <p className="text-xs text-text-secondary">
                          +{consultant.preferredHospitals.length - 2} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <Icon name="MapPin" size={14} />
                      {consultant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <Icon name="Navigation" size={14} />
                      {consultant.subLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleMappedDoctorsClick(consultant)}
                      className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-150"
                    >
                      {consultant.mappedDoctors ? consultant.mappedDoctors.length : 0} doctors
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewProfile(consultant)}
                        className="h-8 w-8"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(consultant)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(consultant)}
                        className="h-8 w-8 text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border">
          {consultants.map((consultant) => (
            <div key={consultant._id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedConsultants.includes(consultant._id)}
                    onChange={(e) => handleSelectConsultant(consultant._id, e.target.checked)}
                    className="rounded border-border mt-1"
                  />
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={consultant.avatar}
                      alt={consultant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{consultant.name}</p>
                    <p className="text-sm text-text-secondary">{consultant.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewProfile(consultant)}
                    className="h-8 w-8"
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(consultant)}
                    className="h-8 w-8"
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(consultant)}
                    className="h-8 w-8 text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Phone:</span>
                  <div className="flex items-center gap-1 text-sm text-text-primary">
                    <Icon name="Phone" size={14} />
                    {consultant.phone}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Specialization:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {consultant.specialization}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Location:</span>
                  <div className="flex items-center gap-1 text-sm text-text-primary">
                    <Icon name="MapPin" size={14} />
                    {consultant.location}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Sub-Location:</span>
                  <div className="flex items-center gap-1 text-sm text-text-primary">
                    <Icon name="Navigation" size={14} />
                    {consultant.subLocation}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Mapped Doctors:</span>
                  <button
                    onClick={() => handleMappedDoctorsClick(consultant)}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    {consultant.mappedDoctors ? consultant.mappedDoctors.length : 0} doctors
                  </button>
                </div>
                
                <div>
                  <span className="text-sm text-text-secondary">Hospitals:</span>
                  <div className="mt-1 space-y-1">
                    {consultant.preferredHospitals && consultant.preferredHospitals.slice(0, 2).map((hospital, index) => (
                      <p key={index} className="text-sm text-text-primary">{hospital}</p>
                    ))}
                    {consultant.preferredHospitals && consultant.preferredHospitals.length > 2 && (
                      <p className="text-xs text-text-secondary">
                        +{consultant.preferredHospitals.length - 2} more hospitals
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Show</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-border rounded px-2 py-1 text-sm bg-background"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-text-secondary">per page</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
                Previous
              </Button>
              
              <span className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Delete Consultant</h3>
                <p className="text-sm text-text-secondary">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This will also remove all associated doctor mappings.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete Consultant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedConsultants.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-modal-shadow p-4 z-40">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {selectedConsultants.length} consultant{selectedConsultants.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Icon name="Trash2" size={16} />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultantTable;