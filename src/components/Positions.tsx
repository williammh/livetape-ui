import { useEffect, useState } from 'react';
import { 
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  colors,
} from '@mui/material';
import { toLocalDateTimeStr } from '../util/misc';
import { textAlignRight } from '../util/misc';
import { useAppContext, type IPosition } from '../contexts/AppContext';
import nVda20250815positions from '../assets/NVDA.2025-08-15.positions.json';

export const Positions = ({persona}) => {
  const { priceRef, timestampRef, positionsRef, replayDate, timezone } = useAppContext();

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const columns = [
    {
      field: 'direction',
      headerName: 'Direction',
      headerAlign: 'left',
      width: 120,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 40,
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      headerAlign: 'left',
      width: 80
    },
    {
      field: 'datetime',
      headerName: 'Opened',
      headerAlign: 'left',
      width: 200
    },
    {
      field: 'average',
      headerName: 'Avg',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 80

    },
    {
      field: 'pnl',
      headerName: 'P/L',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 80
    },
    
  ];

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
  
  const positionDisplay = (
    <List>
      {positionsList.map(pos => {
        const pnlPerQty = pos.direction === 'Long' ? price - pos.averagePrice : pos.averagePrice - price;
        const pnl = pnlPerQty * pos.quantity;
        let color = colors.grey[400];
        if (pnl > 0) {
          color = colors.green[400]
        }
        if (pnl < 0) {
          color = colors.red[400]
        }
        
        const avgPriceStr = pos.averagePrice.toFixed(2);
        const openTimeStamp = toLocalDateTimeStr(pos.openTimestamp);
        const pnlDisplay = (
          <Typography
            component="span"
            sx={{
              color: color,
              fontWeight: 'bold'
            }}
          >
            {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
          </Typography>
        );

        return (
          <ListItem
            sx={{
              padding: 0
            }}
          >
            <ListItemText
              primary={
                <>
                  {`${pos.direction} ${pos.quantity} ${pos.symbol} `}
                  {pnlDisplay}
                </>
              }

              secondary={`${avgPriceStr} at ${openTimeStamp}`}
            />
          </ListItem>
        )
      })}

    </List>
  )

  return (
    <Box>
      <Grid
        textAlign={'left'}
        sx={{
          height: 88
        }}
      >
        {
          positionsList.length ?
            positionDisplay :
            <Typography
              sx={{
                paddingTop: 2
              }}
            >
              No open positions
            </Typography>
        }
      
      </Grid>
    </Box>
  );
}
