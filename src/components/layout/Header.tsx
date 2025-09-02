import React from 'react';
import { Download, Upload } from 'lucide-react';
import { COLORS, APP_INFO } from '../../constants';
import { Entry } from '../../types';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'compact';
  entries?: Entry[];
  onImport?: (entries: Entry[]) => void;
  showBackupButtons?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = APP_INFO.NAME,
  subtitle = APP_INFO.TAGLINE,
  className = '',
  variant = 'default',
  entries = [],
  onImport,
  showBackupButtons = false
}) => {
  const isCompact = variant === 'compact';

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
    <header className={`text-center mb-8 ${className}`}>
      <div className="relative">
        <h1 
          className={`font-bold mb-2 font-borel ${isCompact ? 'text-xl' : 'text-5xl'}`} 
          style={{ color: COLORS.primaryText }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p 
            className={`opacity-80 font-borel ${isCompact ? 'text-lg' : 'text-xl'}`} 
            style={{ color: COLORS.primaryText }}
          >
            {subtitle}
          </p>
        )}

        {showBackupButtons && !isCompact && (
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors backdrop-blur-sm"
              title="Exportar backup"
              aria-label="Exportar backup"
            >
              <Download className="w-5 h-5" style={{ color: COLORS.primaryText }} />
            </button>
            <button
              onClick={handleImport}
              className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors backdrop-blur-sm"
              title="Importar backup"
              aria-label="Importar backup"
            >
              <Upload className="w-5 h-5" style={{ color: COLORS.primaryText }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};