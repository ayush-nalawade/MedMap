import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  label,
  description,
  error,
  placeholder = "Select option...",
  options = [],
  value,
  onChange,
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  required = false,
  loading = false,
  className = "",
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable && searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const getSelectedLabels = () => {
    if (!value) return [];
    
    if (multiple) {
      return Array.isArray(value) 
        ? value.map(val => options.find(opt => opt.value === val)?.label).filter(Boolean)
        : [];
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? [selectedOption.label] : [];
    }
  };

  const handleOptionClick = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(val => val !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const selectedLabels = getSelectedLabels();
  const hasValue = multiple ? selectedLabels.length > 0 : Boolean(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          className={`
            relative w-full bg-input border rounded-md px-3 py-2 text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            transition-colors duration-150
            ${error ? 'border-error' : 'border-border hover:border-border/80'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          id={id}
          name={name}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-text-secondary">Loading...</span>
                </div>
              ) : hasValue ? (
                <div className="flex flex-wrap gap-1">
                  {multiple && selectedLabels.length > 2 ? (
                    <>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                        {selectedLabels[0]}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-text-secondary">
                        +{selectedLabels.length - 1} more
                      </span>
                    </>
                  ) : (
                    selectedLabels.map((label, index) => (
                      multiple ? (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                        >
                          {label}
                        </span>
                      ) : (
                        <span key={index} className="text-text-primary">{label}</span>
                      )
                    ))
                  )}
                </div>
              ) : (
                <span className="text-text-secondary">{placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {clearable && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 hover:bg-muted rounded transition-colors"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  />
                </div>
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-text-secondary text-center">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`
                        w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors
                        ${isSelected ? 'bg-primary/10 text-primary' : 'text-text-primary'}
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-text-secondary mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {multiple && isSelected && (
                          <Icon name="Check" size={16} className="text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-sm text-text-secondary">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;