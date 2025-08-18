import { 
  Box,
  Button,
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
import { CalendarMonth } from '@mui/icons-material';
import { useAppContext } from './contexts/AppContext';
import { addToDate } from './util/misc';

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
  const tomorrow = addToDate(now, {days: 1});
  const startTimeStr = toLocalDateTimeStr(tomorrow, timezone);
  const announcement = `Moo shoots for the moon and Grizz puts Elon on blast trading TSLA at ${startTimeStr}`;

  return (
    <Box>
      <Grid
        container
        spacing={1}
        columns={18}
        sx={{ width: 1920, height: 1080 }}
      >
        <Grid size={18}>
          <Item sx={{height: 96}}>
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
                <Button
                  variant="outlined"
                  color="#fff"
                  endIcon={<CalendarMonth />}
                >
                  Schedule
                </Button>
              </Grid>
             
            </Grid>
          </Item>
        </Grid>

        <Grid size={6}>
          <Item sx={{height: 976}}>
            <MessageBox />
          </Item>
        </Grid>

        <Grid
          container
          direction='row'
          columns={2}
          size={12}
        >
          <Grid
            size={1}
            flexGrow={2}
          >
            <Item>
              <StatusBar />
              <CandlestickChart />
            </Item>
          </Grid>
          <Grid
            container
            size={11}
            columns={2}
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
