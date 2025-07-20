import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ConsultantInfo from './components/ConsultantInfo';
import MappedDoctorsList from './components/MappedDoctorsList';
import AddDoctorModal from './components/AddDoctorModal';
import api from '../../utils/api';

const ConsultantProfile = () => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get('id');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (consultantId) {
      fetchConsultant();
    }
  }, [consultantId]);

  const fetchConsultant = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching consultant with ID:', consultantId);
      const response = await api.getConsultantById(consultantId);
      console.log('Consultant data received:', response);
      setConsultant(response);
    } catch (err) {
      console.error('Error fetching consultant:', err);
      setError('Failed to load consultant profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctorMapping = async (doctorId, referrals) => {
    try {
      setModalLoading(true);
      await api.addDoctorMapping(consultantId, doctorId, referrals);
      setShowAddDoctorModal(false);
      fetchConsultant(); // Refresh consultant data
      console.log('Doctor mapping added successfully');
    } catch (error) {
      console.error('Error adding doctor mapping:', error);
      // Handle error - could show toast notification
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateDoctorMapping = async (doctorId, referrals) => {
    try {
      await api.updateDoctorMapping(consultantId, doctorId, referrals);
      fetchConsultant(); // Refresh consultant data
      console.log('Doctor mapping updated successfully');
    } catch (error) {
      console.error('Error updating doctor mapping:', error);
      // Handle error
    }
  };

  const handleRemoveDoctorMapping = async (doctorId) => {
    if (window.confirm('Are you sure you want to remove this doctor mapping?')) {
      try {
        await api.removeDoctorMapping(consultantId, doctorId);
        fetchConsultant(); // Refresh consultant data
        console.log('Doctor mapping removed successfully');
      } catch (error) {
        console.error('Error removing doctor mapping:', error);
        // Handle error
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="h-32 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="bg-error/10 border border-error/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-error mb-2">Error Loading Profile</h3>
              <p className="text-text-secondary mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Consultant Not Found</h3>
              <p className="text-text-secondary mb-4">The consultant you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.history.back()} 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
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
              <h1 className="text-2xl font-bold text-text-primary">Consultant Profile</h1>
              <p className="text-text-secondary mt-1">
                Manage {consultant.name}'s profile and doctor mappings
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back
              </Button>
              <Button
                onClick={() => setShowAddDoctorModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Add Doctor
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consultant Information */}
            <div className="lg:col-span-1">
              <ConsultantInfo consultant={consultant} />
            </div>

            {/* Mapped Doctors */}
            <div className="lg:col-span-2">
              <MappedDoctorsList
                consultant={consultant}
                onRemoveMapping={handleRemoveDoctorMapping}
                onUpdateMapping={handleUpdateDoctorMapping}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <AddDoctorModal
          consultantId={consultantId}
          onAddMapping={handleAddDoctorMapping}
          onClose={() => setShowAddDoctorModal(false)}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

export default ConsultantProfile;