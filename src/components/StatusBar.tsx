import {
  useState,
  useEffect,
  useRef,
} from 'react';
import { 
  Autocomplete,
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { PlayArrow, History } from '@mui/icons-material';
import { toLocalDateTimeStr } from '../util/misc';
import { useAppContext, symbols } from '../contexts/AppContext';

export const StatusBar = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [chartInterval, setChartInterval] = useState<string>('1 Minute');

  const {
    assetClass,
    setAssetClass,
    symbol,
    setSymbol,
    timezone,
    timestampRef,
    priceRef,
    replayDate,
    setReplayDate
  } = useAppContext();

  useEffect(() => {
    setReplayDate('');
    setSymbol(symbols[assetClass][0]);
  }, [assetClass]);

  const serverStatus = replayDate ? "Replay" : "Live Data";
  const chipIcon = replayDate ? <History /> : <PlayArrow />;
  const chipColor = replayDate ? "warning" : "success";


  useEffect(() => {
   
    const updateInterval = setInterval(() => {
      if (timestampRef.current) {
        setTimestamp(timestampRef.current);
      }
      if (priceRef.current !== undefined) {
        setPrice(priceRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(updateInterval);
    };

  }, []);

  const tzLabel = timezone.split('/')[1].replace('_', ' ');
  const localTimestamp = toLocalDateTimeStr(timestamp, timezone);

  const gridStyles = {
    padding: 1
  }

  const displayPrice = (price || 0).toFixed(2);

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
            value={assetClass}
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
            options={symbols[assetClass]}
            defaultValue={symbol}
            value={symbol}
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
            defaultValue={chartInterval}
            onChange={(_event, value) => setChartInterval(value!)}
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
            icon={chipIcon}
            color={chipColor}
            sx={{
              color: '#1A2027',
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
            {displayPrice}
          </Typography>
        </Grid>
      
      </Grid>

    </Box>
  );
}