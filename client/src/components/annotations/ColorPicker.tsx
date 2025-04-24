import React from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  colors: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  colors 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`
            h-8 w-8 rounded-full flex items-center justify-center
            border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${value === color ? 'ring-2 ring-offset-2 ring-primary' : ''}
          `}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
        >
          {value === color && (
            <Check 
              className="h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" 
            />
          )}
        </button>
      ))}
    </div>
  );
};