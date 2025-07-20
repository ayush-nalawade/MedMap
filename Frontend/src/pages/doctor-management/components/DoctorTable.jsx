import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DoctorTable = ({ 
  doctors, 
  loading, 
  selectedDoctors, 
  onSelectDoctor, 
  onSelectAll, 
  onEditDoctor, 
  onDeleteDoctor, 
  onViewDetails,
  sortConfig,
  onSort 
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (doctorId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(doctorId)) {
      newExpanded.delete(doctorId);
    } else {
      newExpanded.add(doctorId);
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

  const formatHospitals = (hospitals) => {
    if (!hospitals || hospitals.length === 0) return 'None';
    if (hospitals.length <= 2) return hospitals.join(', ');
    return `${hospitals.slice(0, 2).join(', ')} +${hospitals.length - 2} more`;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Name</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Specialization</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Hospitals</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Location</th>
                <th className="text-left px-4 py-3 font-medium text-text-primary">Sub-Location</th>
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
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
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

  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="UserX" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No doctors found</h3>
        <p className="text-text-secondary mb-4">Try adjusting your filters or add a new doctor to get started.</p>
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
                  checked={selectedDoctors.length === doctors.length && doctors.length > 0}
                  indeterminate={selectedDoctors.length > 0 && selectedDoctors.length < doctors.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Name
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-text-primary">Phone</th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('specialization')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Specialization
                  {getSortIcon('specialization')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('specializationType')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Type
                  {getSortIcon('specializationType')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-text-primary">Preferred Hospitals</th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('location')}
                  className="flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Location
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-text-primary">Sub-Location</th>
              <th className="text-center px-4 py-3 font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <React.Fragment key={doctor._id}>
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedDoctors.includes(doctor._id)}
                      onChange={(e) => onSelectDoctor(doctor._id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{doctor.name}</p>
                        <p className="text-sm text-text-secondary">ID: {doctor._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-text-primary">
                      <Icon name="Phone" size={14} />
                      <span className="text-sm">{doctor.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {doctor.specialization}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.specializationType === 'Consultant' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {doctor.specializationType || 'General Practitioner'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-text-primary truncate" title={doctor.preferredHospitals?.join(', ')}>
                        {formatHospitals(doctor.preferredHospitals)}
                      </p>
                      {doctor.preferredHospitals?.length > 2 && (
                        <button
                          onClick={() => toggleRowExpansion(doctor._id)}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          {expandedRows.has(doctor._id) ? 'Show less' : 'Show all'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Icon name="MapPin" size={14} />
                      <span className="text-sm">{doctor.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Icon name="Navigation" size={14} />
                      <span className="text-sm">{doctor.subLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(doctor)}
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditDoctor(doctor)}
                        title="Edit Doctor"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteDoctor(doctor)}
                        title="Delete Doctor"
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row for Hospital Details */}
                {expandedRows.has(doctor._id) && doctor.preferredHospitals?.length > 2 && (
                  <tr className="bg-muted/30">
                    <td colSpan="8" className="px-4 py-3">
                      <div className="ml-13">
                        <p className="text-sm font-medium text-text-primary mb-2">All Preferred Hospitals:</p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.preferredHospitals.map((hospital, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-accent/10 text-accent"
                            >
                              {hospital}
                            </span>
                          ))}
                        </div>
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
        {doctors.map((doctor) => (
          <div key={doctor._id} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedDoctors.includes(doctor._id)}
                  onChange={(e) => onSelectDoctor(doctor._id, e.target.checked)}
                />
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} color="white" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{doctor.name}</h3>
                  <p className="text-sm text-text-secondary">ID: {doctor._id}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(doctor)}
                >
                  <Icon name="Eye" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditDoctor(doctor)}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteDoctor(doctor)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Phone:</span>
                <div className="flex items-center gap-1 text-text-primary">
                  <Icon name="Phone" size={14} />
                  <span className="text-sm">{doctor.phoneNumber}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Specialization:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {doctor.specialization}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Type:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  doctor.specializationType === 'Consultant' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {doctor.specializationType || 'General Practitioner'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Location:</span>
                <div className="flex items-center gap-1 text-text-primary">
                  <Icon name="MapPin" size={14} />
                  <span className="text-sm">{doctor.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Sub-Location:</span>
                <div className="flex items-center gap-1 text-text-primary">
                  <Icon name="Navigation" size={14} />
                  <span className="text-sm">{doctor.subLocation}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-text-secondary">Preferred Hospitals:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {doctor.preferredHospitals?.slice(0, 3).map((hospital, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-accent/10 text-accent"
                    >
                      {hospital}
                    </span>
                  ))}
                  {doctor.preferredHospitals?.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-text-secondary">
                      +{doctor.preferredHospitals.length - 3} more
                    </span>
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

export default DoctorTable;