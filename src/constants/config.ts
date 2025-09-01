// Application configuration constants
export const CONFIG = {
  // LocalStorage keys
  STORAGE_KEYS: {
    ENTRIES: 'serendipity-entries'
  },
  
  // Validation limits
  VALIDATION: {
    DESCRIPTION_MAX_LENGTH: 600,
    MAX_LINKS: 3
  },
  
  // UI Configuration
  UI: {
    // Modal z-index
    MODAL_Z_INDEX: 50,
    
    // Floating button z-index  
    FLOATING_BUTTON_Z_INDEX: 50,
    
    // Form grid breakpoints
    MOBILE_COLUMNS: 2,
    DESKTOP_COLUMNS: 5,
    CATEGORY_GRID_COLUMNS: 3,
    
    // Animation durations
    TRANSITION_DURATION: '200ms',
    
    // Maximum viewport height for modals
    MODAL_MAX_HEIGHT: '90vh'
  },
  
  // Default values
  DEFAULTS: {
    FONT_FAMILY: 'Raleway, sans-serif',
    DATE_FORMAT: 'pt-BR',
    TIME_FORMAT: '24h'
  },
  
  // Feature flags
  FEATURES: {
    OFFLINE_MODE: false,
    EXPORT_DATA: false,
    DARK_MODE: false
  }
} as const;

// App metadata
export const APP_INFO = {
  NAME: 'Serendipity',
  TAGLINE: 'Se você procurar pela magia, acabará encontrando',
  VERSION: '1.0.0'
} as const;