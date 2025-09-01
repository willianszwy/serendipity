import { Entry, CreateEntryData, UpdateEntryData } from '../types';
import { validateEntryData, sanitizeDescription, sanitizeUrl } from '../utils';
import { StorageService } from './storageService';

export class EntryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'EntryError';
  }
}

/**
 * Service for managing entries with CRUD operations
 */
export class EntryService {
  /**
   * Get all entries from storage
   */
  static async getAll(): Promise<Entry[]> {
    try {
      const entries = StorageService.getEntries() as Entry[];
      return entries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new EntryError('Failed to load entries', 'LOAD_ERROR', error);
    }
  }

  /**
   * Get entry by ID
   */
  static async getById(id: number): Promise<Entry | null> {
    try {
      const entries = await this.getAll();
      return entries.find(entry => entry.id === id) || null;
    } catch (error) {
      throw new EntryError('Failed to find entry', 'FIND_ERROR', error);
    }
  }

  /**
   * Create a new entry
   */
  static async create(data: CreateEntryData): Promise<Entry> {
    // Validate input data
    const validation = validateEntryData(data);
    if (!validation.isValid) {
      throw new EntryError(
        'Dados inválidos',
        'VALIDATION_ERROR',
        validation.errors
      );
    }

    try {
      const entries = await this.getAll();
      
      // Sanitize data
      const sanitizedData = {
        ...data,
        description: sanitizeDescription(data.description),
        link1: data.link1 ? sanitizeUrl(data.link1) : undefined,
        link2: data.link2 ? sanitizeUrl(data.link2) : undefined,
        link3: data.link3 ? sanitizeUrl(data.link3) : undefined
      };

      // Create new entry
      const newEntry: Entry = {
        id: Date.now(), // Simple ID generation - in production, use a proper UUID
        ...sanitizedData,
        createdAt: new Date().toISOString()
      };

      // Save to storage
      const updatedEntries = [newEntry, ...entries];
      const saved = StorageService.setEntries(updatedEntries);
      
      if (!saved) {
        throw new EntryError('Failed to save entry', 'SAVE_ERROR');
      }

      return newEntry;
    } catch (error) {
      if (error instanceof EntryError) throw error;
      throw new EntryError('Failed to create entry', 'CREATE_ERROR', error);
    }
  }

  /**
   * Update an existing entry
   */
  static async update(id: number, data: UpdateEntryData): Promise<Entry> {
    try {
      const entries = await this.getAll();
      const entryIndex = entries.findIndex(entry => entry.id === id);
      
      if (entryIndex === -1) {
        throw new EntryError('Entry not found', 'NOT_FOUND');
      }

      const existingEntry = entries[entryIndex];
      
      // Merge and validate the updated data
      const mergedData: CreateEntryData = {
        category: data.category ?? existingEntry.category,
        description: data.description ?? existingEntry.description,
        date: data.date ?? existingEntry.date,
        time: data.time ?? existingEntry.time,
        link1: data.link1 ?? existingEntry.link1,
        link2: data.link2 ?? existingEntry.link2,
        link3: data.link3 ?? existingEntry.link3
      };

      const validation = validateEntryData(mergedData);
      if (!validation.isValid) {
        throw new EntryError(
          'Dados inválidos',
          'VALIDATION_ERROR',
          validation.errors
        );
      }

      // Sanitize updated data
      const sanitizedData = {
        ...mergedData,
        description: sanitizeDescription(mergedData.description),
        link1: mergedData.link1 ? sanitizeUrl(mergedData.link1) : undefined,
        link2: mergedData.link2 ? sanitizeUrl(mergedData.link2) : undefined,
        link3: mergedData.link3 ? sanitizeUrl(mergedData.link3) : undefined
      };

      // Update entry
      const updatedEntry: Entry = {
        ...existingEntry,
        ...sanitizedData
      };

      entries[entryIndex] = updatedEntry;
      
      // Save to storage
      const saved = StorageService.setEntries(entries);
      
      if (!saved) {
        throw new EntryError('Failed to save updated entry', 'SAVE_ERROR');
      }

      return updatedEntry;
    } catch (error) {
      if (error instanceof EntryError) throw error;
      throw new EntryError('Failed to update entry', 'UPDATE_ERROR', error);
    }
  }

  /**
   * Delete an entry
   */
  static async delete(id: number): Promise<boolean> {
    try {
      const entries = await this.getAll();
      const entryIndex = entries.findIndex(entry => entry.id === id);
      
      if (entryIndex === -1) {
        throw new EntryError('Entry not found', 'NOT_FOUND');
      }

      // Remove entry
      entries.splice(entryIndex, 1);
      
      // Save to storage
      const saved = StorageService.setEntries(entries);
      
      if (!saved) {
        throw new EntryError('Failed to delete entry', 'SAVE_ERROR');
      }

      return true;
    } catch (error) {
      if (error instanceof EntryError) throw error;
      throw new EntryError('Failed to delete entry', 'DELETE_ERROR', error);
    }
  }

  /**
   * Delete all entries (with confirmation)
   */
  static async deleteAll(): Promise<boolean> {
    try {
      const saved = StorageService.setEntries([]);
      
      if (!saved) {
        throw new EntryError('Failed to clear all entries', 'SAVE_ERROR');
      }

      return true;
    } catch (error) {
      throw new EntryError('Failed to clear all entries', 'CLEAR_ERROR', error);
    }
  }

  /**
   * Get entries by date range
   */
  static async getByDateRange(startDate: Date, endDate: Date): Promise<Entry[]> {
    try {
      const entries = await this.getAll();
      
      return entries.filter(entry => {
        const entryDate = entry.date ? new Date(entry.date) : new Date(entry.createdAt);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      throw new EntryError('Failed to get entries by date range', 'FILTER_ERROR', error);
    }
  }

  /**
   * Search entries by text
   */
  static async searchByText(searchText: string): Promise<Entry[]> {
    try {
      const entries = await this.getAll();
      const lowerSearchText = searchText.toLowerCase();
      
      return entries.filter(entry => 
        entry.description.toLowerCase().includes(lowerSearchText)
      );
    } catch (error) {
      throw new EntryError('Failed to search entries', 'SEARCH_ERROR', error);
    }
  }

  /**
   * Get storage statistics
   */
  static getStorageInfo() {
    return StorageService.getStorageInfo();
  }
}