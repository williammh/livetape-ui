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
  
  useEffect(() => {
    (async (): Promise<void> => {
			setBars(await getBars());
		})();
	}, []);
  
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
        sx={{ width: 1920 }}
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
                Moo
              </Item>
            </Grid>

            <Grid size={1}>
              <Item sx={{height: '100%'}}>
                Grizz
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
