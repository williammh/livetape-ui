import { useEffect, useState } from 'react';
import { 
  Box,
  colors,
  Table,
  TableBody,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useAppContext, replayPositionsDateMap, type IPosition } from '../contexts/AppContext';
import nVda20250815positions from '../assets/NVDA.2025-08-15.positions.json';

export const Positions = ({persona}) => {
  const { priceRef, timestampRef, positionsRef, replayDate } = useAppContext();

  const openDateTime = new Date();
  openDateTime.setHours(13);
  openDateTime.setMinutes(30);
  openDateTime.setSeconds(0);

  const [price, setPrice] = useState<number>();
  const [openPositions, setOpenPositions] = useState<object>({});

  useEffect(() => {

    const updatePositionsInterval = setInterval(() => {

      if (priceRef.current !== undefined) {
        setPrice(priceRef.current);
      }

      if (persona in positionsRef.current) {
        // TODO: only update if changed
        //   const changed = newOrders.length !== prevOrders.length ||
        //     newOrders.some((o, i) => o.id !== prevOrders[i]?.id || o.status !== prevOrders[i]?.status);

        setOpenPositions(positionsRef.current[persona]);
      } else if (!(persona in positionsRef.current)) {
        setOpenPositions({});
      }
   
    }, 1000);

    return () => {
      clearInterval(updatePositionsInterval);
    };

  }, [positionsRef]);

  const positionsList = Object.values(openPositions);

  const rowHeight = 56
  const fontSize = 18

  const cellStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: fontSize,
    padding: '0px 16px',
    height: rowHeight
  }

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >

      {positionsList.length > 0 ? positionsList.map(pos => {
        const change = price - pos.averagePrice;
        const pnl = pos.direction === 'Long' ? change * pos.quantity : Math.abs(change * pos.quantity);
        return (
          <TableContainer
            key={pos.id + pos.account}
            component={Paper}
            sx={{
              width: '100%',
              overflowX: 'hidden'
            }}
          >
            <Table
              aria-label="Position table"
              sx={{
                tableLayout: 'fixed', 
                ...cellStyles
              }}
            >
              <TableBody>
                <TableRow
                  key={`${pos.account} ${pos.id}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      width: 'auto', 
                      ...cellStyles
                    }}
                  >
                    Position
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      ...cellStyles,
                      width: 180,
                      minWidth: 180,
                      paddingLeft: 0,
                    
                    }}
                  >
                    {`${pos.direction.toUpperCase()} ${pos.quantity} ${pos.symbol}`}
                  </TableCell>
                </TableRow>

                <TableRow
                  key={`${pos.account} ${pos.direction} change`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={cellStyles}
                  >
                    Change
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      ...cellStyles,
                      paddingLeft: 0,
                      color: change > 0 ? colors.green[400] : colors.red[400],
                    }}
                  >
                    {`${change > 0 ? '+' : '-'} ${Math.abs(change).toFixed(2).padStart(5, '0')} USD`}
                  </TableCell>
                </TableRow>
                
                <TableRow
                  key={`${pos.account} ${pos.direction} P/L`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={cellStyles}
                  >
                    P/L
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      ...cellStyles,
                      paddingLeft: 0,
                      color: pnl > 0 ? colors.green[400] : colors.red[400],
                    }}
                  >
                    {`${pnl > 0 ? '+' : '-'} ${Math.abs(pnl).toFixed(2)} USD`}
                  </TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
          </TableContainer>
        )
      }) : (

        <Box 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#202020',
            color: 'white'
          }}
        >
          <Typography>
            No positions
          </Typography>
        </Box>
      )}
    </Box>
  );
}
