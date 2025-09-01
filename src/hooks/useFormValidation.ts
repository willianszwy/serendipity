import { useState, useCallback, useMemo } from 'react';
import { CreateEntryData, UpdateEntryData } from '../types';
import { validateEntryData } from '../utils';

export interface UseFormValidationReturn {
  errors: Record<string, string>;
  isValid: boolean;
  validate: (data: CreateEntryData | UpdateEntryData) => boolean;
  clearErrors: () => void;
  clearError: (field: string) => void;
  setError: (field: string, message: string) => void;
}

/**
 * Custom hook for form validation with real-time error tracking
 */
export const useFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Check if form is valid (no errors)
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Validate form data and set errors
   */
  const validate = useCallback((data: CreateEntryData | UpdateEntryData): boolean => {
    // Convert UpdateEntryData to CreateEntryData for validation
    const validationData: CreateEntryData = {
      category: data.category || 'gratidao',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time,
      link1: data.link1,
      link2: data.link2,
      link3: data.link3
    };

    const validation = validateEntryData(validationData);
    
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        // Map error messages to field names
        if (error.includes('Categoria')) {
          newErrors.category = error;
        } else if (error.includes('Descrição')) {
          newErrors.description = error;
        } else if (error.includes('Data')) {
          newErrors.date = error;
        } else if (error.includes('hora')) {
          newErrors.time = error;
        } else if (error.includes('Link 1')) {
          newErrors.link1 = error;
        } else if (error.includes('Link 2')) {
          newErrors.link2 = error;
        } else if (error.includes('Link 3')) {
          newErrors.link3 = error;
        } else {
          newErrors.general = error;
        }
      });
      
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for specific field
   */
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Set error for specific field
   */
  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    clearError,
    setError
  };
};