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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { PlayArrow, History, CalendarMonth } from '@mui/icons-material';
import { getTzLabel, toLocalDateTimeStr } from '../util/misc';
import { useAppContext, symbols } from '../contexts/AppContext';
import { ServerStatus } from './ServerStatus';

export const StatusBar = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [chartInterval, setChartInterval] = useState<string>('1 Minute');

  const {
    assetClass,
    setAssetClass,
    symbol,
    setSymbol,
    timezone,
    setTimezone,
    timestampRef,
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
    }, 1000);

    return () => {
      clearInterval(updateInterval);
    };

  }, []);

  const localTimestamp = toLocalDateTimeStr(timestamp, timezone);

  const gridStyles = {
    // padding: 0
    marginRight: 1,
  }

  const disabledAssetClasses = ['Crypto', 'Forex'];
  const disabledSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'AMD', 'META', 'BRK.B', 'JNJ'];
  const disabledIntervals = ['5 Minute'];

  return (
    <Box>
      <Grid
        container
        columns={2}
        size={2}
        direction='row'
        alignItems={'center'}
        wrap='no-wrap'
      >
        <Grid
          container
          direction='row'
          size={1}
          flexGrow={1}
          justifyContent='flex-start'
          alignItems='center'
          wrap='nowrap'
          sx={{
            height: 56,
          }}
        >
          <Autocomplete 
            options={Object.keys(symbols)}
            getOptionDisabled={(option) =>
              disabledAssetClasses.includes(option)
            }
            defaultValue={assetClass}
            value={assetClass}
            onChange={(_event, value) => setAssetClass(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                color="default"
              />
            )}
            sx={{
              ...gridStyles,
              width: 140,
              padding: 0
            }}
            disableClearable={true}
          />
          <Autocomplete 
            options={symbols[assetClass]}
            getOptionDisabled={(option) =>
              disabledSymbols.includes(option)
            }
            defaultValue={symbol}
            value={symbol}
            onChange={(_event, value) => setSymbol(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                color="default"
              />
            )}
            sx={{
              ...gridStyles,
              width: 140,
            }}
            disableClearable={true}
          />
          <Autocomplete 
            options={['1 Minute', '5 Minute']}
            getOptionDisabled={(option) =>
              disabledIntervals.includes(option)
            }
            defaultValue={chartInterval}
            onChange={(_event, value) => setChartInterval(value!)}
            renderInput={(params) => (
              <TextField
                {...params}
                color="default"
              />
            )}
            sx={{
              ...gridStyles,
              width: 140,
            }}
            disableClearable={true}
          />

          {/* Timezone */}
          <FormControl
            sx={{
              textAlign: 'left',
              flexGrow: 1,
              minWidth: 312,
            }}
          >
            <Select
              id="timezone-select"
              value={timezone}
              color="default"
              onChange={(event) => setTimezone(event.target.value)}
              renderValue={(value) => `${localTimestamp} ${getTzLabel(value)}`}
            >
              <MenuItem value={'America/Los_Angeles'}>Los Angeles</MenuItem>
              <MenuItem value={'America/Chicago'}>Chicago</MenuItem>
              <MenuItem value={'America/New_York'}>New York</MenuItem>
              <MenuItem value={'America/Sao_Paulo'}>São Paulo</MenuItem>
              <MenuItem value={'UTC'}>UTC</MenuItem>
              <MenuItem value={'Europe/London'}>London</MenuItem>
              <MenuItem value={'Europe/Paris'}>Paris</MenuItem>
              <MenuItem value={'Asia/Dubai'}>Dubai</MenuItem>
              <MenuItem value={'Asia/Kolkata'}>Mumbai</MenuItem>
              <MenuItem value={'Asia/Hong_Kong'}>Hong Kong</MenuItem>
              <MenuItem value={'Asia/Tokyo'}>Tokyo</MenuItem>
              <MenuItem value={'Australia/Sydney'}>Sydney</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

    </Box>
  );
}