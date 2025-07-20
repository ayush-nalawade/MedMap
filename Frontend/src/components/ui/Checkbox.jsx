import React from 'react';
import Icon from '../AppIcon';

const Checkbox = ({
  label,
  description,
  error,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  required = false,
  size = 'default',
  className = "",
  id,
  name,
  value,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    default: 16,
    lg: 20
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          
          <div
            className={`
              ${sizeClasses[size]} border-2 rounded flex items-center justify-center
              transition-all duration-150 cursor-pointer
              ${checked || indeterminate
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-input border-border hover:border-border/80'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${error ? 'border-error' : ''}
              focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
            `}
            onClick={() => !disabled && handleChange({ target: { checked: !checked } })}
          >
            {indeterminate ? (
              <Icon name="Minus" size={iconSizes[size]} color="white" />
            ) : checked ? (
              <Icon name="Check" size={iconSizes[size]} color="white" />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={id}
                className={`
                  block text-sm font-medium cursor-pointer
                  ${disabled ? 'text-text-secondary' : 'text-text-primary'}
                  ${error ? 'text-error' : ''}
                `}
              >
                {label}
                {required && <span className="text-error ml-1">*</span>}
              </label>
            )}
            
            {description && (
              <p className={`text-sm mt-1 ${error ? 'text-error' : 'text-text-secondary'}`}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center gap-1 ml-8">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

const CheckboxGroup = ({ 
  label, 
  description, 
  error, 
  required = false, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div>
          <label className="block text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        {children}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export { Checkbox, CheckboxGroup };
export default Checkbox;