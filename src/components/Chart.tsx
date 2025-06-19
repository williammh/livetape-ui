import Chart from 'react-apexcharts';

export const CandlestickChart = ({bardata}) => {
  const convertedBars = bardata.map((bar) => ({
    x: new Date(bar['TimeStamp']),
    y: [bar['Open'], bar['High'], bar['Low'], bar['Close']]
  }));

  console.log(convertedBars);

  const series = [{
    data: convertedBars.slice(0)
  }]

  const formatter = (value) => {
    return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: "UTC", timeStyle: 'short'}))
  }

  return (
    <Chart
      series={series}
      type='candlestick'
      options={{
        chart: {
          type: 'candlestick',
          height: 350,
          toolbar: { show: false }
        },
        title: {
          text: 'MNQU25 1 Min',
          align: 'left',
          style: {
            color: '#fff'
          },
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

  );
}