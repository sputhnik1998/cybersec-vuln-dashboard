// Dark mode color palette for cybersecurity dashboard
export const colors = {
  // Primary background colors
  background: {
    primary: '#0a0a0a',      // Main background
    secondary: '#1a1a1a',    // Card backgrounds
    tertiary: '#2a2a2a',     // Elevated surfaces
    hover: '#353535',        // Hover states
  },

  // Text colors
  text: {
    primary: '#fcfcfc',      // Main text
    secondary: '#9b9b9b',    // Secondary text
    tertiary: '#6a6a6a',     // Tertiary text / labels
    disabled: '#535353',     // Disabled text
  },

  // Border colors
  border: {
    default: '#2a2a2a',      // Default borders
    light: '#3a3a3a',        // Light borders
    focus: '#676767',        // Focus state
  },

  // Severity colors (maintain contrast for dark mode)
  severity: {
    critical: '#ef4444',     // Red for critical
    high: '#f97316',         // Orange for high
    medium: '#eab308',       // Yellow for medium
    low: '#22c55e',          // Green for low
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#676767',
  },

  // Chart colors (blue theme)
  chart: {
    primary: '#3b82f6',      // Bright blue
    secondary: '#60a5fa',    // Light blue
    tertiary: '#2563eb',     // Deep blue
    quaternary: '#1d4ed8',   // Dark blue
    quinary: '#1e40af',      // Navy blue
  },

  // Accent colors
  accent: {
    primary: '#3b82f6',      // Primary blue
    secondary: '#60a5fa',    // Light blue
    tertiary: '#2563eb',     // Deep blue
  },
};

export type ColorScheme = typeof colors;
