import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'HIPAA Compliant',
      description: 'Healthcare data protection'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Security standards verified'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">Your data is protected by industry-leading security</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
              <Icon name={feature.icon} size={16} color="white" />
            </div>
            <h4 className="text-xs font-medium text-text-primary mb-1">{feature.title}</h4>
            <p className="text-xs text-text-secondary">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-text-secondary">
          Protected by enterprise-grade security measures
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;