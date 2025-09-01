import { Entry } from '../types';

/**
 * Get the date from an entry, using date field if available, otherwise createdAt
 */
export const getEntryDate = (entry: Entry): Date => {
  return entry.date ? new Date(entry.date) : new Date(entry.createdAt);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if a date is in the specified month and year
 */
export const isInMonth = (date: Date, month: number, year: number): boolean => {
  return date.getMonth() === month && date.getFullYear() === year;
};

/**
 * Check if a date is in the current month
 */
export const isInCurrentMonth = (date: Date): boolean => {
  const now = new Date();
  return isInMonth(date, now.getMonth(), now.getFullYear());
};

/**
 * Check if a date is in the current year
 */
export const isInCurrentYear = (date: Date): boolean => {
  return date.getFullYear() === new Date().getFullYear();
};

/**
 * Get entries for today
 */
export const getTodayEntries = (entries: Entry[]): Entry[] => {
  return entries.filter(entry => isToday(getEntryDate(entry)));
};

/**
 * Get entries for current month
 */
export const getCurrentMonthEntries = (entries: Entry[]): Entry[] => {
  return entries.filter(entry => isInCurrentMonth(getEntryDate(entry)));
};

/**
 * Get entries for a specific month and year
 */
export const getMonthEntries = (entries: Entry[], month: number, year: number): Entry[] => {
  return entries.filter(entry => {
    const entryDate = getEntryDate(entry);
    return isInMonth(entryDate, month, year);
  });
};

/**
 * Get entries for current year
 */
export const getCurrentYearEntries = (entries: Entry[]): Entry[] => {
  return entries.filter(entry => isInCurrentYear(getEntryDate(entry)));
};

/**
 * Sort entries by date (newest first)
 */
export const sortEntriesByDate = (entries: Entry[], ascending = false): Entry[] => {
  return [...entries].sort((a, b) => {
    const dateA = getEntryDate(a);
    const dateB = getEntryDate(b);
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};

/**
 * Group entries by date
 */
export const groupEntriesByDate = (entries: Entry[]): Record<string, Entry[]> => {
  const grouped: Record<string, Entry[]> = {};
  
  entries.forEach(entry => {
    const entryDate = getEntryDate(entry);
    const dateKey = entryDate.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(entry);
  });
  
  return grouped;
};

/**
 * Get current date in YYYY-MM-DD format for input fields
 */
export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Format date for display in Portuguese
 */
export const formatDatePT = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  
  return date.toLocaleDateString('pt-BR', options || defaultOptions);
};

/**
 * Format date for display (short version)
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};