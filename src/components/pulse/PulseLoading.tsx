
import React from 'react';

const PulseLoading: React.FC = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default PulseLoading;
