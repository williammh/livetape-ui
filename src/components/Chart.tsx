import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect,
} from 'react';
import { 
  Box,
  Typography,
} from '@mui/material';
import { useBarContext } from '../contexts/BarContext';

interface IBar {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: string;
  barstatus: string;
  totalvolume?: number;
}

const convertBars = (barData) => {
  if (!barData || !Array.isArray(barData) || barData.length === 0) {
    return [];
  }
  
  return barData
    .filter(bar => bar && bar.timestamp && bar.open !== undefined && bar.high !== undefined && bar.low !== undefined && bar.close !== undefined)
    .map((bar) => ({
      x: new Date(bar['timestamp']),
      y: [
        parseFloat(bar['open']) || 0,
        parseFloat(bar['high']) || 0,
        parseFloat(bar['low']) || 0,
        parseFloat(bar['close']) || 0
      ]
    }));
};

const WebSocketDataHandler = ({ onMessage }) => {
  const { message } = useBarContext();
  useEffect(() => {
    if (message) {
      onMessage(message);
    }
  }, [message]);
  return null; // Does not render anything
}

const THIRTY_MIN_MS = 30 * 60 * 1000;

const calculateCleanXAxisRange = (min: number, max: number, firstBarTime: number, lastBarTime: number) => {
  if (min === undefined || max === undefined || lastBarTime === undefined) {
    return null;
  }
  
  const roundDownTo30Min = (time: number) => Math.floor(time / THIRTY_MIN_MS) * THIRTY_MIN_MS;
  const roundUpTo30Min = (time: number) => Math.ceil(time / THIRTY_MIN_MS) * THIRTY_MIN_MS;

  const roundedMin = roundDownTo30Min(min);
  const cleanMin = Math.max(roundedMin, firstBarTime);

  // Only extend max if current max < lastBarTime
  const baseMax = Math.max(max, lastBarTime);
  const cleanMax = baseMax < lastBarTime
    ? roundUpTo30Min(lastBarTime)
    : roundUpTo30Min(baseMax);

  const tickAmount = Math.floor((cleanMax - cleanMin) / THIRTY_MIN_MS);
  // const tickAmount = THIRTY_MIN_MS;

  console.log(tickAmount);

  return { min: cleanMin, max: cleanMax, tickAmount };
};

// Function to determine appropriate tick interval based on price range
const getTickInterval = (min: number, max: number) => {
  const range = max - min;
  
  if (range <= 100) return 25;     
  if (range <= 500) return 50;    
  if (range <= 1000) return 100;  
  if (range <= 5000) return 250;
  return 500;
};

// Function to calculate clean Y-axis min/max and tick interval
const calculateCleanYAxisRange = (min: number, max: number) => {
  const tickInterval = getTickInterval(min, max);
  
  // Round min down to nearest tick interval
  const cleanMin = Math.floor(min / tickInterval) * tickInterval;
  
  // Round max up to nearest tick interval
  const cleanMax = Math.ceil(max / tickInterval) * tickInterval;
  
  return {
    min: cleanMin,
    max: cleanMax,
    tickAmount: Math.floor((cleanMax - cleanMin) / tickInterval)
  };
};

const restoreZoom = (chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, panRight=false) => {
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

    try {
      if (!userZoomedXAxis.current) {
        const firstBarTime = new Date(rawBarDataRef.current[0].timestamp).getTime();
        const lastBarTime = new Date(rawBarDataRef.current[rawBarDataRef.current.length - 1].timestamp).getTime();


        const cleanXRange = calculateCleanXAxisRange(currentXAxisRange.min, currentXAxisRange.max, firstBarTime, lastBarTime);

        if (cleanXRange) {
          chart.updateOptions({
            xaxis: {
              min: cleanXRange.min,
              max: cleanXRange.max,
              tickAmount: cleanXRange.tickAmount,
              labels: {
                formatter: dateFormatter,
                style: { colors: '#fff', fontSize: '18' },
              },
              tooltip: {
                enabled: true,
                formatter: dateFormatter,
              },
              axisBorder: {
                show: true,
                color: '#fff',
              },
              // nicely space ticks every 30 mins
              tickPlacement: 'between',
            },
          }, false, false);
        }
      }
    } catch (error) {
      console.warn('Failed to restore X-axis range:', error);
    }
  }

  // Restore Y-axis range if it was manually set
  if (currentYAxisRange && currentYAxisRange.min !== undefined && currentYAxisRange.max !== undefined && userZoomedXAxis.current) {
    try {
      const cleanRange = calculateCleanYAxisRange(currentYAxisRange.min, currentYAxisRange.max);
      chart.updateOptions({
        yaxis: {
          min: cleanRange.min,
          max: cleanRange.max,
          tickAmount: cleanRange.tickAmount,
          labels: {
            style: {
              colors: '#fff',
              fontSize: '18'
            },
            formatter: (val) => Math.round(val).toFixed(2)
          },
          tooltip: {
            enabled: true,
          },
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

const handleWebSocketMessage = (message, chartRef, rawBarDataRef, userZoomedXAxis) => {
  if (rawBarDataRef.current.length === 0) {
    return;
  }

  console.log(message.type);
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
      const closedBarTimeStamp = message.data['timestamp'];
      const index = currentBars.findLastIndex((bar) => bar['timestamp'] === closedBarTimeStamp);
      currentBars[index] = message.data;
      const newConvertedBars = convertBars(currentBars);
      
      chart?.updateSeries([{
        data: newConvertedBars
      }], false);
      
      restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis);
      rawBarDataRef.current = currentBars;          
      break;
      
    case 'open_bar':
      const lastBar = currentBars[currentBars.length - 1];
      const lastBarTimeStamp = lastBar['timestamp'];
      const openBarTimeStamp = message.data['timestamp'];
      const openBar = {
        'open': message.data['open'],
        'high': message.data['high'],
        'low': message.data['low'],
        'close': message.data['close'],
        'timestamp': openBarTimeStamp,
        'barstatus': 'open',
      }
      
      if (lastBarTimeStamp === openBarTimeStamp) {
        currentBars[currentBars.length - 1] = openBar;
        const newConvertedBars = convertBars(currentBars);
        
        chart?.updateSeries([{
          data: newConvertedBars
        }], false);
        
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, false);
      } else {
        currentBars.push(openBar);
        const newConvertedBars = convertBars(currentBars);
        
        chart?.updateSeries([{
          data: newConvertedBars
        }], false);
        
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, true);
      }
      rawBarDataRef.current = currentBars;          
      break;
  }
};

const dateFormatter = (value: string) => {
  // const timeZone = 'UTC';
  const timeZone = 'America/Los_Angeles';
  return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: timeZone, timeStyle: 'short'}));
}

