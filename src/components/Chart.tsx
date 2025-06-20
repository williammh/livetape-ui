import Chart from 'react-apexcharts';
import {
  useState,
  useEffect,
} from 'react';
import { 
  Box,
  Autocomplete,
  TextField
} from '@mui/material'
export const CandlestickChart = ({bardata}) => {
  const convertedBars = bardata.map((bar) => ({
    x: new Date(bar['TimeStamp']),
    y: [bar['Open'], bar['High'], bar['Low'], bar['Close']]
  }));

  // console.log(convertedBars);
  const defaultSymbol = 'MNQU25'
  const [symbol, setSymbol] = useState(defaultSymbol);


  const formatter = (value: string) => {
    return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: "UTC", timeStyle: 'short'}))
  }

  return (
    <Box>
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