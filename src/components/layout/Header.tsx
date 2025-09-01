import React from 'react';
import { COLORS, APP_INFO } from '../../constants';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export const Header: React.FC<HeaderProps> = ({
  title = APP_INFO.NAME,
  subtitle = APP_INFO.TAGLINE,
  className = '',
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';

  return (
    <header className={`text-center mb-8 ${className}`}>
      <h1 
        className={`font-bold mb-2 ${isCompact ? 'text-2xl' : 'text-4xl'}`} 
        style={{ 
          color: COLORS.primaryText,
          fontFamily: 'Amatic SC, cursive'
        }}
      >
        {title}
      </h1>
      
      {subtitle && (
        <p 
          className={`opacity-80 ${isCompact ? 'text-base' : 'text-lg'}`} 
          style={{ color: COLORS.primaryText }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
};