import { useState, useEffect, useCallback } from 'react';
import { Entry, CreateEntryData, UpdateEntryData } from '../types';
import { EntryService, handleAsyncError } from '../services';

export interface UseEntriesReturn {
  // State
  entries: Entry[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addEntry: (data: CreateEntryData) => Promise<Entry | null>;
  updateEntry: (id: number, data: UpdateEntryData) => Promise<Entry | null>;
  deleteEntry: (id: number) => Promise<boolean>;
  deleteAllEntries: () => Promise<boolean>;
  refreshEntries: () => Promise<void>;
  importEntries: (importedEntries: Entry[]) => Promise<boolean>;
  
  // Search and filter
  searchEntries: (searchText: string) => Promise<Entry[]>;
  getEntriesByDateRange: (startDate: Date, endDate: Date) => Promise<Entry[]>;
  
  // Utilities
  clearError: () => void;
  getEntryById: (id: number) => Entry | null;
}

/**
 * Custom hook for managing entries state and operations
 */
export const useEntries = (): UseEntriesReturn => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const errorInfo = handleAsyncError(error);
    setError(errorInfo.userMessage);
    return null;
  }, []);

  /**
   * Load all entries from storage
   */
  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedEntries = await EntryService.getAll();
      setEntries(loadedEntries);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Add a new entry
   */
  const addEntry = useCallback(async (data: CreateEntryData): Promise<Entry | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newEntry = await EntryService.create(data);
      console.log('New entry created:', newEntry);
      
      // Force reload from storage to ensure consistency
      const allEntries = await EntryService.getAll();
      console.log('Force reloaded entries from storage:', allEntries.length);
      setEntries(allEntries);
      
      return newEntry;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Update an existing entry
   */
  const updateEntry = useCallback(async (id: number, data: UpdateEntryData): Promise<Entry | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedEntry = await EntryService.update(id, data);
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
      
      return updatedEntry;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Delete an entry
   */
  const deleteEntry = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await EntryService.delete(id);
      if (success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
      
      return success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Delete all entries
   */
  const deleteAllEntries = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await EntryService.deleteAll();
      if (success) {
        setEntries([]);
      }
      
      return success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Refresh entries from storage
   */
  const refreshEntries = useCallback(async () => {
    await loadEntries();
  }, [loadEntries]);

  /**
   * Search entries by text
   */
  const searchEntries = useCallback(async (searchText: string): Promise<Entry[]> => {
    try {
      setError(null);
      
      if (!searchText.trim()) {
        return entries;
      }
      
      return await EntryService.searchByText(searchText);
    } catch (error) {
      handleError(error);
      return [];
    }
  }, [entries, handleError]);

  /**
   * Get entries by date range
   */
  const getEntriesByDateRange = useCallback(async (startDate: Date, endDate: Date): Promise<Entry[]> => {
    try {
      setError(null);
      return await EntryService.getByDateRange(startDate, endDate);
    } catch (error) {
      handleError(error);
      return [];
    }
  }, [handleError]);

  /**
   * Import entries from backup
   */
  const importEntries = useCallback(async (importedEntries: Entry[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      let importCount = 0;
      let duplicateCount = 0;
      
      for (const entry of importedEntries) {
        // Check if entry already exists (by ID or by content)
        const existingEntry = entries.find(e => 
          e.id === entry.id || 
          (e.category === entry.category && 
           e.description === entry.description && 
           e.date === entry.date)
        );
        
        if (!existingEntry) {
          // Generate new ID to avoid conflicts
          const newEntry = await EntryService.create({
            category: entry.category,
            description: entry.description,
            date: entry.date,
            time: entry.time,
            link1: entry.link1,
            link2: entry.link2,
            link3: entry.link3
          });
          
          if (newEntry) {
            importCount++;
          }
        } else {
          duplicateCount++;
        }
      }
      
      // Reload all entries to reflect changes
      await loadEntries();
      
      // Show import summary
      if (importCount > 0) {
        alert(`Importação concluída!\n${importCount} entradas importadas.\n${duplicateCount > 0 ? `${duplicateCount} entradas duplicadas ignoradas.` : ''}`);
      } else {
        alert('Nenhuma entrada nova foi importada (todas já existem).');
      }
      
      return importCount > 0;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entries, loadEntries, handleError]);

  /**
   * Get entry by ID from current state
   */
  const getEntryById = useCallback((id: number): Entry | null => {
    return entries.find(entry => entry.id === id) || null;
  }, [entries]);

  // Load entries on mount
  useEffect(() => {
    const loadInitialEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadedEntries = await EntryService.getAll();
        console.log('useEntries useEffect: loaded', loadedEntries.length, 'entries from storage');
        setEntries(loadedEntries);
      } catch (error) {
        const errorInfo = handleAsyncError(error);
        setError(errorInfo.userMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialEntries();
  }, []);

  return {
    // State
    entries,
    loading,
    error,
    
    // Actions
    addEntry,
    updateEntry,
    deleteEntry,
    deleteAllEntries,
    refreshEntries,
    importEntries,
    
    // Search and filter
    searchEntries,
    getEntriesByDateRange,
    
    // Utilities
    clearError,
    getEntryById
  };
};