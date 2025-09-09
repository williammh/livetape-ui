import { useEffect, useState, useRef } from 'react';
import { 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { addToDate, getTzLabel, toLocalDateTimeStr, toLocalTimeStr } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

export const Schedule = () => {
  const { timezone } = useAppContext();
  
  const now = new Date();
  
  now.setHours(13);
  now.setMinutes(30);
  now.setSeconds(0);
  
  const btcTime = addToDate(now, {hours: 2, minutes: 30});
  const tslaTime = addToDate(now, {days: 1});
  const ethTime = addToDate(now, {days: 2});
  const esTime = addToDate(now, {days: 3});


  const dayMap = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayMapShort = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];
  
  const scheduleItems = [
    {
      'date': btcTime,
      'assetClass': 'Crypto',
      'symbol': 'BTCUSD',
      'name': 'Bitcoin'
    },
    {
      'date': tslaTime,
      'assetClass': 'Stocks',
      'symbol': 'TSLA',
      'name': 'Tesla, Inc.'
    },
    {
      'date': ethTime,
      'assetClass': 'Crypto',
      'symbol': 'ETHUSD',
      'name': 'Ethereum'
    },
    {
      'date': esTime,
      'assetClass': 'Futures',
      'symbol': 'ESU25',
      'name': 'S&P 500 E-Mini Sep 2025'
    },
  ];

  const rowHeight = 56
  const fontSize = 18

  const cellStyles = {
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: rowHeight,
    // padding: 0,
    padding: '0px 16px'
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const defaultCols = ['day', 'datetime', 'assetClass', 'symbol', 'name'];
  const [columns, setColumns] = useState<string[]>(defaultCols);


  useEffect(() => {
    console.log(containerRef.current?.offsetWidth);
    const width: number = containerRef.current?.offsetWidth ?? 0;
    if (width <= 360) {
      setColumns(['datetime', 'symbol']);
    }
    else if (width <= 400) {
      setColumns(['dayShort', 'datetime', 'symbol']);
    }
    else if (width <= 700) {
      setColumns(['day', 'datetime', 'assetClass', 'symbol']);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
    >
      <Box
        sx={{
          position: 'static',
          width: '100%',
          height: rowHeight,
          backgroundColor: '#202020',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          fontWeight: 'bold',
          zIndex: 1,
          borderBottom: '1px solid #444'
        }}
      >
        <Typography
          variant='h6'
          component='span'
          fontSize={fontSize}
          fontWeight='bold'
        >
          {`Next`}
        </Typography>
        <Typography
          variant='h6'
          component='span'
          fontSize={fontSize}
        >
          {"\u00A0"}{`(${getTzLabel(timezone)} time)`}
        </Typography>

      </Box>
      
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          marginBottom: 1,
          overflow: 'hidden'
        }}
      >
        <Table
          aria-label="LiveTape schedule"
          sx={{
            ...cellStyles,
            width: '100%',
            tableLayout: 'fixed', 
          }}
        >
          <TableBody>
            {scheduleItems.map((item) => {
              return (
                <TableRow
                  key={`${item.text}}`}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {columns.includes('day') && (
                    <TableCell
                      align="left"
                      sx={{
                        ...cellStyles,
                        paddingLeft: 2,
                        minWidth: 56,
                        width: 130,
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                      >
                        {dayMap[item.date.getUTCDay()]}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('dayShort') && (
                    <TableCell
                      align="left"
                      sx={{
                        ...cellStyles,
                        paddingLeft: 2,
                        width: 80,
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                      >
                        {dayMapShort[item.date.getUTCDay()]}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('datetime') && (
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        ...cellStyles,
                        width: 220, 
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                      >
                        {toLocalDateTimeStr(item.date, timezone)}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('time') && (
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        ...cellStyles,
                        width: 220, 
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                      >
                        {toLocalTimeStr(item.date, timezone)}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('assetClass') && (
                    <TableCell
                      align="left"
                      sx={{
                        ...cellStyles,
                        width: 80,
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                      >
                        {`${item.assetClass}`}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('symbol') && (
                    <TableCell
                      align="left"
                      sx={{
                        ...cellStyles,
                        width: 100,
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                      >
                        {`${item.symbol}`}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.includes('name') && (
                    <TableCell
                      align="left"
                      sx={{
                        ...cellStyles,
                        paddingRight: 2,
                      }}
                    >
                      <Typography
                        variant='h6'
                        fontSize={fontSize}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                      >
                        {`${item.name}`}
                      </Typography>
                    </TableCell>
                  )}
                  


                </TableRow>
              )
            })}

            
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}