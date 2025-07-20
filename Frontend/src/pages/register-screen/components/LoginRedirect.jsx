import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginRedirect = () => {
  return (
    <div className="mt-6 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
        <span>Already have an account?</span>
        <Link 
          to="/login-screen" 
          className="text-primary hover:text-primary/80 font-medium transition-colors duration-150 flex items-center gap-1 hover:underline"
        >
          Sign In
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <a
            href="mailto:support@medmap.com"
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
          >
            support@medmap.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginRedirect;