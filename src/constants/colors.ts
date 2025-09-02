// Theme colors used throughout the application
export const COLORS = {
  // Main background color
  background: '#F5E6FA',
  
  // Primary text color
  primaryText: '#290E56',
  
  // Card backgrounds
  monthlyCard: '#F1c3dd', 
  yearlyCard: '#eda0bf',
  
  // Light text on dark backgrounds
  lightText: '#F5E6FA',
  
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
  '--serendipity-monthly-card': COLORS.monthlyCard,
  '--serendipity-yearly-card': COLORS.yearlyCard,
  '--serendipity-light-text': COLORS.lightText
} as const;