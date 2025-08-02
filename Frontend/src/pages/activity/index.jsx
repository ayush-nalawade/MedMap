import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ActivityFilters from './components/ActivityFilters';
import ActivityTable from './components/ActivityTable';
import ActivityModal from './components/ActivityModal';
import ActivityDetailsModal from './components/ActivityDetailsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import BulkActionsBar from './components/BulkActionsBar';
import Pagination from './components/Pagination';
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

const Activity = () => {
  const { showSuccess, showError } = useAlert();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Modal states
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Data states
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [stats, setStats] = useState({
    totalActivities: 0,
    activitiesByDay: [],
    activitiesByLocation: [],
    activitiesByDoctor: []
  });
  
  // Filter and pagination states
  const [filters, setFilters] = useState({
    doctorName: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    dayOfWeek: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'activityDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalActivities, setTotalActivities] = useState(0);

  // Load activities data
  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [currentPage, itemsPerPage, filters, sortConfig]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Prepare backend filters
      const backendFilters = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        doctorName: filters.doctorName,
        location: filters.location,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        dayOfWeek: filters.dayOfWeek
      };

      // Remove undefined values
      Object.keys(backendFilters).forEach(key => {
        if (backendFilters[key] === undefined || backendFilters[key] === '') {
          delete backendFilters[key];
        }
      });

      console.log('Fetching activities with params:', backendFilters);
      
      const response = await api.getActivities(backendFilters);
      console.log('Activities response:', response);
      
      setActivities(response.activities);
      setFilteredActivities(response.activities);
      setTotalActivities(response.total);
    } catch (error) {
      console.error('Error fetching activities:', error);
      showError(`Error loading activities: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getActivityStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Filter and sort activities
  const processedActivities = useMemo(() => {
    let result = [...activities];

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [activities, sortConfig]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      doctorName: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      dayOfWeek: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectActivity = (activityId, checked) => {
    if (checked) {
      setSelectedActivities(prev => [...prev, activityId]);
    } else {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedActivities(processedActivities.map(activity => activity._id));
    } else {
      setSelectedActivities([]);
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setShowActivityModal(true);
  };

  const handleEditActivity = (activity) => {
    console.log('Edit activity clicked:', activity);
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleViewDetails = (activity) => {
    console.log('View details clicked:', activity);
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const handleDeleteActivity = (activity) => {
    console.log('Delete activity clicked:', activity);
    setSelectedActivity(activity);
    setShowDeleteModal(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      setModalLoading(true);
      console.log('Saving activity data:', activityData);
      
      if (selectedActivity) {
        // Update existing activity
        console.log('Updating activity with ID:', selectedActivity._id);
        const response = await api.updateActivity(selectedActivity._id, activityData);
        console.log('Update response:', response);
      } else {
        // Create new activity
        console.log('Creating new activity');
        const response = await api.createActivity(activityData);
        console.log('Create response:', response);
      }
      
      setShowActivityModal(false);
      setSelectedActivity(null);
      fetchActivities(); // Refresh the list
      
      // Show success message
      showSuccess(`Activity ${selectedActivity ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving activity:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async (activity) => {
    try {
      setModalLoading(true);
      console.log('Deleting activity with ID:', activity._id);
      
      await api.deleteActivity(activity._id);
      setShowDeleteModal(false);
      setSelectedActivity(null);
      fetchActivities(); // Refresh the list
      
      // Show success message
      showSuccess('Activity deleted successfully!');
    } catch (error) {
      console.error('Error deleting activity:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedActivities.length === 0) return;
    
    try {
      setLoading(true);
      await api.bulkDeleteActivities(selectedActivities);
      setSelectedActivities([]);
      fetchActivities(); // Refresh the list
      
      // Show success message
      showSuccess(`${selectedActivities.length} activities deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting activities:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async () => {
    try {
      setLoading(true);
      const response = await api.getActivities({
        page: 1,
        limit: 1000, // Get all activities for export
        ...filters
      });
      
      // Create and download CSV file
      const csvContent = convertToCSV(response.activities);
      downloadCSV(csvContent, 'activities_export.csv');
      
      // Show success message
      showSuccess('Activities exported successfully');
    } catch (error) {
      console.error('Error exporting activities:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = ['Doctor Name', 'Activity Date', 'Location', 'Notes', 'Created At'];
    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        `"${row.doctorName || ''}"`,
        `"${new Date(row.activityDate).toLocaleString()}"`,
        `"${row.location || ''}"`,
        `"${row.notes || ''}"`,
        `"${new Date(row.createdAt).toLocaleString()}"`
      ].join(','))
    ];
    
    return csvRows.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Activity Log</h1>
              <p className="text-text-secondary mt-1">
                Track and manage your doctor activities and appointments
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddActivity}
                iconName="Plus"
                iconPosition="left"
              >
                Add Activity
              </Button>
            </div>
          </div>

          {/* Filters */}
          <ActivityFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            stats={stats}
          />

          {/* Bulk Actions */}
          {selectedActivities.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedActivities.length}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
            />
          )}

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <ActivityTable
              activities={processedActivities}
              loading={loading}
              selectedActivities={selectedActivities}
              sortConfig={sortConfig}
              onSelectActivity={handleSelectActivity}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onEditActivity={handleEditActivity}
              onViewDetails={handleViewDetails}
              onDeleteActivity={handleDeleteActivity}
            />
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalActivities / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={totalActivities}
              itemName="activities"
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showActivityModal && (
        <ActivityModal
          activity={selectedActivity}
          onSave={handleSaveActivity}
          onClose={() => setShowActivityModal(false)}
          loading={modalLoading}
        />
      )}

      {showDetailsModal && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          activity={selectedActivity}
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeleteModal(false)}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

export default Activity; 