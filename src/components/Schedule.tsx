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
  
  now.setUTCHours(13);
  now.setUTCMinutes(30);
  now.setUTCSeconds(0);

  const next1 = addToDate(now, {days: 1});
  const next2 = addToDate(now, {days: 2});
  const next3 = addToDate(now, {days: 3});


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
      'date': next1,
      'assetClass': 'Stocks',
      'symbol': 'TSLA',
      'name': 'Tesla, Inc.'
    },
    {
      'date': next2,
      'assetClass': 'Stocks',
      'symbol': 'AAPL',
      'name': 'Apple, Inc.'
    },
    {
      'date': next3,
      'assetClass': 'Crypto',
      'symbol': 'BTCUSD',
      'name': 'Bitcoin'
    },
    
    // {
    //   'date': esTime,
    //   'assetClass': 'Futures',
    //   'symbol': 'ESU25',
    //   'name': 'S&P 500 E-Mini Sep 2025'
    // },
  ];

  const rowHeight = 56
  const fontSize = 18

  const cellStyles = {
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: rowHeight,
    padding: '0px 16px'
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const defaultCols = ['day', 'datetime', 'assetClass', 'symbol', 'name'];
  const [columns, setColumns] = useState<string[]>(defaultCols);


  useEffect(() => {
    const width: number = containerRef.current?.offsetWidth ?? 0;
    if (width <= 360) {
      setColumns(['dayShort', 'time', 'symbol']);
    }
    else if (width <= 420) {
      setColumns(['datetime', 'symbol']);
    }
    else if (width <= 580) {
      setColumns(['dayShort', 'datetime', 'symbol']);
    }
    else if (width <= 620) {
      setColumns(['dayShort', 'datetime', 'assetClass', 'symbol']);
    }
    else if (width <= 740) {
      setColumns(['dayShort', 'datetime', 'assetClass', 'symbol', 'name']);
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
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: 1,
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
                  key={`${item.name}`}
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
                        width: 80, 
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
                        width: 120,
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