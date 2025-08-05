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

const restoreZoom = (chart, currentXAxisRange, currentYAxisRange, panRight=false) => {
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

  // Restore Y-axis range if it was manually set
  if (currentYAxisRange && currentYAxisRange.min !== undefined && currentYAxisRange.max !== undefined) {
    try {
      chart.updateOptions({
        yaxis: {
          min: currentYAxisRange.min,
          max: currentYAxisRange.max,
          labels: {
            style: {
              colors: '#fff'
            },
          },
          tooltip: { enabled: true },
        }
      }, false, false);
    } catch (error) {
      console.warn('Failed to restore Y-axis range:', error);
    }
  }
}

// Function to calculate Y-axis range for visible data
const calculateYAxisRange = (chart, data) => {
  if (!chart?.w?.globals) return { min: undefined, max: undefined };
  
  const minX = chart.w.globals.minX;
  const maxX = chart.w.globals.maxX;
  
  if (!minX || !maxX || !data || data.length === 0) {
    return { min: undefined, max: undefined };
  }

  // Filter data points that are visible in the current X-axis range
  const visibleData = data.filter(point => {
    const pointTime = new Date(point.x).getTime();
    return pointTime >= minX && pointTime <= maxX;
  });

  if (visibleData.length === 0) {
    return { min: undefined, max: undefined };
  }

  // Find min and max Y values from visible candlestick data
  let minY = Infinity;
  let maxY = -Infinity;

  visibleData.forEach(point => {
    const [open, high, low, close] = point.y;
    minY = Math.min(minY, low);
    maxY = Math.max(maxY, high);
  });

  // Add some padding (2% on each side)
  const padding = (maxY - minY) * 0.02;
  
  return {
    min: minY - padding,
    max: maxY + padding
  };
};

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

  // Capture current Y-axis range
  const currentYAxisRange = chart?.w.globals.minY !== undefined && chart?.w.globals.maxY !== undefined ? {
    min: chart.w.globals.minY,
    max: chart.w.globals.maxY
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
      
      restoreZoom(chart, currentXAxisRange, currentYAxisRange);
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
        }], false);
        
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, false);
      } else {
        currentBars.shift();
        currentBars.push(openBar);
        const newConvertedBars = convertBars(currentBars);
        
        chart?.updateSeries([{
          data: newConvertedBars
        }], false);
        
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, true);
      }
      rawBarDataRef.current = currentBars;          
      break;
  }
};

export const CandlestickChart = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const rawBarDataRef = useRef<Array<IBar>>([]);
  const chartRef = useRef(null);
  const userScaledYAxis = useRef(false); // Track if user manually scaled Y-axis
 
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
      {/* <Grid
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
      </Grid> */}
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
                  },
                  zoomed: (chartContext, { xaxis, yaxis }) => {
                    // Mark that user has manually scaled the Y-axis if yaxis is defined
                    if (yaxis && (yaxis.min !== undefined || yaxis.max !== undefined)) {
                      userScaledYAxis.current = true;
                    }
                    
                    // If only X-axis was zoomed and user hasn't manually scaled Y-axis, auto-scale Y
                    if (xaxis && !userScaledYAxis.current) {
                      setTimeout(() => {
                        const chart = chartRef.current;
                        if (chart && rawBarDataRef.current.length > 0) {
                          const convertedData = convertBars(rawBarDataRef.current);
                          const yRange = calculateYAxisRange(chart, convertedData);
                          if (yRange.min !== undefined && yRange.max !== undefined) {
                            chart.updateOptions({
                              yaxis: {
                                min: yRange.min,
                                max: yRange.max,
                                labels: {
                                  style: {
                                    colors: '#fff'
                                  },
                                },
                                tooltip: { enabled: true },
                              }
                            }, false, false);
                          }
                        }
                      }, 100);
                    }
                  },
                  beforeResetZoom: () => {
                    // Reset the Y-axis scaling flag when chart is reset
                    userScaledYAxis.current = false;
                    return true;
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
                // Initial Y-axis will be auto-scaled, then updated dynamically
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