export const CandlestickChart = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const rawBarDataRef = useRef<Array<IBar>>([]);
  const chartRef = useRef(null);

  const userZoomedYAxis = useRef(false);
  const userZoomedXAxis = useRef(false);

  useEffect(() => {
    const getclosedBars = (async () => {
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
  
  const height = 520

  return (
    <Box
      sx={{
        height: height
      }}
    >
      <WebSocketDataHandler
        onMessage={(msg) => handleWebSocketMessage(msg, chartRef, rawBarDataRef, userZoomedXAxis)} 
      />
      {isDataLoaded ? (
        <Chart
          series={[{
            data: convertedBars
          }]}
          type='candlestick'
          // height={728}
          height={height}

          width={1160}
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
                    userZoomedYAxis.current = true;
                  }
                  
                  if (xaxis) {
                    const chart = chartRef.current;
                    if (chart && rawBarDataRef.current.length > 0) {
                      const convertedData = convertBars(rawBarDataRef.current);
                      const yRange = calculateYAxisRange(chart, convertedData);
                      if (yRange.min !== undefined && yRange.max !== undefined) {
                        const cleanRange = calculateCleanYAxisRange(yRange.min, yRange.max);
                        chart.updateOptions({
                          yaxis: {
                            min: cleanRange.min,
                            max: cleanRange.max,
                            tickAmount: cleanRange.tickAmount,
                            labels: {
                              style: {
                                colors: '#fff',
                                fontSize: '18',
                              },
                              formatter: (val) => Math.round(val).toFixed(2)
                            },
                            tooltip: { enabled: true },
                          }
                        }, false, false);
                      }
                    }
                  }
                },
                beforeZoom: (chart, { xaxis }) => {
                  // console.log(`before ZOOM? ${xaxis}`);
                  const firstTime = convertBars([rawBarDataRef.current[0]])[0].x.getTime();     
                  const newMin = new Date(xaxis.min).getTime();
  
                  if (newMin == firstTime) {
                    // console.log("UNZOOMED");
                    userZoomedYAxis.current = false;
                    userZoomedXAxis.current = false; 
                  } else {
                    // console.log(firstTime, newMin, "ZOOMED");
                    userZoomedYAxis.current = true;
                    userZoomedXAxis.current = true; 
                  }

                  // return ;
                }
              }
            },
            tooltip: {
              theme: 'dark',
              custom: ({ seriesIndex, dataPointIndex, w }) => {
                const [o, h, l, c] = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y;
                
              
                return `
                  <div style="padding:5px; text-align: right;">
                    open: ${o.toFixed(2)}<br/>
                    high: ${h.toFixed(2)}<br/>
                    low: ${l.toFixed(2)}<br/>
                    close: ${c.toFixed(2)}
                  </div>
                `;
              }
            },
            xaxis: {
              type: 'datetime',
              labels: {
                formatter: dateFormatter,
                style: {
                  colors: '#fff',
                  fontSize: '18',
                },
              },
              axisBorder: {
                show: true,
                color: '#fff'
              },
              tooltip: {
                enabled: true,
                formatter: dateFormatter,
              }
            },
            yaxis: {
              labels: {
                style: {
                  colors: '#fff',
                  fontSize: '18',
                },
                formatter: (val) => Math.round(val).toFixed(2)
              },
              tooltip: { enabled: true },
            }
          }}
        />
      ) : (
        <Box 
          sx={{ 
            height: height, 
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
  );
}