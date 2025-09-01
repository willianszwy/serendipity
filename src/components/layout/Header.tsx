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
        className={`font-bold mb-2 font-borel ${isCompact ? 'text-4xl' : 'text-8xl'}`} 
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
    </header>
  );
};