import { createTheme } from '@mui/material/styles'

// Premium dark glassmorphic theme for a carbon-emission dashboard
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0e17', // deep navy
      paper: 'rgba(255,255,255,0.03)', // subtle glass
    },
    primary: {
      main: '#00d4ff' // neon cyan
    },
    secondary: {
      main: '#ff6bcb' // pink
    },
    orangeAccent: '#ff6200',
    text: {
      primary: 'rgba(230,247,255,0.96)',
      secondary: 'rgba(168,179,198,0.9)'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.06 },
    h3: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 },
    h5: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.12 },
    h6: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.14 },
    button: { fontWeight: 600 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0e17',
          backgroundImage: 'radial-gradient(ellipse at 20% 10%, rgba(0,212,255,0.03), transparent 10%), radial-gradient(ellipse at 80% 90%, rgba(255,107,203,0.02), transparent 8%)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          padding: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'transform 200ms ease, box-shadow 240ms ease, border-color 200ms ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 22px 64px rgba(0, 212, 255, 0.18), 0 0 48px rgba(0, 212, 255, 0.12)',
            borderColor: 'rgba(0,212,255,0.22)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: 20,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '10px 22px',
          transition: 'transform 160ms ease, box-shadow 160ms ease',
          '&.MuiButton-containedPrimary': {
            backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #0078d4 100%)',
            color: '#021018',
            boxShadow: '0 10px 30px rgba(0,212,255,0.12)'
          },
          '&.MuiButton-containedPrimary:hover': {
            transform: 'scale(1.04)',
            boxShadow: '0 18px 56px rgba(0,212,255,0.22), 0 0 56px rgba(0,212,255,0.12)'
          },
          '&:hover': {
            // fallback for other variants
            backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #0078d4 100%)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'rgba(230,247,255,0.96)'
        }
      }
    }
  }
})

export default theme
