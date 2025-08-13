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
  colors,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { CandlestickChart } from './components/Chart';
import { Chat } from './components/Chat';
import { styled } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';
import { Positions } from './components/Positions';
import { Orders } from './components/Orders';
import { ProfitLoss } from './components/ProfitLoss';
import { toLocalTime } from './util/misc';

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
  // const tomorrow = new Date(

  // );
  // console.log(tomorrow);

  const startTimeStr = toLocalTime(now, 'America/Los_Angeles');
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
              columns={2}
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
              >
                <Typography
                  variant='h5'
                  component='span'
                >
                  BTC - Bitcoin starting at {startTimeStr}
                </Typography>
              </Grid>
             
            </Grid>
          </Item>
        </Grid>

        <Grid size={6}>
          <Item sx={{height: 1080 - 96}}>
            <Chat />
          </Item>
        </Grid>

        <Grid
          container
          size={12}
          direction='column'
        >
          <Grid flexGrow={1}>
            <Item sx={{height: '100%'}}>
              <StatusBar />
              <CandlestickChart />
            </Item>
          </Grid>
          <Grid
            container
            columns={2}
            sx={{ height: 380 }}
          >
            <Grid size={1}>
              <Item sx={{height: '100%'}}>
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
              <Item sx={{height: '100%'}}>
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
