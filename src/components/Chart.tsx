import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { 
  Box,
  CircularProgress,
  colors,
  Typography,
} from '@mui/material';
import { serverAddress, useAppContext } from '../contexts/AppContext';
import { toLocalTimeStr, addToDate, toRfc3339Str } from '../util/misc';

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

const WebSocketDataHandler = ({ onMessage }: {onMessage: () => void }) => {
  const { openBarCallback } = useAppContext();


  useEffect(() => {
    openBarCallback(onMessage);
    return () => openBarCallback(null);
  }, [onMessage, openBarCallback ]);

  return null;
}

const handleWebSocketMessage = (message, chartRef, rawBarDataRef, userZoomedXAxis) => {
  console.log(message.type);
  console.log(message.data);
  console.log(rawBarDataRef.current.length);

  if (rawBarDataRef.current.length === 0) {
    return;
  }
  
  const chart = chartRef.current;
  
  // Safety check - ensure chart is available
  if (!chart) {
    console.warn('Chart not available for WebSocket message');
    return;
  }

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
      
      rawBarDataRef.current = currentBars;          
      restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis);
      break;
      
    case 'open_bar':
      const lastBar = currentBars[currentBars.length - 1];
      const lastBarTimeStamp = lastBar?.['timestamp'];
      const openBarTimeStamp = message.data['timestamp'];
      const openBar = {
        'open': message.data['open'],
        'high': message.data['high'],
        'low': message.data['low'],
        'close': message.data['close'],
        'timestamp': openBarTimeStamp,
        'barstatus': 'open',
      }

      let receivedBarIndex = -1;
      receivedBarIndex = currentBars.findIndex((bar) => bar['timestamp'] === openBarTimeStamp);

      if (lastBarTimeStamp === openBarTimeStamp) {
        currentBars[currentBars.length - 1] = openBar;
        const newConvertedBars = convertBars(currentBars);
        
        chart?.updateSeries([{
          data: newConvertedBars
        }], false);
        
        rawBarDataRef.current = currentBars;  
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, false);
      } else {

        if (receivedBarIndex !== -1) {
          currentBars[receivedBarIndex] = openBar;
        
          const newConvertedBars = convertBars(currentBars);
          chart?.updateSeries([{
            data: newConvertedBars
          }], false);

          rawBarDataRef.current = currentBars;
          restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, false);

        } else {
          currentBars.push(openBar);
          const newConvertedBars = convertBars(currentBars);
          chart?.updateSeries([{
            data: newConvertedBars
          }], false);

          rawBarDataRef.current = currentBars;
          restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, true);
        }
          
      }
      rawBarDataRef.current = currentBars;          
      break;
  }
};

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
  const cleanMax = max < lastBarTime
  ? roundUpTo30Min(lastBarTime)
  : roundUpTo30Min(max);
  
  // const tickAmount = Math.floor((cleanMax - cleanMin) / THIRTY_MIN_MS);
  const tickAmount = 8;

  // const tickAmount = THIRTY_MIN_MS;

  return { min: cleanMin, max: cleanMax, tickAmount };
};

