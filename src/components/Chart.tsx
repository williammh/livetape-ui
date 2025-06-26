import Chart from 'react-apexcharts';
import {
  useState,
  useEffect,
  use,
} from 'react';
import { 
  Box,
  Autocomplete,
  TextField,
  Typography,
  Grid
} from '@mui/material';

export const CandlestickChart = ({bardata}) => {
  const convertedBars = bardata.map((bar) => ({
    x: new Date(bar['TimeStamp']),
    y: [bar['Open'], bar['High'], bar['Low'], bar['Close']]
  }));

  const defaultSymbol = 'MNQU25'
  const [symbol, setSymbol] = useState(defaultSymbol);

  const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Los_Angeles',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  }
  
  const lastDateTime: Date = convertedBars[convertedBars.length - 1]?.['x'];
  const lastDateTimeISOString = lastDateTime?.toISOString().slice(0, 19) + 'Z';
  const lastDateTimeLocaleString = lastDateTime?.toLocaleString('en-US', options);
  const dateTimeString = `${lastDateTimeLocaleString} | ${lastDateTimeISOString}`;

  useEffect(() => {
    if (lastDateTime) {
      console.log(dateTimeString);
    }
  }, [lastDateTime]);


  const formatter = (value: string) => {
    return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: "UTC", timeStyle: 'short'}))
  }

  return (
    <Box>
      <Grid
        container
        spacing={1}
        columns={18}
        direction="row"
        alignItems="center"
      >
        <Autocomplete 
          options={['MESU25', 'MNQU25']}
          defaultValue={defaultSymbol}
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
          }}
          disableClearable={true}
          // disabled={true}
        />
        <Typography>{dateTimeString}</Typography>
      </Grid>
      <Box>
        <Chart
          series={[{
            data: convertedBars
          }]}
          type='candlestick'
          height={780}
          options={{
            chart: {
              type: 'candlestick',
              toolbar: { show: false }
            },
            tooltip: {
              theme: 'dark',
              custom: ({ seriesIndex, dataPointIndex, w }) => {
                const o = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[0];
                const h = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[1];
                const l = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[2];
                const c = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[3];
    
                return `
                  <div style="padding:5px; text-align: right;">
                    Open: ${o.toFixed(2)}<br/>
                    High: ${h.toFixed(2)}<br/>
                    Low: ${l.toFixed(2)}<br/>
                    Close: ${c.toFixed(2)}
                  </div>
                `;
              }
            },
            xaxis: {
              type: 'datetime',
              labels: {
                formatter,
                style: {
                  colors: '#fff'
                },
              },
              tooltip: {
                enabled: true,
                formatter,
              }
            },
            yaxis: {
              labels: {
                style: {
                  colors: '#fff'
                },
              },
              tooltip: { enabled: true },
            }
          }}
        />
      </Box>
    </Box>
  );
}