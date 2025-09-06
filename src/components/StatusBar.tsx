import {
  useState,
  useEffect,
  useRef,
} from 'react';
import { 
  Autocomplete,
  Box,
  Chip,
  colors,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { PlayArrow, History, CalendarMonth } from '@mui/icons-material';
import { getTzLabel, toLocalDateTimeStr } from '../util/misc';
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
    setSymbol(symbols[assetClass].includes(symbol) ? symbol : symbols[assetClass][0]);
  }, [assetClass]);

  const chipProps: { label: string; icon: React.ReactNode; color: string } = {
    label: '',
    icon: null,
    color: ''
  }

  if (replayDate) {
    chipProps.label = 'Replay';
    chipProps.icon = <CalendarMonth />;
    chipProps.color = "default" ;
  } else if (assetClass === 'Stocks') {
    chipProps.label = 'Delayed';
    chipProps.icon = <History />;
    chipProps.color = "warning" ;
  } else {
    chipProps.label = 'Live';
    chipProps.icon = <PlayArrow />;
    chipProps.color = "success" ;
  }

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

  const tzLabel = getTzLabel(timezone);
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
        size={2}
        direction='row'
      >
        <Grid
          container
          size={1}
          direction='row'
          justifyContent='flex-start'
          alignItems='center'
          wrap='nowrap'
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
                color="default"
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
                color="default"
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
                color="default"
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
          wrap='no-wrap'
        >
          <Chip
            variant='outlined'
            {...chipProps}
            sx={{
              color: chipProps.color,
              fontWeight: 600,
            }}
          />
          <Typography
            variant='h6'
            align='right'
            noWrap={true}
            sx={{
              ...gridStyles,
              
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