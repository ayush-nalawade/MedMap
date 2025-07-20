import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import ConsultantTable from './components/ConsultantTable';
import ConsultantFilters from './components/ConsultantFilters';
import ConsultantModal from './components/ConsultantModal';
import Pagination from '../doctor-management/components/Pagination';
import api from '../../utils/api';
import { useAlert } from '../../contexts/AlertContext';

const ConsultantManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalConsultants, setTotalConsultants] = useState(0);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    location: '',
    specializationType: []
  });

  const { showSuccess, showError } = useAlert();

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      };

      const response = await api.getConsultants(params);
      setConsultants(response.consultants);
      setFilteredConsultants(response.consultants);
      setTotalConsultants(response.total);
    } catch (error) {
      console.error('Error loading consultants:', error);
      showError('Failed to load consultants');
    } finally {
      setLoading(false);
    }
  };

  // Filter consultants based on applied filters
  const applyFilters = useCallback((filtersToApply) => {
    let filtered = [...consultants];

    if (filtersToApply.search) {
      const searchTerm = filtersToApply.search.toLowerCase();
      filtered = filtered.filter(consultant =>
        consultant.name.toLowerCase().includes(searchTerm) ||
        consultant.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filtersToApply.specialization) {
      filtered = filtered.filter(consultant =>
        consultant.specialization === filtersToApply.specialization
      );
    }

    if (filtersToApply.location) {
      filtered = filtered.filter(consultant =>
        consultant.location === filtersToApply.location
      );
    }

    setFilteredConsultants(filtered);
  }, [consultants]);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  useEffect(() => {
    fetchConsultants();
  }, [currentPage, itemsPerPage, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      location: '',
      specializationType: []
    });
    setCurrentPage(1);
  };

  const handleAddConsultant = () => {
    setEditingConsultant(null);
    setModalOpen(true);
  };

  const handleEditConsultant = (consultant) => {
    setEditingConsultant(consultant);
    setModalOpen(true);
  };

  const handleDeleteConsultant = async (consultantId) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        setLoading(true);
        await api.deleteConsultant(consultantId);
        fetchConsultants(); // Refresh the list
        showSuccess('Consultant deleted successfully!');
      } catch (error) {
        console.error('Error deleting consultant:', error);
        showError(`Failed to delete consultant: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewConsultant = (consultant) => {
    // Navigate to consultant profile page
    window.location.href = `/consultant-profile?id=${consultant._id}`;
  };

  const handleSaveConsultant = async (consultantData) => {
    try {
      setModalLoading(true);
      
      if (editingConsultant) {
        // Update existing consultant
        await api.updateConsultant(editingConsultant._id, consultantData);
        showSuccess('Consultant updated successfully!');
      } else {
        // Create new consultant
        await api.createConsultant(consultantData);
        showSuccess('Consultant created successfully!');
      }
      
      setModalOpen(false);
      fetchConsultants(); // Refresh the list
    } catch (error) {
      console.error('Error saving consultant:', error);
      
      // Handle validation errors
      if (error.status === 400 && error.data) {
        if (error.data.errors && Array.isArray(error.data.errors)) {
          const errorMessages = error.data.errors.join('\n');
          showError(`Validation Error:\n${errorMessages}`);
        } else if (error.data.msg) {
          showError(`Error: ${error.data.msg}`);
        } else {
          showError('Failed to save consultant. Please check your input.');
        }
      } else {
        showError('Failed to save consultant. Please try again.');
      }
    } finally {
      setModalLoading(false);
    }
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
              <h1 className="text-2xl font-bold text-text-primary">Consultant Management</h1>
              <p className="text-text-secondary mt-1">
                Manage and organize your healthcare network's consultants
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddConsultant}
                iconName="Plus"
                iconPosition="left"
              >
                Add Consultant
              </Button>
            </div>
          </div>

          {/* Filters */}
          <ConsultantFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <ConsultantTable
              consultants={filteredConsultants}
              loading={loading}
              onEdit={handleEditConsultant}
              onDelete={handleDeleteConsultant}
              onView={handleViewConsultant}
            />
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalConsultants / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={totalConsultants}
              itemName="consultants"
            />
          </div>
        </div>
      </main>

      {/* Consultant Modal */}
      <ConsultantModal
        isOpen={modalOpen}
        consultant={editingConsultant}
        onSave={handleSaveConsultant}
        onClose={() => setModalOpen(false)}
        loading={modalLoading}
      />
    </div>
  );
};

export default ConsultantManagement;