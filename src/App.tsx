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
      now.setSeconds(0);
      const nowStrTopMinute = now.toISOString();
      const nowRfc3339 = nowStrTopMinute.slice(0, nowStrTopMinute.indexOf('.')) + 'Z';
      const lastBarDatetime = bars[bars.length - 1].TimeStamp;
      
      console.log(nowStr, lastBarDatetime, isUpdatingBars);
      // console.log(lastBarDatetime); 
      // console.log(isUpdatingBars);

      if (nowRfc3339 >= lastBarDatetime && !isUpdatingBars) {
        console.log(`updating bars at ${nowRfc3339}`);
        setIsUpdatingBars(true);
        updateBars();
      } else if (nowStr < lastBarDatetime && isUpdatingBars) {
        console.log("Done updating bars!");
        setIsUpdatingBars(false);
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
