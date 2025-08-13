import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppProvider } from './contexts/AppContext';
import { BarProvider } from './contexts/BarContext';
import { CommentProvider } from './contexts/CommentContext';

export const Providers = (props) => {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });
  
  return (
    <AppProvider>
      <BarProvider>
        <CommentProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </CommentProvider>
      </BarProvider>
    </AppProvider>
  )
}

