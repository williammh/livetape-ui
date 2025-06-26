import {
  useState,
  useEffect,
  useContext,
  type SetStateAction,
  type MouseEvent
} from 'react'
import { 
  Box,
  Grid,
  Paper,
} from '@mui/material'
import { BarsContext, getBars } from './Context';
import { CandlestickChart } from './components/Chart';
import { Chat } from './components/Chat';

import { styled } from '@mui/material/styles';

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
  const [assetClass, setAssetClass] = useState('Futures');
  const { bars, setBars } = useContext(BarsContext);
  const [isUpdatingBars, setIsUpdatingBars] = useState(false);
  
  const updateBars = () => {
    (async (): Promise<void> => {
			setBars(await getBars());
		})();
  }

  useEffect(() => {
    updateBars();
	}, []);
  
  useEffect(() => {
		const seconds = 1;
		const milliseconds = seconds * 1000
		const minuteTimer = setInterval(() => {
      const now = new Date();
      const nowStr = now.toISOString().slice(0, 19) + 'Z';
      const lastBarDatetimeStr = bars[bars.length - 1]?.TimeStamp;
      
      const lastBarCloseDatetime = new Date(lastBarDatetimeStr);
      const lastBarCloseUTC = new Date(
        Date.UTC(
          lastBarCloseDatetime.getFullYear(),
          lastBarCloseDatetime.getMonth(),
          lastBarCloseDatetime.getDate(),
          lastBarCloseDatetime.getUTCHours(),
          lastBarCloseDatetime.getMinutes(),
          lastBarCloseDatetime.getSeconds(),
        )
      )

      const currBarCloseUTC = new Date(
        Date.UTC(
          lastBarCloseUTC.getFullYear(),
          lastBarCloseUTC.getMonth(),
          lastBarCloseUTC.getDate(),
          lastBarCloseUTC.getUTCHours(),
          lastBarCloseUTC.getMinutes() + 1,
          lastBarCloseUTC.getSeconds(),
        )
      )

      console.log(lastBarCloseDatetime.toUTCString());
      console.log(now.toUTCString());
      console.log(currBarCloseUTC.toUTCString());
      console.log("      ");

      if (currBarCloseUTC <= now && !isUpdatingBars) {
        console.log(`Start updating bars at ${nowStr}`);
        setIsUpdatingBars(true);
        updateBars();
      } else if (currBarCloseUTC > now && isUpdatingBars) {
        console.log(`Done updating bars at ${nowStr}`);
        setIsUpdatingBars(false);
      } else if (isUpdatingBars) {
        console.log(`Still updating bars at ${nowStr}`);
      }

		}, milliseconds);
	
		return () => {
		  clearInterval(minuteTimer);
		}

  }, [bars, isUpdatingBars]);
	
  
  const handleChangeAssetClass = (
    event: MouseEvent<HTMLElement>,
    assetClass: SetStateAction<string>,
  ) => {
    console.log(event);
    setAssetClass(assetClass);
  };

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
              <CandlestickChart  bardata={bars} />
            </Item>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  )
}

export default App
