
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldsProps {
  pulseTitle: string;
  pulseDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  pulseTitle,
  pulseDescription,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Pulse Title"
        value={pulseTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className="bg-black/20 border-gray-700 text-white placeholder:text-gray-400 focus:border-voicemate-purple"
      />
      
      <Textarea
        placeholder="Description (optional)"
        value={pulseDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="bg-black/20 border-gray-700 min-h-[120px] text-white placeholder:text-gray-400 focus:border-voicemate-purple"
      />
    </div>
  );
};

export default FormFields;