// Function to determine appropriate tick interval based on price range
const getTickInterval = (min: number, max: number) => {
  const range = max - min;
  
  if (range <= 10) return 1;
  if (range <= 25) return 5;
  if (range <= 50) return 10;
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

  // if min and max are only 1 apart, move min down by 1
  const finalMin = cleanMax - cleanMin > 1 ? cleanMin : cleanMin - 1; 
  
  const tickAmount = Math.floor((cleanMax - finalMin) / tickInterval);
  
  return {
    min: finalMin,
    max: cleanMax,
    tickAmount: Math.max(tickAmount, 2)
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
                formatter: toLocalTimeStr,
                style: { colors: '#fff', fontSize: '18' },
              },
              tooltip: {
                enabled: true,
                formatter: toLocalTimeStr,
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
      const cleanYRange = calculateCleanYAxisRange(currentYAxisRange.min, currentYAxisRange.max);
      chart.updateOptions({
        yaxis: {
          min: cleanYRange.min,
          max: cleanYRange.max,
          tickAmount: cleanYRange.tickAmount,
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
  // if unpopulated data because of replay bars
  if (data[1].y[3] === 0) return { min: data[0].y[2], max: data[0].y[1] };

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
    // ignore 0 / NaN / null (replay bars)
    if (low !== 0) {
      minY = Math.min(minY, low);
    }
    maxY = Math.max(maxY, high);
  });

  // Add some padding (2% on each side)
  const padding = (maxY - minY) * 0.02;

  return {
    min: minY - padding,
    max: maxY + padding
  };
};


export const CandlestickChart = () => {
  const { setAssetClass, symbol, setSymbol, replayDate, setReplayDate } = useAppContext();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [initialData, setInitialData] = useState([]); // New state for initial data
  const rawBarDataRef = useRef<Array<IBar>>([]);
  const chartRef = useRef(null);

  const userZoomedYAxis = useRef(false);
  const userZoomedXAxis = useRef(false);

  useEffect(() => {
    if (replayDate) {
      const startDateTime = new Date("2025-08-15T13:31:00Z");

      const emptyRawBarData = Array(390).fill().map((_, index) => {
        const timestamp = addToDate(startDateTime, {minutes: index});
        return {
          timestamp: toRfc3339Str(timestamp),
          barstatus: 'open',
          open: NaN,
          high: NaN,
          low: NaN,
          close: NaN,
          totalvolume: 0
        }
      });

      const emptyConvertedBars = Array(390).fill().map((_, index) => ({
        x: addToDate(startDateTime, {minutes: index}),
        y: [null, null, null, null]
      }));
      
      rawBarDataRef.current = emptyRawBarData;
      setInitialData(emptyConvertedBars);
      setIsDataLoaded(true);

    } else {
      rawBarDataRef.current = [];
      setInitialData([]);
    }

  }, [replayDate]);

  useEffect(() => {
  
    console.log(`RENDER CHART: ${symbol} ${replayDate}`);

    setIsDataLoaded(false);
    setInitialData([]);
    rawBarDataRef.current = [];
    userZoomedXAxis.current = false;
    userZoomedYAxis.current = false;

    const secondsToStartRerun = 2;
    const offlineTimeout = setTimeout(() => {
    
      if (rawBarDataRef?.current.length === 0) {

        setAssetClass('Stocks');
        setSymbol('NVDA');
        setReplayDate('2025-08-15');
   
        const startDateTime = new Date("2025-08-15T13:31:00Z");

        const emptyRawBarData = Array(390).fill().map((_, index) => {
          const timestamp = addToDate(startDateTime, {minutes: index});
          return {
            timestamp: toRfc3339Str(timestamp),
            barstatus: 'open',
            open: null,
            high: null,
            low: null,
            close: null,
            totalvolume: 0
          }
        });

        const emptyConvertedBars = Array(390).fill().map((_, index) => ({
          x: addToDate(startDateTime, {minutes: index}),
          y: [null, null, null, null]
        }));
        
        rawBarDataRef.current = emptyRawBarData;
        setInitialData(emptyConvertedBars);
        setIsDataLoaded(true);

      }
    }, secondsToStartRerun * 1000);

    const getclosedBars = (async () => {
      const res = await fetch(`http://${serverAddress}/closed_bars/${symbol}`);
      const closedBars = await res.json();
      console.log(`CLOSED BARS: ${symbol}`);
      console.log(closedBars);
      rawBarDataRef.current = closedBars;
      
      const convertedBars = convertBars(closedBars);
      setInitialData(convertedBars);
      setIsDataLoaded(true);
      console.log(`CONVERTED BARS ${convertedBars.length}`)
      console.log(convertedBars);
    })();

    return () => {
      clearTimeout(offlineTimeout);
    };

  }, [symbol]);
  

 
  return (
    <Box
      sx={{
        height: 'calc(100% - 56px)'
      }}
    >
      <WebSocketDataHandler
        onMessage={(msg) => handleWebSocketMessage(msg, chartRef, rawBarDataRef, userZoomedXAxis)} 
        symbol={symbol}
      />
      {isDataLoaded ? (
        <Chart
          series={[{
            data: initialData
          }]}
          type='candlestick'
          height='100%'
          options={{
            
            chart: {
              type: 'candlestick',
              
              toolbar: { show: false },
              animations: {
                enabled: false,
                dynamicAnimation: {
                  enabled: false
                }
              },
             
              events: {
                mounted: (chart) => {
                  chartRef.current = chart;
                  console.log('Chart mounted and ref set');
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
                        const cleanYRange = calculateCleanYAxisRange(yRange.min, yRange.max);

                        chart.updateOptions({
                          yaxis: {
                            min: cleanYRange.min,
                            max: cleanYRange.max,
                            tickAmount: cleanYRange.tickAmount,
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
              },
              // Prevent rendering of null/empty bars for replay bars
              sparkline: {
                enabled: false
              }
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: colors.green[400],
                  downward: colors.red[400]
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
                formatter: toLocalTimeStr,
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
                formatter: toLocalTimeStr,
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
            },
            // annotations: {
            //   yaxis: [
            //     {
            //       // last bar close
            //       y: convertedBars.length > 0 
            //         ? convertedBars[convertedBars.length - 1].y[3]
            //         : null,            
            //       borderWidth: 0,
            //       label: {
            //         text: `${convertedBars[convertedBars.length - 1]?.y[3].toFixed(2)}`,
            //         style: {
            //           color: '#fff',
            //           background: '#222',
            //           fontSize: '14px',
            //         },
            //         position: 'right'
            //       }
            //     }
            //   ]
            // },
          }}
        />
      ) : (
        <Box 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            color: 'white'
          }}
        >
          <CircularProgress
            color='#fff'
            sx={{
              margin: 4
            }}
          />
          <Typography>{`Waiting for ${symbol} chart data...`}</Typography>
        </Box>
      )}

    </Box>
  );
}