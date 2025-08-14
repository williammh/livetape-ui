import {
  useState,
  useEffect,
  useContext,
  useRef,
  type SetStateAction,
  type MouseEvent
} from 'react'
import { 
  Box,
  Button,
  colors,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { CandlestickChart } from './components/Chart';
import { MessageBox } from './components/Chat';
import { styled } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';
import { Positions } from './components/Positions';
import { Orders } from './components/Orders';
import { ProfitLoss } from './components/ProfitLoss';
import { toLocalDateTimeStr } from './util/misc';
import { CalendarMonth } from '@mui/icons-material';

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
  const now = new Date();

  const startTimeStr = toLocalDateTimeStr(now, 'America/Los_Angeles');
  console.log(startTimeStr);


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
              columns={3}
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
                size={1}
                sx={{
                  textAlign: 'right'
                }}
              >
                <Typography
                  variant='h6'
                  component='span'
                >
                  Crypto: BTC - Bitcoin starting at {startTimeStr}
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
                {/* <Typography
                  variant="h6"
                  sx={{
                    color: colors.green[400]
                  }}
                >
                  Moo
                </Typography> */}
                <ProfitLoss persona='moo' />
                <Positions persona='moo' />
                <Orders persona='moo' />
              </Item>
            </Grid>

            <Grid size={1}>
              <Item>
                {/* <Typography
                  variant="h6"
                  sx={{
                    color: colors.red[400]
                  }}
                >
                  Grizz
                </Typography> */}
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
