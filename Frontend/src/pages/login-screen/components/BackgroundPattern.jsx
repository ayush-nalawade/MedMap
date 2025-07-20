import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Medical Cross Pattern */}
      <div className="absolute top-20 left-20 w-8 h-8 opacity-5">
        <div className="w-full h-1 bg-primary absolute top-1/2 transform -translate-y-1/2"></div>
        <div className="h-full w-1 bg-primary absolute left-1/2 transform -translate-x-1/2"></div>
      </div>
      
      <div className="absolute top-40 right-32 w-6 h-6 opacity-5">
        <div className="w-full h-1 bg-accent absolute top-1/2 transform -translate-y-1/2"></div>
        <div className="h-full w-1 bg-accent absolute left-1/2 transform -translate-x-1/2"></div>
      </div>
      
      <div className="absolute bottom-32 left-40 w-10 h-10 opacity-5">
        <div className="w-full h-1 bg-secondary absolute top-1/2 transform -translate-y-1/2"></div>
        <div className="h-full w-1 bg-secondary absolute left-1/2 transform -translate-x-1/2"></div>
      </div>
      
      <div className="absolute bottom-20 right-20 w-4 h-4 opacity-5">
        <div className="w-full h-1 bg-primary absolute top-1/2 transform -translate-y-1/2"></div>
        <div className="h-full w-1 bg-primary absolute left-1/2 transform -translate-x-1/2"></div>
      </div>

      {/* Subtle Circles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/5 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-accent/5 rounded-full"></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-secondary/5 rounded-full"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-green-50/20"></div>
    </div>
  );
};

export default BackgroundPattern;