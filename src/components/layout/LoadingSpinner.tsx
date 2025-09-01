import React from 'react';
import { COLORS } from '../../constants';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = COLORS.pink[500],
  className = '',
  fullScreen = false,
  message = 'Carregando...'
}) => {
  const getSizeClasses = () => {
    const sizes = {
      small: 'h-6 w-6',
      medium: 'h-12 w-12',
      large: 'h-16 w-16'
    };
    return sizes[size];
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 ${getSizeClasses()} ${className}`} 
         style={{ borderColor: color }} />
  );

  const content = (
    <div className="text-center">
      {spinner}
      {message && (
        <p className="mt-4 text-sm" style={{ color: COLORS.primaryText }}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        {content}
      </div>
    );
  }

  return content;
};