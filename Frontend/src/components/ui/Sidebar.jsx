import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../contexts/UserContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    {
      label: 'Doctor Management',
      path: '/doctor-management',
      icon: 'UserCheck',
      description: 'Manage doctor profiles'
    },
    {
      label: 'Consultant Management',
      path: '/consultant-management',
      icon: 'Users',
      description: 'Manage consultant relationships'
    },
    {
      label: 'Activity',
      path: '/activity',
      icon: 'Calendar',
      description: 'Track doctor activities'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/consultant-management') {
      return location.pathname === path || location.pathname === '/consultant-profile';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-1100 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-1200
        transform transition-transform duration-300 ease-medical
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed
        sidebar-shadow
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-3" onClick={handleNavClick}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} color="white" />
              </div>
              <h1 className="text-lg font-semibold text-text-primary">MedMap</h1>
            </Link>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150
                  hover:bg-muted hover-scale group relative
                  ${isActivePath(item.path) 
                    ? 'bg-primary text-primary-foreground border-l-4 border-l-accent' 
                    : 'text-text-primary hover:text-text-primary'
                  }
                `}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={isActivePath(item.path) ? 'white' : 'currentColor'}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <p className={`text-xs mt-0.5 ${
                    isActivePath(item.path) 
                      ? 'text-primary-foreground opacity-80' 
                      : 'text-text-secondary'
                  }`}>
                    {item.description}
                  </p>
                </div>
                
                {/* Active Indicator */}
                {isActivePath(item.path) && (
                  <div className="w-2 h-2 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-muted transition-colors duration-150"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-text-primary">{user?.name || 'Guest User'}</p>
                  <p className="text-xs text-text-secondary">User</p>
                </div>
                <Icon 
                  name="ChevronUp" 
                  size={16} 
                  className={`transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-1100" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-modal-shadow z-1200">
                    <div className="py-2">
                      <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted transition-colors duration-150 flex items-center gap-2">
                        <Icon name="User" size={16} />
                        Profile Settings
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted transition-colors duration-150 flex items-center gap-2">
                        <Icon name="Settings" size={16} />
                        Preferences
                      </button>
                      <hr className="my-2 border-border" />
                      <button 
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-colors duration-150 flex items-center gap-2"
                      >
                        <Icon name="LogOut" size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;