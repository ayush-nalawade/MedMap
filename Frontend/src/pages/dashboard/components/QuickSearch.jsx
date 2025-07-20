import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const QuickSearch = ({ doctors, consultants }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, doctors, consultants]);

  const performSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    
    const doctorResults = doctors
      .filter(doctor => 
        doctor.name.toLowerCase().includes(lowerTerm) ||
        doctor.specialization.toLowerCase().includes(lowerTerm) ||
        doctor.location.toLowerCase().includes(lowerTerm)
      )
      .map(doctor => ({ ...doctor, type: 'doctor' }));

    const consultantResults = consultants
      .filter(consultant => 
        consultant.name.toLowerCase().includes(lowerTerm) ||
        consultant.specialization.toLowerCase().includes(lowerTerm) ||
        consultant.location.toLowerCase().includes(lowerTerm)
      )
      .map(consultant => ({ ...consultant, type: 'consultant' }));

    const allResults = [...doctorResults, ...consultantResults].slice(0, 6);
    setSearchResults(allResults);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Search</h3>
      
      <div className="relative">
        <Input
          type="search"
          placeholder="Search doctors or consultants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <Icon name="Loader2" size={16} className="animate-spin text-text-secondary" />
          ) : searchTerm ? (
            <Button variant="ghost" size="xs" onClick={clearSearch}>
              <Icon name="X" size={16} />
            </Button>
          ) : (
            <Icon name="Search" size={16} className="text-text-secondary" />
          )}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {searchResults.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={result.type === 'doctor' ? '/doctor-management' : '/consultant-management'}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 border border-border"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result.type === 'doctor' ? 'bg-primary' : 'bg-accent'
              }`}>
                <Icon 
                  name={result.type === 'doctor' ? 'UserCheck' : 'Users'} 
                  size={16} 
                  color="white" 
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary text-sm">{result.name}</p>
                <p className="text-xs text-text-secondary">
                  {result.specialization} • {result.location}
                </p>
              </div>
              <div className="text-xs text-text-secondary capitalize bg-muted px-2 py-1 rounded">
                {result.type}
              </div>
            </Link>
          ))}
          
          {searchResults.length === 6 && (
            <div className="text-center pt-2">
              <p className="text-xs text-text-secondary">Showing first 6 results</p>
            </div>
          )}
        </div>
      )}

      {searchTerm && searchResults.length === 0 && !isSearching && (
        <div className="mt-4 text-center py-4">
          <Icon name="Search" size={32} className="text-text-secondary mx-auto mb-2" />
          <p className="text-sm text-text-secondary">No results found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default QuickSearch;