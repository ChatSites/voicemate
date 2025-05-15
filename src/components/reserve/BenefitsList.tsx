
import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

type BenefitsListProps = {
  benefits: string[];
  title: string;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ benefits, title }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-4">
      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
      <ul className="space-y-2">
        {benefits.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-voicemate-purple mt-0.5" />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsList;
