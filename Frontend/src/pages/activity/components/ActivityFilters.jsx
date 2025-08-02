import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActivityFilters = ({ onFiltersChange, onClearFilters }) => {
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');

  const dayOfWeekOptions = [
    { value: '', label: 'All Days' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleFiltersChange();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [doctorName]);

  // Immediate filter change for dropdowns
  useEffect(() => {
    handleFiltersChange();
  }, [location, dateFrom, dateTo, dayOfWeek]);

  const handleFiltersChange = () => {
    const filters = {
      doctorName,
      location,
      dateFrom,
      dateTo,
      dayOfWeek
    };
    onFiltersChange(filters);
  };

  const handleClearAll = () => {
    setDoctorName('');
    setLocation('');
    setDateFrom('');
    setDateTo('');
    setDayOfWeek('');
    onClearFilters();
  };

  const hasActiveFilters = doctorName || location || dateFrom || dateTo || dayOfWeek;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Icon name="Filter" size={20} />
          Filter Activities
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Doctor Name Search */}
        <div className="lg:col-span-1">
          <Input
            type="search"
            placeholder="Search by doctor name..."
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location Filter */}
        <div className="lg:col-span-1">
          <Input
            type="search"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date From */}
        <div className="lg:col-span-1">
          <Input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date To */}
        <div className="lg:col-span-1">
          <Input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Day of Week Filter */}
        <div className="lg:col-span-1">
          <Select
            placeholder="Select day of week"
            options={dayOfWeekOptions}
            value={dayOfWeek}
            onChange={setDayOfWeek}
            clearable
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {doctorName && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                Doctor: "{doctorName}"
                <button
                  onClick={() => setDoctorName('')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                Location: "{location}"
                <button
                  onClick={() => setLocation('')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {dateFrom && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info text-sm rounded-full">
                From: {new Date(dateFrom).toLocaleDateString()}
                <button
                  onClick={() => setDateFrom('')}
                  className="ml-1 hover:bg-info/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {dateTo && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-info/10 text-info text-sm rounded-full">
                To: {new Date(dateTo).toLocaleDateString()}
                <button
                  onClick={() => setDateTo('')}
                  className="ml-1 hover:bg-info/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}

            {dayOfWeek && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                Day: {dayOfWeekOptions.find(opt => opt.value === dayOfWeek)?.label}
                <button
                  onClick={() => setDayOfWeek('')}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
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

export default ActivityFilters; 