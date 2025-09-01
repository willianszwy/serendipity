import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { COLORS } from '../../constants';

export interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  fullScreen?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onGoHome,
  fullScreen = false,
  variant = 'default',
  className = ''
}) => {
  const isCompact = variant === 'compact';

  const content = (
    <div className={`text-center ${className}`}>
      {/* Error Icon */}
      <div className="mb-4">
        <div 
          className={`mx-auto rounded-full flex items-center justify-center ${
            isCompact ? 'w-12 h-12' : 'w-16 h-16'
          }`}
          style={{ backgroundColor: `${COLORS.pink[500]}20` }}
        >
          <AlertCircle 
            className={`text-red-500 ${isCompact ? 'w-6 h-6' : 'w-8 h-8'}`} 
          />
        </div>
      </div>

      {/* Error Message */}
      <h3 
        className={`font-semibold mb-2 ${isCompact ? 'text-lg' : 'text-xl'}`} 
        style={{ color: COLORS.primaryText }}
      >
        Oops! Algo deu errado
      </h3>
      
      <p 
        className={`mb-6 opacity-80 ${isCompact ? 'text-sm' : 'text-base'}`} 
        style={{ color: COLORS.primaryText }}
      >
        {error}
      </p>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${isCompact ? 'justify-center' : 'justify-center'}`}>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`
              flex items-center gap-2 
              bg-pink-500 text-white 
              rounded-lg 
              hover:bg-pink-600 
              transition-colors
              ${isCompact ? 'py-2 px-4 text-sm' : 'py-3 px-6'}
            `}
          >
            <RefreshCw className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} />
            Tentar Novamente
          </button>
        )}

        {onGoHome && (
          <button
            onClick={onGoHome}
            className={`
              flex items-center gap-2 
              border border-gray-300 
              rounded-lg 
              hover:bg-gray-50 
              transition-colors
              ${isCompact ? 'py-2 px-4 text-sm' : 'py-3 px-6'}
            `}
            style={{ color: COLORS.primaryText }}
          >
            <Home className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} />
            Início
          </button>
        )}

        {!onRetry && !onGoHome && (
          <button
            onClick={() => window.location.reload()}
            className={`
              flex items-center gap-2 
              bg-pink-500 text-white 
              rounded-lg 
              hover:bg-pink-600 
              transition-colors
              ${isCompact ? 'py-2 px-4 text-sm' : 'py-3 px-6'}
            `}
          >
            <RefreshCw className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} />
            Recarregar Página
          </button>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {content}
    </div>
  );
};