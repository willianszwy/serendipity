import { Entry } from '../types';

/**
 * Get the date from an entry, using date field if available, otherwise createdAt
 */
export const getEntryDate = (entry: Entry): Date => {
  if (entry.date) {
    // For date strings in YYYY-MM-DD format, create date in local timezone
    const [year, month, day] = entry.date.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    console.log(`getEntryDate for entry ${entry.id}: using date field ${entry.date} = ${date.toDateString()}`);
    return date;
  } else {
    const date = new Date(entry.createdAt);
    console.log(`getEntryDate for entry ${entry.id}: using createdAt field = ${date.toDateString()}`);
    return date;
  }
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  const result = date1.getFullYear() === date2.getFullYear() && 
                date1.getMonth() === date2.getMonth() && 
                date1.getDate() === date2.getDate();
  console.log(`isSameDay: ${date1.toDateString()} vs ${date2.toDateString()} = ${result}`);
  return result;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  const result = isSameDay(date, today);
  console.log(`isToday check: ${date.toDateString()} vs ${today.toDateString()} = ${result}`);
  return result;
};

/**
 * Check if a date is in the specified month and year
 */
export const isInMonth = (date: Date, month: number, year: number): boolean => {
  const result = date.getMonth() === month && date.getFullYear() === year;
  console.log(`isInMonth: ${date.toDateString()} (${date.getMonth()}/${date.getFullYear()}) vs target (${month}/${year}) = ${result}`);
  return result;
};

/**
 * Check if a date is in the current month
 */
export const isInCurrentMonth = (date: Date): boolean => {
  const now = new Date();
  const result = isInMonth(date, now.getMonth(), now.getFullYear());
  console.log(`isInCurrentMonth check: ${date.toDateString()} (${date.getMonth()}/${date.getFullYear()}) vs current (${now.getMonth()}/${now.getFullYear()}) = ${result}`);
  return result;
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
 * Get current date in YYYY-MM-DD format for input fields (local timezone)
 */
export const getCurrentDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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