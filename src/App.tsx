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
            LiveTape.ai
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

          <Grid
            container
            columns={2}
            sx={{ height: 380 }}
          >
            <Grid size={1}>
              <Item sx={{height: '100%'}}>
                {/* <Typography variant="h6">Moo</Typography> */}
                <ProfitLoss persona='moo' />
                <Positions persona='moo' />
                <Orders persona='moo' />
              </Item>
            </Grid>

            <Grid size={1}>
              <Item sx={{height: '100%'}}>
                {/* <Typography variant="h6">Grizz</Typography> */}
                <ProfitLoss persona='grizz' />
                <Positions persona='grizz' />
                <Orders persona='grizz' />
              </Item>
            </Grid>
          </Grid>
          
          <Grid flexGrow={1}>
            <Item sx={{height: '100%'}}>
              <StatusBar />
              <CandlestickChart />
            </Item>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  )
}

export default App
