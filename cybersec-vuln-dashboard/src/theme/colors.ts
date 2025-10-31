// Dark mode color palette for cybersecurity dashboard
export const colors = {
  // Primary background colors
  background: {
    primary: '#0a0e27',      // Main background
    secondary: '#141932',    // Card backgrounds
    tertiary: '#1a1f3a',     // Elevated surfaces
    hover: '#1f2542',        // Hover states
  },

  // Text colors
  text: {
    primary: '#e2e8f0',      // Main text
    secondary: '#94a3b8',    // Secondary text
    tertiary: '#64748b',     // Tertiary text / labels
    disabled: '#475569',     // Disabled text
  },

  // Border colors
  border: {
    default: '#1e293b',      // Default borders
    light: '#334155',        // Light borders
    focus: '#3b82f6',        // Focus state
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
    info: '#3b82f6',
  },

  // Chart colors (colorblind-friendly)
  chart: {
    primary: '#3b82f6',      // Blue
    secondary: '#8b5cf6',    // Purple
    tertiary: '#06b6d4',     // Cyan
    quaternary: '#10b981',   // Green
    quinary: '#f59e0b',      // Amber
  },

  // Accent colors
  accent: {
    primary: '#3b82f6',      // Primary blue
    secondary: '#8b5cf6',    // Purple
    tertiary: '#06b6d4',     // Cyan
  },
};

export type ColorScheme = typeof colors;
