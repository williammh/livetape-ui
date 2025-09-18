import { 
  Box,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { Account } from './components//Account';
import { CandlestickChart } from './components/CandleStickChart';
import { MessageBox } from './components/MessageBox';
import { styled } from '@mui/material/styles';
import { StatusBar } from './components/StatusBar';
import { ButtonBar } from './components/ButtonBar';
import { Now } from './components/Now';
import { Schedule } from './components/Schedule';
import "./components/Shared.css";
import { DialogContainer } from './components/DialogContainer';

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
  
  const isPortraitMode = window.outerWidth < window.outerHeight;
  const isFixedWidthMode = false;
  // const isFixedWidthMode = true;

  console.log(`isPostraitMode: ${isPortraitMode}, ${window.outerWidth} * ${window.outerHeight}`);

  return (
    <Box
      sx={{
        width: isFixedWidthMode ? 1920 : window.innerWidth,
        height: isFixedWidthMode ? 1080: window.innerHeight,
        overflow: 'hidden'
      }}
    >
      <DialogContainer />
      <Grid
        container
        direction={'column'}
        spacing={1}
        columns={18}
      >
        {/* app bar */}
        {/* <AppBar /> */}
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
                  // now playing - schedule - email form - padding
                  height: isFixedWidthMode ? 895 : window.innerHeight - 56 - 288 - 56 - 16,
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
