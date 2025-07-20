import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: "Administrator",
      email: "admin@medmap.com",
      password: "admin123",
      description: "Full system access"
    },
    {
      role: "Doctor",
      email: "doctor@hospital.com", 
      password: "doctor123",
      description: "Doctor profile management"
    },
    {
      role: "Manager",
      email: "manager@healthcare.com",
      password: "manager123", 
      description: "Consultant management"
    }
  ];

  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Info" size={16} color="#2563EB" />
          <span className="text-sm font-medium text-blue-800">Demo Credentials</span>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {mockCredentials.map((cred, index) => (
            <div key={index} className="p-3 bg-white rounded-md border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">{cred.role}</span>
                <span className="text-xs text-blue-600">{cred.description}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={12} color="#64748B" />
                  <span className="text-xs text-text-secondary font-mono">{cred.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Key" size={12} color="#64748B" />
                  <span className="text-xs text-text-secondary font-mono">{cred.password}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialsInfo;