import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect,
} from 'react';
import { 
  Box,
  CircularProgress,
  colors,
  Typography,
} from '@mui/material';
import { serverAddress, useAppContext } from '../contexts/AppContext';
import { toLocalTimeStr, addToDate, toRfc3339Str, isDST } from '../util/misc';

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

const handleWebSocketMessage = (message, chartRef, rawBarDataRef, userZoomedXAxis, timezone) => {
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
      restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, timezone);
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
        restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, timezone, false);
      } else {

        if (receivedBarIndex !== -1) {
          currentBars[receivedBarIndex] = openBar;
        
          const newConvertedBars = convertBars(currentBars);
          chart?.updateSeries([{
            data: newConvertedBars
          }], false);

          rawBarDataRef.current = currentBars;
          restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, timezone, false);

        } else {
          currentBars.push(openBar);
          const newConvertedBars = convertBars(currentBars);
          chart?.updateSeries([{
            data: newConvertedBars
          }], false);

          rawBarDataRef.current = currentBars;
          restoreZoom(chart, currentXAxisRange, currentYAxisRange, rawBarDataRef, userZoomedXAxis, timezone, true);
        }
          
      }
      rawBarDataRef.current = currentBars;          
      break;
  }
};

const ONE_MIN_MS = 1 * 60 * 1000;
const FIVE_MIN_MS = 5 * 60 * 1000;
const TEN_MIN_MS = 10 * 60 * 1000;

const THIRTY_MIN_MS = 30 * 60 * 1000;

const calcCleanXAxisRange = (min: number, max: number, firstBarTime?: number, lastBarTime?: number) => {
  if (min === undefined || max === undefined) {
    return null;
  }
  
  const roundDownTo30Min = (time: number) => Math.floor(time / THIRTY_MIN_MS) * THIRTY_MIN_MS;
  const roundUpTo30Min = (time: number) => Math.ceil(time / THIRTY_MIN_MS) * THIRTY_MIN_MS;
  const roundUpTo10Min = (time: number) => Math.ceil(time / TEN_MIN_MS) * TEN_MIN_MS;
  const roundUpTo5Min = (time: number) => Math.ceil(time / FIVE_MIN_MS) * FIVE_MIN_MS;
  const roundUpTo1Min = (time: number) => Math.ceil(time / ONE_MIN_MS) * ONE_MIN_MS;



  if (firstBarTime && lastBarTime && lastBarTime - firstBarTime < FIVE_MIN_MS) {
    const cleanMin = min;
    const cleanMax = roundUpTo10Min(firstBarTime);
    const tickAmount = undefined;
    const stepSize = 60000;
    return { min: cleanMin, max: cleanMax, tickAmount, stepSize };

  } else {

  }

  const roundedMin = roundDownTo30Min(min);
  const cleanMin = Math.max(roundedMin, firstBarTime ?? min);
  const next5Min = roundUpTo5Min(lastBarTime ?? max);
  const maxTopOfMinute = roundUpTo1Min(max);
  const cleanMax = Math.min(maxTopOfMinute, next5Min);
  const visibleMinuteBars = Math.ceil((cleanMax - min) / 60 / 1000);
  const maxTicks = Math.min(visibleMinuteBars, 12);
  const minTicks = 6;
  const tickAmount = Math.min(visibleMinuteBars, maxTicks);
  // const tickAmount = visibleMinuteBars < minTicks ? visibleMinuteBars : maxTicks;
  // const tickAmount = Math.max(visibleMinuteBars, minTicks);

  // console.log(new Date(firstBarTime));
  // console.log(new Date(lastBarTime));


  
  // console.log('min', 'max');
  // console.log(new Date(min));
  // console.log(new Date(max));

  // console.log('calcCleanXRange');
  // console.log(new Date(cleanMin));
  // console.log(new Date(cleanMax));
  // console.log('tickAmount', tickAmount);
  
  // console.log('visibleMinuteBars',visibleMinuteBars);

  const stepSizeMin = Math.ceil((visibleMinuteBars + 1) / tickAmount);
  // console.log("stepSizeMin", stepSizeMin);
  const stepSize = stepSizeMin * 60 * 1000;
  // console.log("stepSize", stepSize);

  return { min: cleanMin, max: cleanMax, tickAmount, stepSize };
};

