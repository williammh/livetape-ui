import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BarWebSocketProvider } from './contexts/WebSocketContext';

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
    <BarWebSocketProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </BarWebSocketProvider>
  )
}

