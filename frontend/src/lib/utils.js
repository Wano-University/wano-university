import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getImageUrl = (path) => {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${cleanApi}/${cleanPath}`;
};
