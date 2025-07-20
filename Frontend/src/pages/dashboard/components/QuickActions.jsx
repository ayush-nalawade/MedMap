import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      title: "Add New Doctor",
      description: "Register a new doctor profile",
      icon: "UserPlus",
      color: "primary",
      path: "/doctor-management"
    },
    {
      title: "Add New Consultant",
      description: "Create a new consultant profile",
      icon: "UserCheck",
      color: "accent",
      path: "/consultant-management"
    },
    {
      title: "View All Doctors",
      description: "Manage existing doctor profiles",
      icon: "Users",
      color: "secondary",
      path: "/doctor-management"
    },
    {
      title: "View All Consultants",
      description: "Manage consultant relationships",
      icon: "Building",
      color: "secondary",
      path: "/consultant-management"
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
      case 'accent':
        return 'bg-accent hover:bg-accent/90 text-accent-foreground';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.path}>
            <Button
              variant="ghost"
              className={`w-full h-auto p-4 flex flex-col items-center text-center space-y-2 hover-scale transition-all duration-150 ${getColorClasses(action.color)}`}
            >
              <Icon name={action.icon} size={24} color="white" />
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;