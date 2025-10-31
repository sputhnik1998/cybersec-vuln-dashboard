// Typography scale with hierarchical font sizes
export const typography = {
  // Font families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font sizes - hierarchical scale
  fontSize: {
    // Display - Large headings
    display: {
      large: '3rem',      // 48px - Dashboard title
      medium: '2.5rem',   // 40px
      small: '2rem',      // 32px
    },

    // Headings - Section titles
    heading: {
      h1: '2rem',         // 32px - Main sections
      h2: '1.5rem',       // 24px - Subsections
      h3: '1.25rem',      // 20px - Card titles
      h4: '1.125rem',     // 18px - Minor headings
    },

    // Body text
    body: {
      large: '1rem',      // 16px - Primary content
      medium: '0.875rem', // 14px - Secondary content
      small: '0.75rem',   // 12px - Captions, labels
    },

    // Specialized
    metric: {
      large: '2.5rem',    // 40px - Large metric values
      medium: '2rem',     // 32px - Medium metrics
      small: '1.5rem',    // 24px - Small metrics
    },

    button: '0.875rem',   // 14px - Button text
    caption: '0.75rem',   // 12px - Captions, helper text
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

export type TypographyScheme = typeof typography;
