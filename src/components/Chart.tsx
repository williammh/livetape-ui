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
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const barDataRef = useRef([]); // Keep track of raw bar data
  const chartRef = useRef(null);
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
  
    if (!chartRef.current) {
      console.log('Chart not ready for updates');
      return;
    }
    
    if (!newConvertedBars || newConvertedBars.length === 0) {
      console.warn('No data to update');
      return;
    }

    try {
      const chart = chartRef.current;
      const currentXAxisRange = chart.w.globals.minX && chart.w.globals.maxX ? {
        min: chart.w.globals.minX,
        max: chart.w.globals.maxX
      } : null;
      
      chartRef.current.updateSeries([{
        data: newConvertedBars
      }], false);

      // Force restore zoom state immediately
      if (currentXAxisRange) {
        try {
          // +60000 epoch time moves X axis range 1 minute forward
          chart.zoomX(currentXAxisRange.min + 60000, currentXAxisRange.max + 60000);

        } catch (error) {
          console.warn('Failed to restore X-axis zoom:', error);
        }
      }
    
      console.log('Chart updated via updateSeries');
    } catch (error) {
      console.warn('Chart update failed:', error);
    }
  };

  useWebSocket((data) => {
    console.log('Websocket data received:');
    console.log(data);
    switch(data['type']) {
      case 'all_bars':
        const convertedBars = convertBars(data['data']);
        setChartData(convertedBars);
        setIsDataLoaded(true);
        barDataRef.current = data['data'];
        break;
      case 'latest_bar':
        if (barDataRef.current.length > 0) {
          const currentBars = [...barDataRef.current];
          currentBars.shift();
          currentBars.push(data['data']);
          const newConvertedBars = convertBars(currentBars);
          updateChartSeries(newConvertedBars);
          barDataRef.current = currentBars;          
        }
        break;
      case 'open_bar':
        console.log(data['data']['current_datetime'])
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
                    chartRef.current = chart;
                  },
                  zoomed: (chartContext, { xaxis, yaxis }) => {
                    zoomStateRef.current = { xaxis, yaxis };
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