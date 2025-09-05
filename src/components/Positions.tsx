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
} from '@mui/material';
import { useAppContext, type IPosition } from '../contexts/AppContext';
import nVda20250815positions from '../assets/NVDA.2025-08-15.positions.json';

export const Positions = ({persona}) => {
  const { priceRef, timestampRef, positionsRef, replayDate, timezone } = useAppContext();

  const openDateTime = new Date();
  openDateTime.setHours(13);
  openDateTime.setMinutes(30);
  openDateTime.setSeconds(0);

  const [price, setPrice] = useState<number>();
  const [openPositions, setOpenPositions] = useState<object>({});

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (priceRef.current !== undefined) {
        setPrice(priceRef.current);
      }
     
      if (replayDate) {

        for (let pos in openPositions) {
          if (timestampRef.current >= openPositions[pos].closeTimestamp) {
            console.log(`${persona} closing position: ${pos}`);
            const nextArray = Object.entries(openPositions).filter(([key]) => {
              return key !== pos;
            });
            const nextObj = Object.fromEntries(nextArray);
            positionsRef.current[persona] = nextObj;
            setOpenPositions(nextObj);
          }
        }

        for (let pos of nVda20250815positions) {
          if (
            (timestampRef.current >= pos.openTimestamp) &&
            (timestampRef.current < pos.closeTimestamp) &&
            (pos.account === persona) &&
            !(pos.id in openPositions)
          ) {
            console.log(`${persona} opening position: ${pos.id}`);
            setOpenPositions((prev) => {
              const next: {[id: string]: IPosition} = {...prev};
              next[pos.id] = pos;
              positionsRef.current[persona] = next;
              return next;
              
            })
          }
        }
      }

    }, 1000);

    return () => {
      clearInterval(updateInterval);
    };

  }, [replayDate, openPositions]);

  const positionsList = Object.values(openPositions);

  console.log(persona);
  console.log(price);
  console.log(positionsList);

  return (
    <Box>

      {positionsList.map(pos => {

        const change = price - pos.averagePrice;
        const pnl = pos.direction === 'Long' ? change * pos.quantity : Math.abs(change * pos.quantity);
        
        return (
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
            }}
          >
            <Table
              aria-label="Position table"
              sx={{
                fontWeight: 'bold'
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
                      fontWeight: 'bold'
                    }}
                  >
                    Position
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 'bold'
                    }}
                  >
                    {`${pos.direction} ${pos.quantity} ${pos.symbol} @ ${pos.averagePrice.toFixed(2)} USD`}
                  </TableCell>
                </TableRow>

                {/* <TableRow
                  key={`${pos.account} ${pos.direction} opened`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: 'bold'
                    }}
                  >
                    Opened
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 'bold'
                    }}
                  >
                    {toLocalDateTimeStr(pos.openTimestamp, timezone)}
                  </TableCell>
                </TableRow> */}

                <TableRow
                  key={`${pos.account} ${pos.direction} change`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: 'bold'
                    }}
                  >
                    Change
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: change > 0 ? colors.green[400] : colors.red[400],
                      fontWeight: 'bold'
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
                    sx={{
                      fontWeight: 'bold'
                    }}
                  >
                    P/L
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: pnl > 0 ? colors.green[400] : colors.red[400],
                      fontWeight: 'bold'
                    }}
                  >
                    {`${pnl > 0 ? '+' : '-'} ${Math.abs(pnl).toFixed(2)} USD`}
                  </TableCell>
                </TableRow>
                
              </TableBody>
            </Table>
          </TableContainer>
        )
      })}
    </Box>
  );
}
