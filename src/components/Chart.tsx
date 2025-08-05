import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect,
} from 'react';
import { 
  Box,
  Autocomplete,
  TextField,
  Typography,
  Grid
} from '@mui/material';
import { useSharedWebSocket } from '../WebSocketContext';

interface IBar {
  Open: number;
  High: number;
  Low: number;
  Close: number;
  TimeStamp: string;
  BarStatus: string;
  TotalVolume?: number;
}

const convertBars = (barData) => {
  if (!barData || !Array.isArray(barData) || barData.length === 0) {
    return [];
  }
  
  return barData
    .filter(bar => bar && bar.TimeStamp && bar.Open !== undefined && bar.High !== undefined && bar.Low !== undefined && bar.Close !== undefined)
    .map((bar) => ({
      x: new Date(bar['TimeStamp']),
      y: [
        parseFloat(bar['Open']) || 0,
        parseFloat(bar['High']) || 0,
        parseFloat(bar['Low']) || 0,
        parseFloat(bar['Close']) || 0
      ]
    }));
};

const WebSocketDataHandler = ({ onMessage }) => {
  const { message } = useSharedWebSocket();
  useEffect(() => {
    if (message) {
      onMessage(message);
    }
  }, [message]);

  return null; // Does not render anything
}

const restoreZoom = (chart, currentXAxisRange, panRight=false) => {
  // Force restore zoom state immediately
  if (currentXAxisRange) {
    try {
      if (panRight) {
        // +60000 epoch time moves X axis range 1 minute forward
        chart.zoomX(currentXAxisRange.min + 60000, currentXAxisRange.max + 60000);
      } else {
        chart.zoomX(currentXAxisRange.min, currentXAxisRange.max);
      }

    } catch (error) {
      console.warn('Failed to restore X-axis zoom:', error);
    }
  }
}

const handleWebSocketMessage = (message, chartRef, rawBarDataRef) => {
  if (rawBarDataRef.current.length === 0) {
    return;
  }

  console.log(`Received ${message.type} message: `);
  console.log(message.data);
  
  const chart = chartRef.current;
  const currentXAxisRange = chart?.w.globals.minX && chart?.w.globals.maxX ? {
    min: chart.w.globals.minX,
    max: chart.w.globals.maxX
  } : null;

  const currentBars = [...rawBarDataRef.current];

  switch(message.type) {
    case 'closed_bar':
      const closedBarTimeStamp = message.data['TimeStamp'];
      const index = currentBars.findLastIndex((bar) => bar['TimeStamp'] === closedBarTimeStamp);
      currentBars[index] = message.data;
      const newConvertedBars = convertBars(currentBars);
      chart?.updateSeries([{
        data: newConvertedBars
      }], false);
      restoreZoom(chart, currentXAxisRange);
      rawBarDataRef.current = currentBars;          
      break;
    case 'open_bar':
      const lastBar = currentBars[currentBars.length - 1];
      const lastBarTimeStamp = lastBar['TimeStamp'];
      const openBarTimeStamp = message.data['close_datetime'];
      const openBar = {
        'Open': message.data['open'],
        'High': message.data['high'],
        'Low': message.data['low'],
        'Close': message.data['close'],
        'TimeStamp': openBarTimeStamp,
        'BarStatus': 'Open',
      }
      
      if (lastBarTimeStamp === openBarTimeStamp) {
        currentBars[currentBars.length - 1] = openBar;
        const newConvertedBars = convertBars(currentBars);
        chart?.updateSeries([{
          data: newConvertedBars
        }], false)
        restoreZoom(chart, currentXAxisRange, false);
      } else {
        currentBars.shift();
        currentBars.push(openBar);
        const newConvertedBars = convertBars(currentBars);
        chart?.updateSeries([{
          data: newConvertedBars
        }], false)
        restoreZoom(chart, currentXAxisRange, true);
      }

      rawBarDataRef.current = currentBars;          
      break;
  }
};

export const CandlestickChart = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const rawBarDataRef = useRef<Array<IBar>>([]);
  const chartRef = useRef(null);
 
  const [symbol, setSymbol] = useState<string>('MNQU25');

  const formatter = (value: string) => {
    return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: "UTC", timeStyle: 'short'}))
  }

  useEffect(() => {
    const getClosedBars = (async () => {
      const res = await fetch('http://localhost:8000/closed_bars');
      const closedBars = await res.json();
      console.log(closedBars);
      console.log('closed:');
      const convertedBars = convertBars(closedBars);
      setIsDataLoaded(true);
      chartRef.current?.updateSeries([{ data: convertedBars }], false);
      rawBarDataRef.current = closedBars;
    })();
  }, []);

  console.log("RENDER Chart!");

  const convertedBars = convertBars([...rawBarDataRef.current]);

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
          }}
          disableClearable={true}
        />
      </Grid>
      <Box>
        <WebSocketDataHandler
          onMessage={(msg) => handleWebSocketMessage(msg, chartRef, rawBarDataRef)} 
        />
        {isDataLoaded ? (
          <Chart
            series={[{
              data: convertedBars
            }]}
            type='candlestick'
            height={780}
            options={{
              chart: {
                type: 'candlestick',
                toolbar: { show: false },
                animations: {
                  enabled: false, // Disable animations to prevent zoom reset
                  dynamicAnimation: {
                    enabled: false
                  }
                },
                events: {
                  mounted: (chart) => {
                    chartRef.current = chart;
                  }
                }
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
        ) : (
          <Box 
            sx={{ 
              height: 780, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
              color: 'white'
            }}
          >
            <Typography>Waiting for chart data...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}