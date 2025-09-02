import React from 'react';
import { Download, Upload } from 'lucide-react';
import { COLORS } from '../../constants';
import { Entry } from '../../types';

export interface FooterProps {
  entries?: Entry[];
  onImport?: (entries: Entry[]) => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  entries = [],
  onImport,
  className = ''
}) => {
  const handleExport = async () => {
    try {
      const { BackupService } = await import('../../services');
      BackupService.downloadBackup(entries);
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      alert('Erro ao exportar backup. Tente novamente.');
    }
  };

  const handleImport = async () => {
    try {
      const { BackupService } = await import('../../services');
      const importedEntries = await BackupService.handleFileImport();
      
      if (onImport && importedEntries.length > 0) {
        onImport(importedEntries);
      } else if (importedEntries.length === 0) {
        alert('Nenhuma entrada válida encontrada no arquivo.');
      }
    } catch (error: any) {
      console.error('Erro ao importar backup:', error);
      alert(error.message || 'Erro ao importar backup. Verifique o arquivo e tente novamente.');
    }
  };

  return (
    <footer className={`mt-8 pt-6 border-t ${className}`} style={{ borderColor: `${COLORS.primaryText}20` }}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors backdrop-blur-sm font-borel"
          style={{ color: COLORS.primaryText }}
        >
          <Download className="w-5 h-5" />
          <span>Exportar Backup</span>
        </button>
        
        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors backdrop-blur-sm font-borel"
          style={{ color: COLORS.primaryText }}
        >
          <Upload className="w-5 h-5" />
          <span>Importar Backup</span>
        </button>
      </div>
    </footer>
  );
};