import React from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

// Define Ghana-themed color palette
const COLORS = [
  { name: "Red", value: "#dc2626" },      // Ghanaian red
  { name: "Yellow", value: "#facc15" },   // Ghanaian yellow
  { name: "Green", value: "#16a34a" },    // Ghanaian green
  { name: "Black", value: "#000000" },    // For the black star
  { name: "Blue", value: "#2563eb" },     // Additional highlight color
  { name: "Purple", value: "#9333ea" },   // Additional highlight color
  { name: "Pink", value: "#ec4899" },     // Additional highlight color
  { name: "Orange", value: "#f97316" },   // Additional highlight color
  { name: "Teal", value: "#14b8a6" },     // Additional highlight color
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onColorChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {COLORS.map(color => (
        <button
          key={color.value}
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          style={{ backgroundColor: color.value }}
          onClick={() => onColorChange(color.value)}
          title={color.name}
          aria-label={`Select ${color.name} color`}
        >
          {selectedColor === color.value && (
            <Check 
              className="w-4 h-4 text-white" 
              strokeWidth={3}
              style={{ 
                filter: ['#facc15', '#14b8a6'].includes(color.value) 
                  ? 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' 
                  : undefined 
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;