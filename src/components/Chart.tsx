import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect
} from 'react';
import { 
  Box,
  Autocomplete,
  TextField,
  Typography,
  Grid
} from '@mui/material';
import { useWebSocket } from '../useWebsocket';

export const CandlestickChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fullBarsRef = useRef([]); // Keep track of raw bar data
  const chartInstanceRef = useRef(null); // Use ref for chart instance to avoid closure issues
  const zoomStateRef = useRef(null); // Store zoom state


  const defaultSymbol = 'MNQU25';
  const [symbol, setSymbol] = useState(defaultSymbol);

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

  // Function to safely update chart without re-rendering
  const updateChartSeries = (newConvertedBars) => {
  
    if (!chartInstanceRef.current) {
      console.log('Chart not ready for updates');
      return;
    }
    
    if (!newConvertedBars || newConvertedBars.length === 0) {
      console.warn('No data to update');
      return;
    }

    try {
      const chart = chartInstanceRef.current;
      const currentXAxisRange = chart.w.globals.minX && chart.w.globals.maxX ? {
        min: chart.w.globals.minX,
        max: chart.w.globals.maxX
      } : null;
      
      
      const date = new Date(1753916160000);
      console.log(date);

      const currentYAxisRange = chart.w.globals.minY && chart.w.globals.maxY ? {
        min: chart.w.globals.minY,
        max: chart.w.globals.maxY
      } : null;
      
      chartInstanceRef.current.updateSeries([{
        data: newConvertedBars
      }], false); // false preserves zoom

         // Force restore zoom state immediately and with multiple attempts
      const restoreZoom = () => {
        if (currentXAxisRange) {
          try {
            // + 60000 epoch time moves X axis range 1 minute forward
            chart.zoomX(currentXAxisRange.min + 60000, currentXAxisRange.max + 60000);

          } catch (error) {
            console.warn('Failed to restore X-axis zoom:', error);
          }
        }
      };

      restoreZoom();


      console.log('Chart updated via updateSeries');
    } catch (error) {
      console.warn('Chart update failed:', error);
    }
  };

  useEffect(() => {
    console.log('Chart instance changed:', chartInstance);
  }, [chartInstance]);

  useWebSocket((data) => {
    console.log('Websocket data received:', data);
    switch(data['type']) {
      case 'all_bars':
        const convertedBars = convertBars(data['data']);
        fullBarsRef.current = data['data'];
        setChartData(convertedBars);
        setIsDataLoaded(true);
        break;
      case 'latest_bar':
        const currentBars = [...fullBarsRef.current];
        if (currentBars.length > 0) {
          currentBars.shift();
          currentBars.push(data['data']);
          fullBarsRef.current = currentBars;
          
          const newConvertedBars = convertBars(currentBars);
          console.log('Updating with latest bar:', newConvertedBars.length, 'total bars');
          
          // Use updateSeries to preserve zoom
          updateChartSeries(newConvertedBars);
        }
        break;
    }
    
  });

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
        />
        <Typography>
          {isDataLoaded ? `Chart Ready (${chartData.length} bars)` : 'Loading...'}
        </Typography>
      </Grid>
      <Box>
        {isDataLoaded ? (
          <Chart
            series={[{
              data: chartData
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
                    console.log('Chart mounted successfully');
                    console.log(chart);
                    setChartInstance(chart);
                    chartInstanceRef.current = chart;
                  },
                  zoomed: (chartContext, { xaxis, yaxis }) => {
                    // Store zoom state when user zooms
                    zoomStateRef.current = { xaxis, yaxis };
                    console.log('Zoom state stored:', zoomStateRef.current);
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