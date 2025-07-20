import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BrandingHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <Icon name="Activity" size={32} color="white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        MedMap
      </h1>
      <p className="text-text-secondary">
        Healthcare Network Management Platform
      </p>
    </div>
  );
};

export default BrandingHeader;