// Function to determine appropriate tick interval based on price range
const getTickInterval = (min: number, max: number) => {
  const range = max - min;
  
  if (range <= 5) return .5;
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
const calcCleanYAxisRange = (min: number, max: number) => {
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
    tickAmount: Math.max(tickAmount, 4)
  };
};

const restoreZoom = (chart, currentXRange, currentYRange, rawBarDataRef, userZoomedXAxis, timezone, panRight=false) => {
  
  if (currentXRange) {
    try {

      const firstBarTime = new Date(rawBarDataRef.current[0].timestamp).getTime();
      // const lastBarTime = new Date(rawBarDataRef.current[rawBarDataRef.current.length - 1].timestamp).getTime();

      const idx = rawBarDataRef.current.findIndex((bar) => {
        return Number.isNaN(bar.open);
      })
      const lastBarIdx = idx !== -1 ? idx : rawBarDataRef.current.length - 1;

      const lastBarTime = new Date(rawBarDataRef.current[lastBarIdx].timestamp).getTime();
      const cleanXRange = calcCleanXAxisRange(currentXRange.min, currentXRange.max, firstBarTime, lastBarTime);

      if (panRight) {
        // +60000 epoch time moves X axis range 1 minute forward
        chart.zoomX(cleanXRange.min + 60000, cleanXRange.max + 60000);
      } else {
        chart.zoomX(cleanXRange.min, cleanXRange.max);
      }
    } catch (error) {
      console.warn('Failed to restore X-axis zoom:', error);
    }

    try {
      if (!userZoomedXAxis.current) {
        const firstBarTime = new Date(rawBarDataRef.current[0].timestamp).getTime();
        // const lastBarTime = new Date(rawBarDataRef.current[rawBarDataRef.current.length - 1].timestamp).getTime();
        
        const idx = rawBarDataRef.current.findIndex((bar) => {
          return Number.isNaN(bar.open);
        })

        const lastBarIdx = idx !== -1 ? idx : rawBarDataRef.current.length - 1;
       
        const lastBarTime = new Date(rawBarDataRef.current[lastBarIdx].timestamp).getTime();

        const cleanXRange = calcCleanXAxisRange(currentXRange.min, currentXRange.max, firstBarTime, lastBarTime);
       
        if (cleanXRange) {
          // console.log(rawBarDataRef.current[lastBarIdx]);
          // console.log(chart);
          // const barWidth = chart.w.globals.barPadForNumericAxis;
          chart.updateOptions({
            xaxis: {
              min: cleanXRange.min,
              max: cleanXRange.max,
              tickAmount: cleanXRange.tickAmount,
              // stepSize: cleanXRange.stepSize,
              labels: {
                formatter: (val: number) => toLocalTimeStr(val, timezone),
                style: { colors: '#fff', fontSize: '18' },
              },
              tooltip: {
                enabled: true,
                formatter: (val: number) => toLocalTimeStr(val, timezone),
              },
              axisBorder: {
                show: true,
                color: '#fff',
              },
              tickPlacement: 'on',
            },
            annotations: {
              yaxis: [
                {
                  y: rawBarDataRef.current[lastBarIdx - 1].close,
                  borderWidth: 0,
                  label: {
                    text: `${rawBarDataRef.current[lastBarIdx - 1].close.toFixed(2)}`,
                    // offsetX: -barWidth * 3,
                    style: {},
                    position: 'right'
                  }
                }
              ]
            },
          }, false, false);
        }
      }
    } catch (error) {
      console.warn('Failed to restore X-axis range:', error);
    }
  }

  // Restore Y-axis range if it was manually set
  if (currentYRange && currentYRange.min !== undefined && currentYRange.max !== undefined && userZoomedXAxis.current) {
    try {
      const cleanYRange = calcCleanYAxisRange(currentYRange.min, currentYRange.max);
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
            formatter: (val) => val.toFixed(2)
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
  const { setAssetClass, symbol, setSymbol, timezone, replayDate, setReplayDate, isServerOnlineRef } = useAppContext();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [initialData, setInitialData] = useState([]); // New state for initial data
  const rawBarDataRef = useRef<Array<IBar>>([]);
  const chartRef = useRef(null);

  const userZoomedYAxis = useRef(false);
  const userZoomedXAxis = useRef(false);

  useEffect(() => {
    if (replayDate) {
      const startDateTime = new Date(replayDate);

      startDateTime.setUTCHours(isDST(startDateTime) ? 13 : 14);
      startDateTime.setUTCMinutes(31);
      startDateTime.setUTCSeconds(0);

      const initialBars = 10;

      const emptyRawBarData = Array(initialBars).fill().map((_, index) => {
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

      const emptyConvertedBars = Array(initialBars).fill().map((_, index) => ({
        x: addToDate(startDateTime, {minutes: index}),
        y: [NaN, NaN, NaN, NaN]
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

    const secondsToStartRerun = 5;
    const offlineTimeout = setTimeout(() => {
    
      if (rawBarDataRef?.current.length === 0) {
        console.log('REPLAY!', isServerOnlineRef.current);
        setAssetClass('Stocks');
        setSymbol('NVDA');
        setReplayDate('2025-08-22');
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
      
    })();

    return () => {
      clearTimeout(offlineTimeout);
    };

  }, [symbol]);
  
  // subtract height of header - StusBar - Accounts - padding
  const height = window.innerHeight - 72 - 64 - 446 - 38
 
  return (
    <Box
      sx={{
        marginTop: 1,
        height: height,
      }}
    >
      <WebSocketDataHandler
        onMessage={(msg) => handleWebSocketMessage(msg, chartRef, rawBarDataRef, userZoomedXAxis, timezone)} 
        symbol={symbol}
      />
      {isDataLoaded ? (
       
        <Chart
          series={[{
            data: initialData
          }]}
          type='candlestick'
          height={height - 15}
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
                        
            
                        const cleanXRange = calcCleanXAxisRange(xaxis.min, xaxis.max);
                        const cleanYRange = calcCleanYAxisRange(yRange.min, yRange.max);


                        chart.updateOptions({
                      
                          xaxis: {
                            min: cleanXRange.min,
                            max: cleanXRange.max,
                            tickAmount: cleanXRange.tickAmount,
                            // stepSize: cleanXRange.stepSize,
                            labels: {
                              formatter: (val: number) => toLocalTimeStr(val, timezone),
                              style: { colors: '#fff', fontSize: '18' },
                            },
                            tooltip: {
                              enabled: true,
                              formatter: (val: number) => toLocalTimeStr(val, timezone),
                            },
                            axisBorder: {
                              show: true,
                              color: '#fff',
                            },
                            tickPlacement: 'on',
                          },
                          yaxis: {
                            min: cleanYRange.min,
                            max: cleanYRange.max,
                            tickAmount: cleanYRange.tickAmount,
                            labels: {
                              style: {
                                colors: '#fff',
                                fontSize: '18',
                              },
                              formatter: (val) => (val).toFixed(2)
                            },
                            tooltip: { enabled: true },
                          }
                        }, false, false);
                      }
                    }
                  }
                },
                beforeZoom: (chart, { xaxis }) => {
                  const firstTime = convertBars([rawBarDataRef.current[0]])[0].x.getTime();     
                  const newMin = new Date(xaxis.min).getTime();
  
                  if (newMin == firstTime) {
                    userZoomedYAxis.current = false;
                    userZoomedXAxis.current = false; 
                  } else {

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
                },
              }
            },
            // stroke: {
            //   width: 2
            // },
            tooltip: {
              theme: 'dark',
              custom: ({ seriesIndex, dataPointIndex, w }) => {
                const [o, h, l, c] = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y;
                  
                // console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]);
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
                formatter: (val) => (toLocalTimeStr(val, timezone)),
                style: {
                  colors: '#fff',
                  fontSize: '18',
                },
                
              },
              // stepSize: 60000,
              tickPlacement: 'on',
              axisBorder: {
                show: true,
                color: '#fff'
              },
              tooltip: {
                enabled: true,
                formatter: (val) => (toLocalTimeStr(val, timezone)),
              }
            },
            yaxis: {
              labels: {
                style: {
                  colors: '#fff',
                  fontSize: '18',
                },
                formatter: (val) => val.toFixed(2)
              },
              tooltip: { enabled: true },
            },
            // annotations: {
            //   yaxis: [
            //     {
            //       // last bar close
            //       y: rawBarDataRef?.current.length > 0 
            //         ? convertedData[convertedData.length - 1].y[3]
            //         : null,            
            //       borderWidth: 0,
            //       label: {
            //         text: `${convertedData[convertedData.length - 1]?.y[3].toFixed(2)}`,
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
            height: height,
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