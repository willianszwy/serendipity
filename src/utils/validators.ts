import { CategoryId, CreateEntryData } from '../types';

/**
 * Validate if a string is a valid category ID
 */
export const isValidCategory = (category: string): category is CategoryId => {
  const validCategories: CategoryId[] = ['gratidao', 'serendipity', 'manifestacao', 'desejo', 'sonho'];
  return validCategories.includes(category as CategoryId);
};

/**
 * Validate if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};

/**
 * Validate if a time string is valid (HH:MM format)
 */
export const isValidTime = (timeString: string): boolean => {
  if (!timeString) return true; // Empty time is valid (optional field)
  
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

/**
 * Validate if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty URLs are valid (optional field)
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate entry data before saving
 */
export const validateEntryData = (data: CreateEntryData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required field validation
  if (!data.category) {
    errors.push('Categoria é obrigatória');
  } else if (!isValidCategory(data.category)) {
    errors.push('Categoria inválida');
  }
  
  if (!data.description?.trim()) {
    errors.push('Descrição é obrigatória');
  } else if (data.description.length > 600) {
    errors.push('Descrição deve ter no máximo 600 caracteres');
  }
  
  if (!data.date) {
    errors.push('Data é obrigatória');
  } else if (!isValidDate(data.date)) {
    errors.push('Data inválida');
  }
  
  // Optional field validation
  if (data.time && !isValidTime(data.time)) {
    errors.push('Formato de hora inválido (use HH:MM)');
  }
  
  // URL validation
  [data.link1, data.link2, data.link3].forEach((link, index) => {
    if (link && !isValidUrl(link)) {
      errors.push(`Link ${index + 1} tem formato inválido`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize entry description (remove extra whitespace, etc.)
 */
export const sanitizeDescription = (description: string): string => {
  return description.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize URL (add protocol if missing)
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  // Add https:// if no protocol specified
  if (trimmedUrl && !trimmedUrl.match(/^https?:\/\//)) {
    return `https://${trimmedUrl}`;
  }
  
  return trimmedUrl;
};