import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [
      { label: 'Dashboard', path: '/dashboard', icon: 'Home' }
    ];

    switch (path) {
      case '/dashboard':
        return [{ label: 'Dashboard', path: '/dashboard', icon: 'Home', current: true }];
      
      case '/doctor-management':
        items.push({ label: 'Doctor Management', path: '/doctor-management', current: true });
        break;
      
      case '/consultant-management':
        items.push({ label: 'Consultant Management', path: '/consultant-management', current: true });
        break;
      
      case '/consultant-profile':
        items.push(
          { label: 'Consultant Management', path: '/consultant-management' },
          { label: 'Consultant Profile', path: '/consultant-profile', current: true }
        );
        break;
      
      default:
        items.push({ label: 'Page', path: path, current: true });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
          )}
          
          {item.current ? (
            <span className="text-text-primary font-medium flex items-center gap-1">
              {index === 0 && item.icon && (
                <Icon name={item.icon} size={16} />
              )}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-text-secondary hover:text-primary transition-colors duration-150 flex items-center gap-1 hover-scale"
            >
              {index === 0 && item.icon && (
                <Icon name={item.icon} size={16} />
              )}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;