import { useEffect, useState } from 'react';
import { 
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { CandlestickChart } from './components/Chart';
import { MessageBox } from './components/MessageBox';
import { styled } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';
import { Positions } from './components/Positions';
import { Orders } from './components/Orders';
import { ProfitLoss } from './components/ProfitLoss';
import { toLocalDateTimeStr } from './util/misc';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { useAppContext, serverAddress } from './contexts/AppContext';
import { addToDate } from './util/misc';
import { EmailForm } from './components/EmailForm';

const Item = styled(Paper)(({ theme }) => ({
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
  
  const cpiTime = addToDate(now, {hours: 2, minutes: 30});
  const cpiTimeStr = toLocalDateTimeStr(cpiTime, timezone);
  const announcement1 = `${cpiTimeStr}: Consumer Price Index report`;
  
  const tradeTslaTime = addToDate(now, {days: 1});
  const tradeTslaTimeStr = toLocalDateTimeStr(tradeTslaTime, timezone);
  const announcement2 = `${tradeTslaTimeStr}: Moo and Grizz trade TSLA`;
  
  const announcement = `Moo shoots for the moon and Grizz puts Elon on blast trading TSLA at ${tradeTslaTimeStr}`;

  const scheduleItems = [
    {
      'timestamp': cpiTimeStr,
      'text': ' BTCUSD - Bitcoin.'
    },
   {
      'timestamp': tradeTslaTimeStr,
      'text': ' TSLA - Tesla, Inc.'
    },
  ];

  const [serverStatus, setServerStatus] = useState<boolean>(false);

  useEffect(() => {
    const getServerStatus = (async () => {
      const res = await fetch(`http://${serverAddress}/`);
      const resJson = await res.json();
      if (resJson) {
        setServerStatus(true);
      }
    })();
  }, []);

  
  const chipProps: { label: string; icon: React.ReactNode; color: string } = {
    label: '',
    icon: null,
    color: ''
  }
  
  if (serverStatus) {
    chipProps.label = 'Server Online'
    chipProps.icon = <CheckCircle />
    chipProps.color = "success" 
  } else {
    chipProps.label = 'Server Offline'
    chipProps.icon = <Cancel />
    chipProps.color = "default" 
  }
  
  return (
    <Box>
      <Grid
        container
        spacing={1}
        columns={18}
        sx={{ width: 1920, height: 1080 }}
      >
        <Grid size={18}>
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
                >
                  LiveTape.ai
                </Typography>
              </Grid>
              <Grid
                size={2}
              >
                <Typography
                  variant='h6'
                  component='span'
                >
                  {announcement}
                </Typography>
            
              </Grid>
              <Grid
                size={1}
                sx={{
                  textAlign: 'right'
                }}
              >
                <Chip
                  {...chipProps}
                  variant="outlined"
                />
              </Grid>
             
            </Grid>
          </Item>
        </Grid>

        <Grid
          container
          direction='column'
          size={6}
        >
          <Item>

            <Grid
              container
              direction='column'
            >

              {
                scheduleItems.map((item) => {
                  return (
                    <Grid
                      container
                      direction='row'
                      columns={2}
                      sx={{
                        height: 24
                      }}
                    >
                      <Grid
                        size={1}
                        sx={{
                          textAlign: 'right',
                        }}
                      >
                        <Typography
                          variant='body1'

                        >

                          {item.timestamp}:
                        </Typography>
                      </Grid>
                      <Grid
                        size={1}
                        sx={{
                          textAlign: 'left',
                        }}
                      >
                        <Typography
                          variant='body1'
                        >
                          {item.text}
                        </Typography>
                      </Grid>
                      
                    </Grid>
                  )
                })
              }  
            </Grid>
            <Grid
              flexGrow={6}
              sx={{
                height: 895,
                paddingTop: 1,
                paddingBottom: 1
              }}
            >
              <MessageBox />
            </Grid>
            <Grid>
              <EmailForm />
            </Grid>
          </Item>
        </Grid>

        <Grid
          container
          direction='column'
          columns={2}
          size={12}
        >
          <Grid
            size={2}
            flexGrow={2}
          >
            <Item
              sx={{
                height: '100%'
              }}
            >
              <StatusBar />
              <CandlestickChart />
            </Item>
          </Grid>
          <Grid
            container
            direction='row'
            size={2}
          >
            <Grid size={1}>
              <Item>
                <ProfitLoss persona='moo' />
                <Positions persona='moo' />
                <Orders persona='moo' />
              </Item>
            </Grid>

            <Grid size={1}>
              <Item>
                <ProfitLoss persona='grizz' />
                <Positions persona='grizz' />
                <Orders persona='grizz' />
              </Item>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  )
}

export default App
