import React from 'react';
import { Plus, X } from 'lucide-react';
import { CONFIG } from '../../constants';

export interface FloatingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'add' | 'close';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  title?: string;
  'aria-label'?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'add',
  position = 'bottom-right',
  size = 'medium',
  className = '',
  title,
  'aria-label': ariaLabel
}) => {
  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6', 
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    };
    return positions[position];
  };

  const getSizeClasses = () => {
    const sizes = {
      small: 'p-3',
      medium: 'p-4',
      large: 'p-5'
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const iconSizes = {
      small: 'w-4 h-4',
      medium: 'w-6 h-6', 
      large: 'w-8 h-8'
    };
    return iconSizes[size];
  };

  const getIcon = () => {
    if (loading) {
      return (
        <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${getIconSize()}`} />
      );
    }
    
    return variant === 'add' 
      ? <Plus className={getIconSize()} />
      : <X className={getIconSize()} />;
  };

  const getColors = () => {
    if (disabled || loading) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    
    return variant === 'add'
      ? 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'
      : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800';
  };

  const defaultTitle = variant === 'add' 
    ? 'Adicionar novo acontecimento'
    : 'Fechar';

  const defaultAriaLabel = variant === 'add'
    ? 'Adicionar novo acontecimento'
    : 'Fechar';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        fixed 
        ${getPositionClasses()} 
        ${getSizeClasses()} 
        ${getColors()}
        text-white 
        rounded-full 
        shadow-lg 
        transition-all 
        duration-200 
        transform 
        hover:scale-105 
        active:scale-95 
        focus:outline-none 
        focus:ring-4 
        focus:ring-pink-300 
        disabled:transform-none 
        disabled:shadow-md
        ${className}
      `}
      style={{ zIndex: CONFIG.UI.FLOATING_BUTTON_Z_INDEX }}
      title={title || defaultTitle}
      aria-label={ariaLabel || defaultAriaLabel}
    >
      {getIcon()}
    </button>
  );
};