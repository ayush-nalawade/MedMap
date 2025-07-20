import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange,
  itemName = 'doctors' // Default to 'doctors' for backward compatibility
}) => {
  const pageSizeOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Items Info */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-text-secondary">
            Showing {startItem} to {endItem} of {totalItems} {itemName}
          </p>
          
          <Select
            options={pageSizeOptions}
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="w-32"
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First page"
          >
            <Icon name="ChevronsLeft" size={16} />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-text-secondary">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Page Info */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next page"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last page"
          >
            <Icon name="ChevronsRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;