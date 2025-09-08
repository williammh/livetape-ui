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
import { addToDate, getTzLabel, toLocalDateTimeStr } from '../util/misc';
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
  
  const scheduleItems = [
    {
      'date': btcTime,
      'assetClass': 'Crypto',
      'symbol': 'BTCUSD',
      'text': 'Bitcoin'
    },
    {
      'date': tslaTime,
      'assetClass': 'Stocks',
      'symbol': 'TSLA',
      'text': 'Tesla, Inc.'
    },
    {
      'date': ethTime,
      'assetClass': 'Crypto',
      'symbol': 'ETHUSD',
      'text': 'Ethereum'
    },
    {
      'date': esTime,
      'assetClass': 'Futures',
      'symbol': 'ESU25',
      'text': 'S&P 500 E-Mini Sep 2025'
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
    padding: '0px 16px'
  }

 return (
  <Box>
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
      }}
    >
      <Table
        aria-label="LiveTape schedule"
        sx={{
          tableLayout: 'fixed', 
          ...cellStyles
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
                <TableCell
                  align="left"
                  sx={{

                    width: 120,
                    ...cellStyles
                  }}
                >
                  <Typography
                    variant='h6'
                    fontSize={fontSize}
                  >
                    {dayMap[item.date.getUTCDay()]}
                  </Typography>
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{

                    width: 'auto', 
                    ...cellStyles
                  }}
                >
                  <Typography
                    variant='h6'
                    fontSize={fontSize}
                  >
                    {toLocalDateTimeStr(item.date, timezone)}
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 100,
                    ...cellStyles
                  }}
                >
                  <Typography
                    variant='h6'
                    fontSize={fontSize}

                    // fontWeight='bold'
                  >
                    {`${item.assetClass}`}
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 100,
                    ...cellStyles
                  }}
                >
                  <Typography
                    variant='h6'
                    fontSize={fontSize}
                  >
                    {`${item.symbol}`}
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    ...cellStyles
                  }}
                >
                  <Typography
                    variant='h6'
                    fontSize={fontSize}
                  >
                    {`${item.text}`}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}

          
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
 )
}