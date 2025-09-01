// Theme colors used throughout the application
export const COLORS = {
  // Main background color
  background: '#e8dfe0',
  
  // Primary text color
  primaryText: '#52473d',
  
  // Card backgrounds
  dailyCard: '#8a9ea7',
  monthlyCard: '#8d9b6a', 
  yearlyCard: '#e9c770',
  
  // Light text on dark backgrounds
  lightText: '#e8dfe0',
  
  // Accent colors
  pink: {
    500: '#ec4899',
    600: '#db2777',
    50: '#fdf2f8'
  },
  
  // Component colors
  white: '#ffffff',
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    500: '#6b7280'
  }
} as const;

// CSS custom properties for consistent theming
export const CSS_VARIABLES = {
  '--serendipity-bg': COLORS.background,
  '--serendipity-primary-text': COLORS.primaryText,
  '--serendipity-daily-card': COLORS.dailyCard,
  '--serendipity-monthly-card': COLORS.monthlyCard,
  '--serendipity-yearly-card': COLORS.yearlyCard,
  '--serendipity-light-text': COLORS.lightText
} as const;