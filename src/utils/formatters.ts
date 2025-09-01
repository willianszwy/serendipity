/**
 * Format text with character limit display
 */
export const formatCharacterCount = (text: string, maxLength: number): string => {
  return `${text.length}/${maxLength} caracteres`;
};

/**
 * Truncate text if it exceeds maximum length
 */
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format URL for display (remove protocol and truncate)
 */
export const formatUrl = (url: string, maxLength = 30): string => {
  try {
    const urlObj = new URL(url);
    const displayUrl = urlObj.hostname + urlObj.pathname;
    return truncateText(displayUrl, maxLength);
  } catch {
    return truncateText(url, maxLength);
  }
};

/**
 * Validate URL format for display purposes
 */
export const isValidUrlFormat = (url: string): boolean => {
  if (!url) return true; // Empty URLs are valid (optional field)
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format time for display
 */
export const formatTime = (time: string): string => {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return time;
  }
};