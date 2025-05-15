
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const PulseNotFoundState: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6">
      <Card className="bg-voicemate-card border-gray-800 max-w-md w-full">
        <CardHeader>
          <CardTitle>Pulse Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            We couldn't find the pulse you're looking for. It may have been removed or the link might be incorrect.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/">
            <Button className="bg-voicemate-purple hover:bg-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
