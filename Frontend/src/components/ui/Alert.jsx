import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getAlertStyles = () => {
    const baseStyles = "relative p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ease-in-out transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      case 'error':
      case 'failed':
      case 'delete':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-green-500' };
      case 'error':
      case 'failed':
      case 'delete':
        return { name: 'XCircle', color: 'text-red-500' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-yellow-500' };
      case 'info':
      default:
        return { name: 'Info', color: 'text-blue-500' };
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
      case 'failed':
      case 'delete':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
      default:
        return 'bg-blue-400';
    }
  };

  const icon = getIcon();

  return (
    <div className={`${getAlertStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon name={icon.name} size={20} className={icon.color} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          {message && (
            <p className="text-sm">
              {message}
            </p>
          )}
        </div>
        {/* Hide close button for error/failed/delete alerts */}
        {!(type === 'error' || type === 'failed' || type === 'delete') && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Progress bar for auto-close */}
      {autoClose && duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-linear ${getProgressBarColor()}`}
            style={{
              width: isVisible ? '100%' : '0%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Alert; 