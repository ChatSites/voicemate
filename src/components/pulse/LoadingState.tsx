
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const PulseLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-voicemate-card border-gray-800">
          <CardHeader className="pb-4">
            <Skeleton className="h-8 w-3/4 bg-gray-700 mb-2" />
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gray-800 h-16 flex items-center justify-center">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-5/6 bg-gray-700" />
              <Skeleton className="h-4 w-4/6 bg-gray-700" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-32 rounded-full bg-gray-700" />
              <Skeleton className="h-10 w-32 rounded-full bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
