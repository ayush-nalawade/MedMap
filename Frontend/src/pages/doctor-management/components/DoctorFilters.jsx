import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DoctorFilters = ({ onFiltersChange, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSubLocation, setSelectedSubLocation] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedSpecializationTypes, setSelectedSpecializationTypes] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);

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

  const subLocationOptions = [
    { value: 'NA', label: 'NA' },
    { value: 'eksar', label: 'Eksar' },
    { value: 'sv-road', label: 'S.V. Road' },
    { value: 'mg-road', label: 'M.G. Road' },
    { value: 'link-road', label: 'Link Road' },
    { value: 'chikoowadi', label: 'Chikoowadi' },
    { value: 'bangur-nagar', label: 'Bangur Nagar' },
    { value: 'teen dongri', label: 'Teen dongri' },
    { value: 'malvani', label: 'Malvani' },
    { value: 'ram-mandir', label: 'Ram Mandir' },
    { value: 'jawahar-nagar', label: 'Jawahar Nagar' },
    { value: 'bhagat-singh-nagar-1', label: 'Bhagat Singh Nagar No. 1' },
    { value: 'bhagat-singh-nagar-2', label: 'Bhagat Singh Nagar No. 2' },
    { value: 'motilal-nagar', label: 'Motilal Nagar' },
    { value: 'best-colony', label: 'Best Colony' },
    { value: 'evershine-nagar', label: 'Evershine Nagar' },
    { value: 'laljipada', label: 'Laljipada' },
    { value: 'marve-road', label: 'Marve Road' },
    { value: 'sai-nagar', label: 'Sai Nagar' },
    { value: 'patel-nagar', label: 'Patel Nagar' },
    { value: 'shantilal-modi-road', label: 'Shantilal Modi Road' },
    { value: 'irani-wadi', label: 'Irani Wadi' },
    { value: 'gorai-1', label: 'Gorai 1' },
    { value: 'gorai-2', label: 'Gorai 2' },
    { value: 'mhb-colony', label: 'MHB Colony' },
    { value: 'charkop-sector-8', label: 'Charkop Sector 8' },
    { value: 'charkop-sector-9', label: 'Charkop Sector 9' },
    { value: 'somwari-bazar', label: 'Somwari Bazar' },
    { value: 'prem-nagar', label: 'Prem Nagar' },
    { value: 'liberty-garden', label: 'Liberty Garden' },
    { value: 'behram-baug', label: 'Behram Baug' },
    { value: 'pandurang-wadi', label: 'Pandurang Wadi' },
    { value: 'santosh-nagar', label: 'Santosh Nagar' },
    { value: 'quarters-colony', label: 'Quarters Colony' },
    { value: 'bachchani-nagar', label: 'Bachchani Nagar' },
    { value: 'malad-east', label: 'Malad East' },
    { value: 'borivali-east', label: 'Borivali East' },
    { value: 'goregaon-east', label: 'Goregaon East' },
    { value: 'kandivali-east', label: 'Kandivali East' },
    { value: 'thakur-village', label: 'Thakur Village' },
    { value: 'thakur-complex', label: 'Thakur Complex' },
    { value: 'dahisar', label: 'Dahisar' },
    { value: 'dahisar-east', label: 'Dahisar East' },
    { value: 'anand-nagar', label: 'Anand Nagar' },
    { value: 'bhadran-nagar', label: 'Bhadran Nagar' },
    { value: 'ganesh-nagar', label: 'Ganesh Nagar' },
  ];
  

  const specializationOptions = [
    { value: 'cardiologist', label: 'Cardiologist' },
    { value: 'neurologist', label: 'Neurologist' },
    { value: 'orthopedist', label: 'Orthopedist' },
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'oncologist', label: 'Oncologist' },
    { value: 'gastroenterologist', label: 'Gastroenterologist' },
    { value: 'pulmonologist', label: 'Pulmonologist' },
    { value: 'endocrinologist', label: 'Endocrinologist' },
    { value: 'rheumatologist', label: 'Rheumatologist' },
    { value: 'ophthalmologist', label: 'Ophthalmologist' },
    { value: 'ent', label: 'ENT' },
    { value: 'general-surgeon', label: 'General Surgeon' },
    { value: 'bams', label: 'BAMS' },
    { value: 'bhms', label: 'BHMS' },
    { value: 'mbbs', label: 'MBBS' },
    { value: 'md', label: 'MD' }
  ];

  const specializationTypeOptions = [
    { value: 'Consultant', label: 'Consultant' },
    { value: 'General Practitioner', label: 'General Practitioner' }
  ];

  const hospitalOptions = [
    { value: '', label: 'All Hospitals' },
    { value: 'lilavati-hospital', label: 'Lilavati Hospital' },
    { value: 'kokilaben-hospital', label: 'Kokilaben Hospital' },
    { value: 'breach-candy-hospital', label: 'Breach Candy Hospital' },
    { value: 'bombay-hospital', label: 'Bombay Hospital' },
    { value: 'jaslok-hospital', label: 'Jaslok Hospital' },
    { value: 'saifee-hospital', label: 'Saifee Hospital' },
    { value: 'hinduja-hospital', label: 'Hinduja Hospital' },
    { value: 'nanavati-hospital', label: 'Nanavati Hospital' },
    { value: 'wockhardt-hospital', label: 'Wockhardt Hospital' },
    { value: 'fortis-hospital', label: 'Fortis Hospital' }
  ];

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleFiltersChange();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Immediate filter change for dropdowns
  useEffect(() => {
    handleFiltersChange();
  }, [selectedLocation, selectedSubLocation, selectedSpecializations, selectedSpecializationTypes, selectedHospitals]);

  const handleFiltersChange = () => {
    const filters = {
      search: searchTerm,
      location: selectedLocation,
      subLocation: selectedSubLocation,
      specializations: selectedSpecializations,
      specializationTypes: selectedSpecializationTypes,
      hospitals: selectedHospitals
    };
    onFiltersChange(filters);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedSubLocation('');
    setSelectedSpecializations([]);
    setSelectedSpecializationTypes([]);
    setSelectedHospitals([]);
    onClearFilters();
  };

  const hasActiveFilters = searchTerm || selectedLocation || selectedSubLocation || selectedSpecializations.length > 0 || selectedSpecializationTypes.length > 0 || selectedHospitals.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Filter" size={20} />
          Filter Doctors
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-1">
          <Input
            type="search"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select location"
            options={locationOptions}
            value={selectedLocation}
            onChange={setSelectedLocation}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Sub-location Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select sub-location"
            options={subLocationOptions}
            value={selectedSubLocation}
            onChange={setSelectedSubLocation}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Specialization Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select specializations"
            options={specializationOptions}
            value={selectedSpecializations}
            onChange={setSelectedSpecializations}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Specialization Type Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select types"
            options={specializationTypeOptions}
            value={selectedSpecializationTypes}
            onChange={setSelectedSpecializationTypes}
            multiple
            clearable
          />
        </div>

        {/* Hospital Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select hospitals"
            options={hospitalOptions}
            value={selectedHospitals}
            onChange={setSelectedHospitals}
            multiple
            searchable
            clearable
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {selectedLocation && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                Location: {locationOptions.find(opt => opt.value === selectedLocation)?.label}
                <button
                  onClick={() => setSelectedLocation('')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {selectedSubLocation && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info text-sm rounded-full">
                Sub-location: {subLocationOptions.find(opt => opt.value === selectedSubLocation)?.label}
                <button
                  onClick={() => setSelectedSubLocation('')}
                  className="ml-1 hover:bg-info/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {selectedSpecializations.map(spec => (
              <span key={spec} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                {specializationOptions.find(opt => opt.value === spec)?.label}
                <button
                  onClick={() => setSelectedSpecializations(prev => prev.filter(s => s !== spec))}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}

            {selectedSpecializationTypes.map(type => (
              <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info text-sm rounded-full">
                {type}
                <button
                  onClick={() => setSelectedSpecializationTypes(prev => prev.filter(t => t !== type))}
                  className="ml-1 hover:bg-info/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}

            {selectedHospitals.map(hospital => (
              <span key={hospital} className="inline-flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning text-sm rounded-full">
                {hospitalOptions.find(opt => opt.value === hospital)?.label}
                <button
                  onClick={() => setSelectedHospitals(prev => prev.filter(h => h !== hospital))}
                  className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorFilters;