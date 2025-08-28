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
import { DataGrid } from '@mui/x-data-grid';
import { toLocalDateTimeStr } from '../util/misc';
import { textAlignRight } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';
import nVda20250815positions from '../assets/NVDA.2025-08-15.positions.json';

interface IPosition {
  id: number;
  direction: string;
  quantity: number;
  symbol: string;
  average: number | string;
  pnl: number | string;
  datetime: string;
}

export const Positions = ({persona}) => {
  const { priceRef, timestampRef, replayDate, timezone } = useAppContext();

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

  const positions: IPosition[] = [
    {
      id: 0,
      direction: 'Long',
      quantity: 1,
      symbol: 'NVDA',
      average: `${(29337.75).toFixed(2)}`,
      pnl: `${(29534.5).toFixed(2)}`,
      datetime: toLocalDateTimeStr(new Date(), timezone),
    }
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
              const next = {...prev};
              next[pos.id] = pos;
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
  // console.log(`${persona} positions:`);
  // console.log(positionsList);

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
        const pnlDisplay = (
          <Typography
            component="span"
            sx={{
              color: color
            }}
          >
            {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
          </Typography>
        )
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

              secondary={`${(pos.averagePrice).toFixed(2)} at ${pos.openTimestamp}`}
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
