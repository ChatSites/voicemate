
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface PulseHeaderProps {
  intent: string | null;
  pulseId: string | null;
  createdAt: string;
}

export const PulseHeader: React.FC<PulseHeaderProps> = ({ intent, pulseId, createdAt }) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Home</span>
          </Button>
        </Link>
      </div>
      <CardTitle className="text-2xl">{intent || 'Pulse Message'}</CardTitle>
      <div className="text-sm text-gray-400">
        From: {pulseId || 'Anonymous'} • {createdAt ? new Date(createdAt).toLocaleDateString() : ''}
      </div>
    </>
  );
};
