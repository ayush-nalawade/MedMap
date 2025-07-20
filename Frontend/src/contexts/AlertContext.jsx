import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/ui/Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((alert) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, ...alert };
    setAlerts(prev => [...prev, newAlert]);
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    return addAlert({
      type: 'success',
      title,
      message,
      autoClose: true,
      duration: 5000
    });
  }, [addAlert]);

  const showError = useCallback((message, title = 'Error') => {
    return addAlert({
      type: 'error',
      title,
      message,
      autoClose: true,
      duration: 5000
    });
  }, [addAlert]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return addAlert({
      type: 'warning',
      title,
      message,
      autoClose: true,
      duration: 5000
    });
  }, [addAlert]);

  const showInfo = useCallback((message, title = 'Info') => {
    return addAlert({
      type: 'info',
      title,
      message,
      autoClose: true,
      duration: 5000
    });
  }, [addAlert]);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            autoClose={alert.autoClose}
            duration={alert.duration}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}; 