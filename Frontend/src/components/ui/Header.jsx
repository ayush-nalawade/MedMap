import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../contexts/UserContext';

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useUser();

  console.log('Header user data:', user);
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/doctor-management':
        return 'Doctor Management';
      case '/consultant-management':
        return 'Consultant Management';
      case '/consultant-profile':
        return 'Consultant Profile';
      default:
        return 'MedMap';
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-1000">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Icon name="Menu" size={20} />
        </Button>
        
        {/* Page Title */}
        <h1 className="text-lg font-medium text-text-primary">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Icon name="Bell" size={20} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-error rounded-full"></span>
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-text-primary">
              {user?.user?.name || 'User'}
            </span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </Button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-1100" 
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal-shadow z-1200">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary">{user?.user?.email || 'user@example.com'}</p>
                </div>
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
    </header>
  );
};

export default Header;