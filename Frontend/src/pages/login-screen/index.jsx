import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import BackgroundPattern from './components/BackgroundPattern';

const LoginScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-2xl border border-border p-8 backdrop-blur-sm">
          {/* Header Section */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm />
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

export default LoginScreen;