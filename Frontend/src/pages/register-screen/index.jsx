import React from 'react';
import BrandingHeader from './components/BrandingHeader';
import RegistrationForm from './components/RegistrationForm';
import SecurityBadges from './components/SecurityBadges';
import LoginRedirect from './components/LoginRedirect';

const RegisterScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          {/* Branding Header */}
          <BrandingHeader />
          
          {/* Registration Form */}
          <RegistrationForm />
          
          {/* Security Badges */}
          <SecurityBadges />
          
          {/* Login Redirect */}
          <LoginRedirect />
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} MedMap. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Secure healthcare management platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;