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
} from '@mui/material'
import { CandlestickChart } from './components/Chart';
import { Chat } from './components/Chat';

import { styled } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';

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
        <Grid size={1}>
          <Item sx={{height: '100%'}}>
            Iconbar
          </Item>
        </Grid>

        <Grid size={5}>
          <Item sx={{height: 1080}}>
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
            sx={{ height: 216 }}
          >

            <Grid size={1}>
              <Item sx={{height: '100%'}}>
                Moo Open Orders and Positions
              </Item>
            </Grid>

            <Grid size={1}>
              <Item sx={{height: '100%'}}>
                Grizz Open Orders and Positions
              </Item>
            </Grid>

          </Grid>
          
          <Grid flexGrow={1}>
            <Item sx={{height: '100%'}}>
              {/* <StatusBar /> */}
              <CandlestickChart />
            </Item>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  )
}

export default App
