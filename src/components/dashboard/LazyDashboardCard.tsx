
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LazyDashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardCardSkeleton = () => (
  <Card className="bg-voicemate-card border-gray-800">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 bg-gray-700" />
      <Skeleton className="h-4 w-1/2 bg-gray-700" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-20 w-full bg-gray-700" />
    </CardContent>
  </Card>
);

const LazyDashboardCard: React.FC<LazyDashboardCardProps> = ({ children, className }) => {
  return (
    <Suspense fallback={<DashboardCardSkeleton />}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
};

export default LazyDashboardCard;
