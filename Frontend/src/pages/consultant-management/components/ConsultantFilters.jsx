import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ConsultantFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const specializationOptions = [
    { value: '', label: 'All Specializations' },
    { value: 'Cardiologist', label: 'Cardiologist' },
    { value: 'Neurologist', label: 'Neurologist' },
    { value: 'Orthopedist', label: 'Orthopedist' },
    { value: 'Pediatrician', label: 'Pediatrician' },
    { value: 'Dermatologist', label: 'Dermatologist' },
    { value: 'Oncologist', label: 'Oncologist' },
    { value: 'Psychiatrist', label: 'Psychiatrist' },
    { value: 'Radiologist', label: 'Radiologist' },
    { value: 'ENT', label: 'ENT' },
    { value: 'General Surgeon', label: 'General Surgeon' },
    { value: 'BAMS', label: 'BAMS' },
    { value: 'BHMS', label: 'BHMS' },
    { value: 'MBBS', label: 'MBBS' },
    { value: 'MD', label: 'MD' }
  ];

  const specializationTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Consultant', label: 'Consultant' },
    { value: 'General Practitioner', label: 'General Practitioner' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'kandivali', label: 'Kandivali' },
    { value: 'borivali', label: 'Borivali' },
    { value: 'malad', label: 'Malad' },
    { value: 'goregaon', label: 'Goregaon' },
    { value: 'ram-mandir', label: 'Ram Mandir' },
    { value: 'dahisar', label: 'Dahisar' },
    { value: 'santacruz', label: 'Santacruz' },
    { value: 'andheri', label: 'Andheri' }
  ];

  const hospitalOptions = [
    { value: '', label: 'All Hospitals' },
    { value: 'Lilavati Hospital', label: 'Lilavati Hospital' },
    { value: 'Kokilaben Hospital', label: 'Kokilaben Hospital' },
    { value: 'Breach Candy Hospital', label: 'Breach Candy Hospital' },
    { value: 'Bombay Hospital', label: 'Bombay Hospital' },
    { value: 'Jaslok Hospital', label: 'Jaslok Hospital' },
    { value: 'Saifee Hospital', label: 'Saifee Hospital' },
    { value: 'Hinduja Hospital', label: 'Hinduja Hospital' },
    { value: 'Nanavati Hospital', label: 'Nanavati Hospital' },
    { value: 'Wockhardt Hospital', label: 'Wockhardt Hospital' },
    { value: 'Fortis Hospital', label: 'Fortis Hospital' }
  ];

  const mappedDoctorsOptions = [
    { value: '', label: 'Any Count' },
    { value: '0', label: 'No Mapped Doctors' },
    { value: '1-5', label: '1-5 Doctors' },
    { value: '6-10', label: '6-10 Doctors' },
    { value: '11+', label: '11+ Doctors' }
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={16} />
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search consultants by name or email..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Advanced Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${!isExpanded ? 'hidden lg:grid' : ''}`}>
        <Select
          label="Specialization"
          options={specializationOptions}
          value={filters.specialization || ''}
          onChange={(value) => handleFilterChange('specialization', value)}
          placeholder="Select specialization"
        />

        <Select
          label="Location"
          options={locationOptions}
          value={filters.location || ''}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Select location"
        />

        <Select
          label="Preferred Hospital"
          options={hospitalOptions}
          value={filters.hospital || ''}
          onChange={(value) => handleFilterChange('hospital', value)}
          placeholder="Select hospital"
        />

        <Select
          label="Mapped Doctors"
          options={mappedDoctorsOptions}
          value={filters.mappedDoctorsCount || ''}
          onChange={(value) => handleFilterChange('mappedDoctorsCount', value)}
          placeholder="Select count range"
        />
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.specialization && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Specialization: {filters.specialization}
                <button
                  onClick={() => handleFilterChange('specialization', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {filters.specializationType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Type: {filters.specializationType}
                <button
                  onClick={() => handleFilterChange('specializationType', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Location: {filters.location}
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.hospital && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Hospital: {filters.hospital}
                <button
                  onClick={() => handleFilterChange('hospital', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.mappedDoctorsCount && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                Doctors: {mappedDoctorsOptions.find(opt => opt.value === filters.mappedDoctorsCount)?.label}
                <button
                  onClick={() => handleFilterChange('mappedDoctorsCount', '')}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantFilters;