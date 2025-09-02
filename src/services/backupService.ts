import { Entry } from '../types';

export interface BackupData {
  entries: Entry[];
  exportDate: string;
  version: string;
}

export class BackupService {
  /**
   * Export entries to JSON format
   */
  static exportToJSON(entries: Entry[]): string {
    const backupData: BackupData = {
      entries,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(backupData, null, 2);
  }

  /**
   * Download backup as JSON file
   */
  static downloadBackup(entries: Entry[]): void {
    const jsonData = this.exportToJSON(entries);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `serendipity-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import entries from JSON file
   */
  static importFromJSON(jsonData: string): Entry[] {
    try {
      const data = JSON.parse(jsonData);
      
      // Check if it's our backup format
      if (data.entries && Array.isArray(data.entries)) {
        return this.validateEntries(data.entries);
      }
      
      // If it's just an array of entries
      if (Array.isArray(data)) {
        return this.validateEntries(data);
      }
      
      throw new Error('Formato de backup inválido');
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Arquivo JSON inválido');
      }
      throw error;
    }
  }

  /**
   * Validate and sanitize imported entries
   */
  private static validateEntries(entries: any[]): Entry[] {
    const validEntries: Entry[] = [];
    
    for (const entry of entries) {
      try {
        const validatedEntry = this.validateEntry(entry);
        if (validatedEntry) {
          validEntries.push(validatedEntry);
        }
      } catch (error) {
        console.warn('Entrada inválida ignorada:', entry, error);
      }
    }
    
    return validEntries;
  }

  /**
   * Validate a single entry
   */
  private static validateEntry(entry: any): Entry | null {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    // Required fields
    if (!entry.id || !entry.category || !entry.description || !entry.date) {
      return null;
    }

    // Valid categories
    const validCategories = ['gratidao', 'serendipity', 'manifestacao', 'desejo', 'sonho', 'esp', 'insight', 'medit'];
    if (!validCategories.includes(entry.category)) {
      return null;
    }

    return {
      id: typeof entry.id === 'number' ? entry.id : parseInt(entry.id),
      category: entry.category,
      description: String(entry.description),
      date: String(entry.date),
      time: entry.time ? String(entry.time) : undefined,
      link1: entry.link1 ? String(entry.link1) : undefined,
      link2: entry.link2 ? String(entry.link2) : undefined,
      link3: entry.link3 ? String(entry.link3) : undefined,
      createdAt: entry.createdAt ? String(entry.createdAt) : new Date().toISOString()
    };
  }

  /**
   * Handle file input for import
   */
  static handleFileImport(): Promise<Entry[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('Nenhum arquivo selecionado'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = e.target?.result as string;
            const entries = this.importFromJSON(jsonData);
            resolve(entries);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Erro ao ler o arquivo'));
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    });
  }
}