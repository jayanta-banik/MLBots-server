import { alpha, createTheme } from '@mui/material/styles';

const FOREST_GREEN = '#1e3a2f';
const SOFT_CREAM = '#f7f4ec';
const DARK_NAVY = '#17253d';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: FOREST_GREEN,
      dark: '#152820',
      light: '#476455',
    },
    secondary: {
      main: DARK_NAVY,
      dark: '#0f1828',
      light: '#39506f',
    },
    background: {
      default: SOFT_CREAM,
      paper: alpha('#fffdf8', 0.86),
    },
    text: {
      primary: '#1d2520',
      secondary: '#56615a',
    },
    divider: alpha(FOREST_GREEN, 0.12),
    success: {
      main: '#2d6a4f',
    },
    warning: {
      main: '#8f6841',
    },
    error: {
      main: '#8a3e36',
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 600,
      letterSpacing: '-0.04em',
      lineHeight: 0.98,
    },
    h2: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 600,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    overline: {
      letterSpacing: '0.22em',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          background: [
            `radial-gradient(circle at top left, ${alpha(DARK_NAVY, 0.14)}, transparent 28%)`,
            `radial-gradient(circle at right center, ${alpha(FOREST_GREEN, 0.18)}, transparent 32%)`,
            `linear-gradient(180deg, #faf7f0 0%, ${SOFT_CREAM} 100%)`,
          ].join(','),
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(FOREST_GREEN, 0.12)}`,
          boxShadow: `0 24px 60px ${alpha(DARK_NAVY, 0.1)}`,
          backdropFilter: 'blur(18px)',
          backgroundImage: `linear-gradient(180deg, ${alpha('#ffffff', 0.68)}, ${alpha('#f9f6ee', 0.92)})`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        root: {
          backgroundColor: alpha(DARK_NAVY, 0.08),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha(DARK_NAVY, 0.94),
          color: '#f8f6ef',
          borderRadius: 12,
          padding: '0.7rem 0.9rem',
        },
      },
    },
  },
});

export default theme;