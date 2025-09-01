/**
 * Custom error types for different parts of the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' = 'medium',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 'medium', { field, value });
    this.name = 'ValidationError';
  }
}

export class StorageError extends AppError {
  constructor(
    message: string,
    public operation: 'read' | 'write' | 'delete' | 'clear',
    public key?: string
  ) {
    super(message, 'STORAGE_ERROR', 'high', { operation, key });
    this.name = 'StorageError';
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message, 'NETWORK_ERROR', 'medium', { statusCode, endpoint });
    this.name = 'NetworkError';
  }
}

/**
 * Error handling service for centralized error management
 */
export class ErrorService {
  private static errorQueue: AppError[] = [];
  private static maxQueueSize = 50;

  /**
   * Log error for debugging and monitoring
   */
  private static logError(error: AppError): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      code: error.code,
      severity: error.severity,
      context: error.context,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.name} (${error.severity})`);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      if (error.context) {
        console.error('Context:', error.context);
      }
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      // sendErrorToService(errorInfo);
      console.error('Production error:', errorInfo);
    }

    // Store in local queue for debugging
    this.errorQueue.push(error);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  /**
   * Handle different types of errors with appropriate user messages
   */
  static handle(error: unknown): {
    userMessage: string;
    shouldRetry: boolean;
    severity: 'low' | 'medium' | 'high';
  } {
    let appError: AppError;

    // Convert unknown error to AppError
    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new AppError(error.message, 'UNKNOWN_ERROR', 'medium', {
        originalError: error.name,
        stack: error.stack
      });
    } else {
      appError = new AppError('Um erro inesperado ocorreu', 'UNKNOWN_ERROR', 'medium', {
        originalError: String(error)
      });
    }

    // Log the error
    this.logError(appError);

    // Return user-friendly information based on error type
    return this.getErrorResponse(appError);
  }

  /**
   * Get user-friendly error response
   */
  private static getErrorResponse(error: AppError): {
    userMessage: string;
    shouldRetry: boolean;
    severity: 'low' | 'medium' | 'high';
  } {
    const errorMap: Record<string, { message: string; shouldRetry: boolean }> = {
      // Validation errors
      VALIDATION_ERROR: {
        message: 'Por favor, verifique os dados inseridos e tente novamente.',
        shouldRetry: false
      },

      // Storage errors
      STORAGE_ERROR: {
        message: 'Erro ao salvar dados. Verifique se há espaço disponível no navegador.',
        shouldRetry: true
      },

      // Entry errors
      LOAD_ERROR: {
        message: 'Não foi possível carregar os dados. Tente atualizar a página.',
        shouldRetry: true
      },
      
      SAVE_ERROR: {
        message: 'Não foi possível salvar. Tente novamente.',
        shouldRetry: true
      },
      
      CREATE_ERROR: {
        message: 'Erro ao criar novo acontecimento. Tente novamente.',
        shouldRetry: true
      },
      
      UPDATE_ERROR: {
        message: 'Erro ao atualizar acontecimento. Tente novamente.',
        shouldRetry: true
      },
      
      DELETE_ERROR: {
        message: 'Erro ao excluir acontecimento. Tente novamente.',
        shouldRetry: true
      },
      
      NOT_FOUND: {
        message: 'Acontecimento não encontrado.',
        shouldRetry: false
      },

      // Network errors
      NETWORK_ERROR: {
        message: 'Problema de conexão. Verifique sua internet e tente novamente.',
        shouldRetry: true
      },

      // Generic errors
      UNKNOWN_ERROR: {
        message: 'Algo deu errado. Por favor, tente novamente.',
        shouldRetry: true
      }
    };

    const errorResponse = errorMap[error.code] || errorMap.UNKNOWN_ERROR;

    return {
      userMessage: errorResponse.message,
      shouldRetry: errorResponse.shouldRetry,
      severity: error.severity
    };
  }

  /**
   * Create specific error types
   */
  static createValidationError(field: string, message: string, value?: unknown): ValidationError {
    return new ValidationError(message, field, value);
  }

  static createStorageError(operation: 'read' | 'write' | 'delete' | 'clear', message: string, key?: string): StorageError {
    return new StorageError(message, operation, key);
  }

  static createNetworkError(message: string, statusCode?: number, endpoint?: string): NetworkError {
    return new NetworkError(message, statusCode, endpoint);
  }

  /**
   * Get recent errors for debugging
   */
  static getRecentErrors(limit = 10): AppError[] {
    return this.errorQueue.slice(-limit);
  }

  /**
   * Clear error queue
   */
  static clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: AppError): boolean {
    const recoverableErrors = [
      'STORAGE_ERROR',
      'NETWORK_ERROR', 
      'LOAD_ERROR',
      'SAVE_ERROR'
    ];
    
    return recoverableErrors.includes(error.code);
  }

  /**
   * Get error statistics
   */
  static getErrorStats() {
    const errorCounts = this.errorQueue.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityCounts = this.errorQueue.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorQueue.length,
      byCode: errorCounts,
      bySeverity: severityCounts,
      recent: this.errorQueue.slice(-5)
    };
  }
}

/**
 * React Error Boundary component (to be used in React components)
 */
export const handleAsyncError = (error: unknown, fallback?: () => void) => {
  const errorInfo = ErrorService.handle(error);
  
  // You can customize this based on your UI framework
  console.error('Async error handled:', errorInfo);
  
  if (fallback) {
    fallback();
  }
  
  return errorInfo;
};