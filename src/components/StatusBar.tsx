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
        setTimeStamp(message.data['current_datetime']);
        setPrice(message.data['close'].toFixed(2));
        console.log(message.data['current_datetime']);
        break;
    }

  }, [message]);

  console.log(timestamp);

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


  return (
    <Box>
      <Grid
        container
        columns={8}
        direction='row'
      >
        <Grid
          size={1}
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
              padding: 1
            }}
            disableClearable={true}
          />
        </Grid>
        <Grid
          size={1}
        >
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
              padding: 1

            }}
            disableClearable={true}
          />
        </Grid>
        <Grid
          size={1}
        >
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
              padding: 1

            }}
            disableClearable={true}
          />
        </Grid>
        <Grid size={1}>
          <Chip
            label={serverStatus}
            icon={<PlayArrow />}
            color="success"
          />
        </Grid>
        <Grid
          size={3}
        >
          <Typography
            variant='h6'
            align='right'
            sx={{
              fontWeight: '600'
            }}
          >
           {localTimeStamp} {tzLabel}
          </Typography>
        </Grid>
        <Grid
          size={1}
        >
          <Typography
            variant='h6'
            align='right'
            sx={{
              fontWeight: '600'
            }}
          >
           {price}
          </Typography>
        </Grid>
      </Grid>

    </Box>
  );
}