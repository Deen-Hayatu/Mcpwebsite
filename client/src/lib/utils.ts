import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function generateRandomColor() {
  // Generate Ghana-themed colors (red, yellow, green, black)
  const colors = [
    'bg-red-600 text-white',    // Red
    'bg-yellow-500 text-black', // Yellow
    'bg-green-600 text-white',  // Green
    'bg-black text-white',      // Black
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}