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
import { useSharedWebSocket } from '../WebSocketContext';
import { PlayArrow } from '@mui/icons-material';

export const StatusBar = () => {
  const { message } = useSharedWebSocket();
  const [timestamp, setTimeStamp] = useState<string>('');
  const [price, setPrice] = useState();
  const [symbol, setSymbol] = useState<string>('MNQU25');
  const [assetClass, setAssetClass] = useState<string>('Futures');
  const [interval, setInterval] = useState<string>('1 Minute');

  const serverStatus = "Live Data";

  useEffect(() => {
    switch(message.type) {
      case 'open_bar':
        setTimeStamp(message.system_time);
        setPrice(message.data['close']?.toFixed(2));
        break;
    }

  }, [message]);

  const timeZone = 'America/Los_Angeles';
  const options = {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const tzLabel = timeZone.split('/')[1].replace('_', ' ');
  const localTimeStamp = new Date(timestamp).toLocaleString('en-US', options);

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
            options={['Stocks', 'Futures']}
            defaultValue={assetClass}
            onChange={(_event, value) => setAssetClass(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
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
            options={['MESU25', 'MNQU25']}
            defaultValue={symbol}
            onChange={(_event, value) => setSymbol(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
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
            {localTimeStamp} {tzLabel}
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