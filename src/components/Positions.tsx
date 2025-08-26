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
  const { priceRef, replayDate, timezone } = useAppContext();

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

  const postionsList = replayDate ? [
      {
        id: 0,
        direction: 'Long',
        quantity: 400,
        symbol: 'NVDA',
        average: 181.75,
        datetime: toLocalDateTimeStr(openDateTime, timezone),

      }
    ] : [
      {
        id: 0,
        direction: '',
        quantity: 0,
        symbol: 'positions',
        average: NaN,

      }
    ];

  const [price, setPrice] = useState<number>();
  
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (priceRef.current !== undefined) {
        setPrice(priceRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(updateInterval);
    };

  }, []);

  const positionDisplay = (
    <List>
      {postionsList.map(pos => {
        const pnl = (price - pos.average) * pos.quantity;
        const pnlDisplay = (
          <Typography
            component="span"
            sx={{
              color: pnl > 0 ? colors.green[400] : colors.red[400]
            }}
          >
            {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
          </Typography>
        )
        return (
          <ListItem>
            <ListItemText
              primary={
                <>
                  {`${pos.direction} ${pos.quantity} ${pos.symbol} `}
                  {pnlDisplay}
                </>
              }

              secondary={`${pos.average} at ${pos.datetime}`}
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
      >
        {/* <Typography
          variant='h6'
        >
          Positions
        </Typography> */}
        {positionDisplay}
      
      </Grid>
      {/* <DataGrid
        rows={positions}
        columns={columns}
        showColumnVerticalBorder={false}
        hideFooter={true}
      /> */}
    </Box>
  );
}
