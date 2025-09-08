import { useEffect, useState } from 'react';
import { 
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  colors,
} from '@mui/material'
import { Account } from './components//Account';
import { CandlestickChart } from './components/Chart';
import { MessageBox } from './components/MessageBox';
import { styled, type SxProps } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';
import { toLocalDateTimeStr } from './util/misc';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { useAppContext, serverAddress } from './contexts/AppContext';
import { addToDate } from './util/misc';
import { ButtonBar } from './components/ButtonBar';
import { Now } from './components/Now';
import { Schedule } from './components/Schedule';

import "./components/Shared.css";

export const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const App = () => { 
  const { timezone } = useAppContext();
  const now = new Date();

  now.setHours(13);
  now.setMinutes(30);
  now.setSeconds(0);
  
  
  const tradeTslaTime = addToDate(now, {days: 1});
  const tradeTslaTimeStr = toLocalDateTimeStr(tradeTslaTime, timezone);
  
  const announcement = `Moo shoots for the moon and Grizz puts Elon on blast trading TSLA at ${tradeTslaTimeStr}`;

  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);

  useEffect(() => {
    const pingIntervalSeconds = 5;

    const fetchTimeout = async (url: string, timeout: number) => {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, timeout * 1000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
      } finally {
        clearTimeout(id);
      }
    };
    
    const getServerStatus = async () => {
      try {
        const res = await fetchTimeout(`http://${serverAddress}/`, pingIntervalSeconds);
        const resJson = await res.json();
        if (resJson === true) {
          setIsServerOnline(true);
        } else {
          setIsServerOnline(false);
        }
      } catch (error) {
        console.log(error);
        setIsServerOnline(false);
      }
    };
    
   
    const pingServer = setInterval(async () => {
      await getServerStatus();
    }, pingIntervalSeconds * 1000);

    return () => {
      clearInterval(pingServer);
    };

  }, [isServerOnline]);

  
  const chipProps: {
    variant: string,
    label: string,
    icon: React.ReactNode,
    color: string,
    sx?: SxProps,

  } = {
    variant: 'outlined',
    label: '',
    icon: null,
    color: '',
    sx: {
      fontSize: 18,
    },
  }
  
  if (isServerOnline) {
    chipProps.label = 'Server'
    chipProps.icon = <CheckCircle />
    chipProps.color = "success"
    chipProps.sx = {
      ...chipProps.sx,
      color: colors.green[400]
    }
  } else {
    chipProps.label = 'Server'
    chipProps.icon = <Cancel />
    chipProps.color = colors.grey[600]
    chipProps.sx = {
      ...chipProps.sx,
      color: colors.grey[600]
    }
  }

  const isPortraitMode = window.outerWidth < window.outerHeight;
  const isFixedWidthMode = false;
  // const isFixedWidthMode = true;

  console.log(`isPostraitMode: ${isPortraitMode}, ${window.outerWidth} * ${window.outerHeight}`);
  
  return (
    <Box
      sx={{
        width: isFixedWidthMode ? 1920 : window.innerWidth,
        height: isFixedWidthMode ? 1080: window.innerHeight,
      }}
    >
      <Grid
        container
        direction={'column'}
        spacing={1}
        columns={18}
      >
        {/* app bar */}
        <Grid
          size={18}
        >
          <Item sx={{height: '100%'}}>
            <Grid
              container
              columns={4}
              alignItems='center'
              sx={{
                  height: '100%'
              }}
            >
              <Grid
                size={1}
                sx={{
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant='h3'
                  component='span'
                  sx={{
                    fontFamily: 'MontserratCustom',
                    paddingLeft: 1,
                  }}
                >
                  LiveTape.ai
                </Typography>
              </Grid>
              <Grid
                size={2}
              >
                <Typography
                  variant='h6'
                  noWrap={true}
                >
                  {announcement}
                </Typography>
            
              </Grid>
              <Grid
                size={1}
                sx={{
                  textAlign: 'right',
                }}
              >
                <Chip
                  {...chipProps}
                />
              </Grid>
             
            </Grid>
          </Item>
        </Grid>

        {/* main content under app bar */}
        <Grid
          container
          direction='row'
          size={18}
        >
          {/* left 1/3 */}
          <Grid
            container
            direction='column'
            size={6}
            overflow='hidden'
          >
            <Item
              sx={{
                width: '100%'
              }}
            >
              <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent={'center'}
              >
                <Now />
              </Grid>
              <Grid
                sx={{
                  // app bar - now playing - schedule - email form - padding
                  height: isFixedWidthMode ? 895 : window.innerHeight - 72 - 56 - 288 - 56 - 24,
                  paddingTop: 1,
                  paddingBottom: 1
                }}
              >
                <MessageBox />
              </Grid>
              <Grid>
                <Schedule />
              </Grid>
              <Grid
                sx={{
                  height: 56
                }}
              >
                <ButtonBar />
              </Grid>

            </Item>  
          </Grid>


          {/* right 2/3 */}
          <Grid
            container
            direction='column'
            columns={2}
            size={12}
          >
            {/* status bar and chart */}
            <Grid
              columns={1}
              size={2}
              flexgrow={0}
            >
              <Item>
                <StatusBar />
                <CandlestickChart />
              </Item>
            </Grid>

            <Grid
              container
              direction='row'
              size={2}
              flexGrow={1}
            >
              <Grid size={1}>
                <Account persona='moo' />  
              </Grid>
              <Grid size={1}>
                <Account persona='grizz' />  
              </Grid>
            </Grid>
          </Grid>

        </Grid>

      </Grid>
    </Box>
  )
}

export default App
