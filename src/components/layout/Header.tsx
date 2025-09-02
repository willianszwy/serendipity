import React from 'react';
import { COLORS, APP_INFO } from '../../constants';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'compact';
  onDebugRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = APP_INFO.NAME,
  subtitle = APP_INFO.TAGLINE,
  className = '',
  variant = 'default',
  onDebugRefresh
}) => {
  const isCompact = variant === 'compact';

  return (
    <header className={`text-center mb-8 ${className}`}>
      <h1 
        className={`font-bold mb-2 font-borel ${isCompact ? 'text-xl' : 'text-3xl'}`} 
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
      
      {/* Debug button - temporary */}
      {onDebugRefresh && (
        <button
          onClick={onDebugRefresh}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm"
        >
          🔧 Debug Refresh Stats
        </button>
      )}
    </header>
  );
};