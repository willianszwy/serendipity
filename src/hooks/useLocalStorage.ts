import { useState, useCallback, useEffect, useRef } from 'react';
import { StorageService, ErrorService } from '../services';

export interface UseLocalStorageReturn<T> {
  // State
  value: T;
  loading: boolean;
  error: string | null;
  
  // Actions
  setValue: (value: T | ((prevValue: T) => T)) => Promise<boolean>;
  resetValue: () => Promise<boolean>;
  clearError: () => void;
  
  // Utilities
  isAvailable: boolean;
  storageInfo: ReturnType<typeof StorageService.getStorageInfo>;
}

/**
 * Custom hook for managing localStorage with error handling and type safety
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options?: {
    syncAcrossTabs?: boolean;
    validateValue?: (value: unknown) => value is T;
  }
): UseLocalStorageReturn<T> => {
  const { syncAcrossTabs = false, validateValue } = options || {};
  
  const [value, setValueState] = useState<T>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialValueRef = useRef(initialValue);
  
  // Check if localStorage is available
  const isAvailable = StorageService.getStorageInfo().available;
  
  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle errors consistently
   */
  const handleError = useCallback((error: unknown) => {
    const errorInfo = ErrorService.handle(error);
    setError(errorInfo.userMessage);
    return false;
  }, []);

  /**
   * Load value from storage
   */
  const loadValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedValue = StorageService.get(key, initialValueRef.current);
      
      // Validate the stored value if validator provided
      if (validateValue && !validateValue(storedValue)) {
        console.warn(`Invalid value in localStorage for key "${key}", using initial value`);
        setValueState(initialValueRef.current);
        return;
      }
      
      setValueState(storedValue);
    } catch (error) {
      handleError(error);
      setValueState(initialValueRef.current);
    } finally {
      setLoading(false);
    }
  }, [key, validateValue, handleError]);

  /**
   * Set value in storage
   */
  const setValue = useCallback(async (
    newValue: T | ((prevValue: T) => T)
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prevValue: T) => T)(value)
        : newValue;
      
      // Validate the new value if validator provided
      if (validateValue && !validateValue(valueToStore)) {
        throw new Error(`Invalid value provided for key "${key}"`);
      }
      
      const success = StorageService.set(key, valueToStore);
      
      if (success) {
        setValueState(valueToStore);
      }
      
      return success;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [key, value, validateValue, handleError]);

  /**
   * Reset value to initial value
   */
  const resetValue = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = StorageService.set(key, initialValueRef.current);
      
      if (success) {
        setValueState(initialValueRef.current);
      }
      
      return success;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [key, handleError]);

  /**
   * Handle storage events (for cross-tab synchronization)
   */
  useEffect(() => {
    if (!syncAcrossTabs || !isAvailable) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          
          // Validate the new value if validator provided
          if (validateValue && !validateValue(newValue)) {
            console.warn(`Invalid value received from storage event for key "${key}"`);
            return;
          }
          
          setValueState(newValue);
        } catch (error) {
          console.error(`Failed to parse storage event value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, syncAcrossTabs, validateValue, isAvailable]);

  /**
   * Load initial value on mount
   */
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  /**
   * Get storage info
   */
  const storageInfo = StorageService.getStorageInfo();

  return {
    // State
    value,
    loading,
    error,
    
    // Actions
    setValue,
    resetValue,
    clearError,
    
    // Utilities
    isAvailable,
    storageInfo
  };
};

/**
 * Specialized hook for entries storage
 */
export const useEntriesStorage = () => {
  return useLocalStorage(
    'serendipity-entries', 
    [],
    {
      syncAcrossTabs: true,
      validateValue: (value): value is unknown[] => Array.isArray(value)
    }
  );
};

/**
 * Hook for managing app settings in localStorage
 */
export const useAppSettings = <T extends Record<string, unknown>>(
  initialSettings: T
) => {
  return useLocalStorage(
    'serendipity-settings',
    initialSettings,
    {
      syncAcrossTabs: true,
      validateValue: (value): value is T => {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      }
    }
  );
};