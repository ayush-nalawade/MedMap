import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatCard from './components/StatCard';
import RecentDoctorsList from './components/RecentDoctorsList';
import RecentConsultantsList from './components/RecentConsultantsList';
import QuickActions from './components/QuickActions';
import QuickSearch from './components/QuickSearch';
import ActivityFeed from './components/ActivityFeed';
import { useUser } from '../../contexts/UserContext';
import api from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalConsultants: 0,
    activeMappings: 0,
    totalCoverage: 0
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentConsultants, setRecentConsultants] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats, doctors, and consultants
        const [statsData, doctorsData, consultantsData] = await Promise.all([
          api.getDashboardStats(),
          api.getRecentDoctors(),
          api.getRecentConsultants()
        ]);

        setStats(statsData.stats);
        setRecentDoctors(doctorsData.doctors);
        setRecentConsultants(consultantsData.consultants);

        // Try to fetch activity feed separately to avoid breaking the entire dashboard
        try {
          const activitiesData = await api.getActivityFeed();
          setActivities(activitiesData.activities || []);
        } catch (activityError) {
          console.warn('Failed to load activity feed:', activityError);
          setActivities([]); // Set empty array as fallback
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewAllDoctors = () => {
    navigate('/doctor-management');
  };

  const handleViewAllConsultants = () => {
    navigate('/consultant-management');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentage change (mock for now)
  const calculateChange = (current, previous = 0) => {
    if (previous === 0) return '+12%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(0)}%`;
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6">
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                ))}
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
              <h3 className="text-lg font-semibold text-error mb-2">Error Loading Dashboard</h3>
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

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your healthcare network today.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Doctors"
              value={stats.totalDoctors.toString()}
              change={calculateChange(stats.totalDoctors)}
              changeType="increase"
              icon="UserCheck"
              color="primary"
            />
            <StatCard
              title="Total Consultants"
              value={stats.totalConsultants.toString()}
              change={calculateChange(stats.totalConsultants)}
              changeType="increase"
              icon="Users"
              color="success"
            />
            <StatCard
              title="Active Mappings"
              value={stats.activeMappings.toString()}
              change={calculateChange(stats.activeMappings)}
              changeType="increase"
              icon="Link"
              color="warning"
            />
            <StatCard
              title="Coverage Amount"
              value={formatCurrency(stats.totalCoverage)}
              change={calculateChange(stats.totalCoverage)}
              changeType="increase"
              icon="DollarSign"
              color="error"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Doctors and Consultants */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentDoctorsList 
                doctors={recentDoctors} 
                onViewAll={handleViewAllDoctors}
              />
              <RecentConsultantsList 
                consultants={recentConsultants} 
                onViewAll={handleViewAllConsultants}
              />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <QuickActions />
              <QuickSearch 
                doctors={recentDoctors} 
                consultants={recentConsultants} 
              />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed activities={activities} />
            </div>
            
            {/* System Health Card */}
            <div className="bg-card border border-border rounded-lg p-6 card-shadow">
              <h3 className="text-lg font-semibold text-text-primary mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">API Response</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Fast</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Last Backup</span>
                  <span className="text-sm text-text-secondary">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Active Users</span>
                  <span className="text-sm text-text-primary font-medium">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;