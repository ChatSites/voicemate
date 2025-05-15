import React from 'react';
import './App.css';

// Make sure to include Toaster at the root level for toast notifications
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <main className="app">
      <h1>VoiceMate</h1>
      
      {/* Add toaster component to ensure notifications work */}
      <Toaster />
    </main>
  );
}

export default App;
