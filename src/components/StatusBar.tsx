import {
  useState,
  useEffect,
} from 'react';
import { 
  Autocomplete,
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useBarContext } from '../contexts/BarContext';
import { PlayArrow } from '@mui/icons-material';
import { toLocalTime } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

export const StatusBar = () => {
  const { message } = useBarContext();
  const [timestamp, setTimeStamp] = useState<string>('');
  const [price, setPrice] = useState();
  const [interval, setInterval] = useState<string>('1 Minute');

  const { assetClass, setAssetClass } = useAppContext();
  const { symbol, setSymbol } = useAppContext();
  const { timezone } = useAppContext();

  console.log(assetClass, symbol);

  const symbols = {
    'Stocks': ['NVDA', 'TLSA'],
    'Crypto': ['BTC', 'ETH'],
    'Futures': ['MESU25', 'MNQU25']
  };

  useEffect(() => {
    setSymbol(symbols[assetClass][0]);

  }, [assetClass]);



  const serverStatus = "Live Data";

  useEffect(() => {
    switch(message.type) {
      case 'open_bar':
        setTimeStamp(message.system_time);
        setPrice(message.data['close']?.toFixed(2));
        break;
    }

  }, [message]);

  const tzLabel = timezone.split('/')[1].replace('_', ' ');
  const localTimestamp = toLocalTime(timestamp, timezone);

  const gridStyles = {
    padding: 1
  }

  return (
    <Box>
      <Grid
        container
        columns={2}
        direction='row'
      >
        <Grid
          container
          size={1}
          direction='row'
          justifyContent='flex-start'
          alignItems='center'
        >
          <Autocomplete 
            options={Object.keys(symbols)}
            defaultValue={assetClass}
            onChange={(_event, value) => setAssetClass(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                // value={assetClass}
                label="Asset Class"
                size="small"
              />
            )}
            sx={{
              width: 160,
              ...gridStyles
            }}
            disableClearable={true}
          />
          <Autocomplete 
            options={symbols[assetClass]}
            defaultValue={symbol}
            onChange={(_event, value) => setSymbol(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                // value={symbol}
                label="Symbol"
                size="small"
              />
            )}
            sx={{
              width: 160,
              ...gridStyles

            }}
            disableClearable={true}
          />
          <Autocomplete 
            options={['1 Minute', '5 Minute']}
            defaultValue={interval}
            onChange={(_event, value) => setInterval(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Interval"
                size="small"
              />
            )}
            sx={{
              width: 160,
              ...gridStyles
            }}
            disableClearable={true}
          />
        </Grid>
        <Grid
          container
          size={1}
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
        >
          <Chip
            label={serverStatus}
            icon={<PlayArrow />}
            color="success"
            sx={{
              color: '#fff',
              fontWeight: 600,
            }}
          />
          <Typography
            variant='h6'
            align='right'
            sx={{
              ...gridStyles
            }}
          >
            {localTimestamp} {tzLabel}
          </Typography>
          <Typography
            variant='h6'
            align='right'
            sx={{
              ...gridStyles
            }}
          >
            {price}
          </Typography>
        </Grid>
      
      </Grid>

    </Box>
  );
}