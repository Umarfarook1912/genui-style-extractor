/**
 * GenUI Theme - Global color palette and styling constants
 * A modern, vibrant theme for a style extraction and code generation tool
 */

export const theme = {
  // Primary brand colors - Teal/Cyan gradient
  colors: {
    primary: {
      main: '#06b6d4',
      dark: '#0891b2',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      light: '#22d3ee',
    },
    // Accent colors
    accent: {
      purple: '#9b59b6',
      blue: '#3498db',
      green: '#2ecc71',
      orange: '#e67e22',
      red: '#e74c3c',
    },
    // Neutral colors
    neutral: {
      white: '#ffffff',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',
      black: '#000000',
    },
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Text colors
    text: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#ffffff',
    },

    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },

    // Border colors
    border: {
      light: '#f3f4f6',
      main: '#e5e7eb',
      dark: '#d1d5db',
    },
  },

  // Spacing system (in px)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 10px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 20px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 30px rgba(0, 0, 0, 0.2)',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      mono: "'Courier New', Courier, monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },

  // Z-index layers
  zIndex: {
    base: 1,
    dropdown: 100,
    sticky: 200,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
  },
} as const;

// Type export for TypeScript
export type Theme = typeof theme;
