
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Record Voice Message</CardTitle>
      <CardDescription>Record a clear message for the best experience</CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
