import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import DoctorFilters from './components/DoctorFilters';
import DoctorTable from './components/DoctorTable';
import DoctorModal from './components/DoctorModal';
import DoctorDetailsModal from './components/DoctorDetailsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import BulkActionsBar from './components/BulkActionsBar';
import Pagination from './components/Pagination';
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

const DoctorManagement = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Modal states
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    specializations: [],
    locations: []
  });
  
  // Filter and pagination states
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    subLocation: '',
    specializations: [],
    specializationTypes: [],
    hospitals: []
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalDoctors, setTotalDoctors] = useState(0);

  // Load doctors data
  useEffect(() => {
    fetchDoctors();
    fetchStats();
  }, [currentPage, itemsPerPage, filters, sortConfig]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      console.log('Fetching doctors with params:', {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...filters
      });
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...filters
      };

      const response = await api.getDoctors(params);
      console.log('Doctors response:', response);
      
      setDoctors(response.doctors);
      setFilteredDoctors(response.doctors);
      setTotalDoctors(response.total);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showError(`Error loading doctors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getDoctorStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Filter and sort doctors
  const processedDoctors = useMemo(() => {
    let result = [...doctors];

    // Apply filters
    if (filters.search) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(doctor => doctor.location === filters.location);
    }

    if (filters.subLocation) {
      result = result.filter(doctor => doctor.subLocation === filters.subLocation);
    }

    if (filters.specializations.length > 0) {
      result = result.filter(doctor =>
        filters.specializations.includes(doctor.specialization)
      );
    }

    if (filters.specializationTypes.length > 0) {
      result = result.filter(doctor =>
        filters.specializationTypes.includes(doctor.specializationType)
      );
    }

    if (filters.hospitals.length > 0) {
      result = result.filter(doctor =>
        doctor.preferredHospitals.some(hospital =>
          filters.hospitals.includes(hospital)
        )
      );
    }

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
  }, [doctors, filters, sortConfig]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      subLocation: '',
      specializations: [],
      specializationTypes: [],
      hospitals: []
    });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectDoctor = (doctorId, checked) => {
    if (checked) {
      setSelectedDoctors(prev => [...prev, doctorId]);
    } else {
      setSelectedDoctors(prev => prev.filter(id => id !== doctorId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDoctors(processedDoctors.map(doctor => doctor._id));
    } else {
      setSelectedDoctors([]);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowDoctorModal(true);
  };

  const handleEditDoctor = (doctor) => {
    console.log('Edit doctor clicked:', doctor);
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleViewDetails = (doctor) => {
    console.log('View details clicked:', doctor);
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const handleDeleteDoctor = (doctor) => {
    console.log('Delete doctor clicked:', doctor);
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      setModalLoading(true);
      console.log('Saving doctor data:', doctorData);
      
      if (selectedDoctor) {
        // Update existing doctor
        console.log('Updating doctor with ID:', selectedDoctor._id);
        const response = await api.updateDoctor(selectedDoctor._id, doctorData);
        console.log('Update response:', response);
      } else {
        // Create new doctor
        console.log('Creating new doctor');
        const response = await api.createDoctor(doctorData);
        console.log('Create response:', response);
      }
      
      setShowDoctorModal(false);
      setSelectedDoctor(null);
      fetchDoctors(); // Refresh the list
      
      // Show success message
      showSuccess(`Doctor ${selectedDoctor ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving doctor:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async (doctor) => {
    try {
      setModalLoading(true);
      console.log('Deleting doctor with ID:', doctor._id);
      
      await api.deleteDoctor(doctor._id);
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      fetchDoctors(); // Refresh the list
      
      // Show success message
      showSuccess('Doctor deleted successfully!');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDoctors.length === 0) return;
    
    try {
      setLoading(true);
      await api.bulkDeleteDoctors(selectedDoctors);
      setSelectedDoctors([]);
      fetchDoctors(); // Refresh the list
      
      // Show success message
      console.log(`${selectedDoctors.length} doctors deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting doctors:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async () => {
    try {
      setLoading(true);
      const response = await api.bulkExportDoctors(selectedDoctors);
      
      // Create and download CSV file
      const csvContent = convertToCSV(response.doctors);
      downloadCSV(csvContent, 'doctors_export.csv');
      
      // Show success message
      console.log('Doctors exported successfully');
    } catch (error) {
      console.error('Error exporting doctors:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAssign = () => {
    // Navigate to bulk assignment page or show modal
    console.log('Bulk assign functionality');
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
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

  const showToast = (message, type) => {
    // Implement toast notification
    console.log(`${type}: ${message}`);
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
              <h1 className="text-2xl font-bold text-text-primary">Doctor Management</h1>
              <p className="text-text-secondary mt-1">
                Manage and organize your healthcare network's doctors
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddDoctor}
                iconName="Plus"
                iconPosition="left"
              >
                Add Doctor
              </Button>
            </div>
          </div>

          {/* Filters */}
          <DoctorFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            stats={stats}
          />

          {/* Bulk Actions */}
          {selectedDoctors.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedDoctors.length}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
              onBulkAssign={handleBulkAssign}
            />
          )}

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <DoctorTable
              doctors={processedDoctors}
              loading={loading}
              selectedDoctors={selectedDoctors}
              sortConfig={sortConfig}
              onSelectDoctor={handleSelectDoctor}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onEditDoctor={handleEditDoctor}
              onViewDetails={handleViewDetails}
              onDeleteDoctor={handleDeleteDoctor}
            />
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalDoctors / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={totalDoctors}
              itemName="doctors"
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showDoctorModal && (
        <DoctorModal
          doctor={selectedDoctor}
          onSave={handleSaveDoctor}
          onClose={() => setShowDoctorModal(false)}
          loading={modalLoading}
        />
      )}

      {showDetailsModal && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          doctor={selectedDoctor}
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeleteModal(false)}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

export default DoctorManagement;