import { createTheme } from '@mui/material/styles';

export let theme = createTheme({
  palette: {
    primary: {
      main: '#80512a',
      light: '#FBEACB',
    },
    secondary: {
      main: '#1f4d37'
    },
    background: {
      default: '#FFF9EB'
    }
  },
    typography: {
      fontFamily: [
        '"Google Sans Flex"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '1.5em',
        fontWeight: '300',
        color: '#000004'
      },
      body1: {
        fontSize: '14px',
        fontWeight: 'normal',
      }
    }
});

theme = createTheme(theme, {
  typography: {
    body1: {
      color: theme.palette.secondary.main
    }
  },
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.light
        }
      } 
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: "20px",
          ...theme.unstable_sx({
            px: 2
          })
        }
      }
    }
  }
});