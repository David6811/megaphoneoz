import { createTheme } from '@mui/material/styles';

// Custom brand colors to match existing design
const brandColors = {
  red: '#c60800',
  redDark: '#a00600',
  gray: '#333333',
  white: '#ffffff',
  black: '#000000',
};

// Declare custom palette extensions
declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      red: string;
      redDark: string;
      gray: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      red?: string;
      redDark?: string;
      gray?: string;
    };
  }
}

// Create Material 3 theme with custom colors and Tailwind-compatible values
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.red,
      dark: brandColors.redDark,
      contrastText: brandColors.white,
    },
    secondary: {
      main: brandColors.gray,
      contrastText: brandColors.white,
    },
    background: {
      default: brandColors.white,
      paper: brandColors.white,
    },
    text: {
      primary: brandColors.gray,
      secondary: brandColors.gray,
    },
    // Custom brand palette for consistency
    brand: {
      red: brandColors.red,
      redDark: brandColors.redDark,
      gray: brandColors.gray,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.white,
          color: brandColors.gray,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '60px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: brandColors.red,
          '&:hover': {
            backgroundColor: brandColors.redDark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;