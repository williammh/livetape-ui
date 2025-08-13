import {
  useState
} from 'react';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { 
  Box,
  Collapse,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toLocalTime } from '../util/misc';



interface IPosition {
  id: number;
  direction: string;
  quantity: number;
  symbol: string;
  pnl: number | string;
  datetime: string;
}

export const Positions = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const columns = [
    {
      field: 'datetime',
      headerName: 'Opened',
      width: 180
    },
    {
      field: 'direction',
      headerName: 'Direction',
      width: 80
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 60
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 80
    },
    {
      field: 'average',
      headerName: 'Avg',
      width: 80
    },
    {
      field: 'pnl',
      headerName: 'P/L',
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
      datetime: toLocalTime(new Date(), 'America/Los_Angeles'),
    }
  ];

   const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      {/* <Typography>{personaStr}</Typography> */}
      <Typography
        variant="h6"
        textAlign="left"
      >
        {personaStr} Positions
      </Typography>
      <DataGrid
        rows={positions}
        columns={columns}
        showColumnVerticalBorder={false}
        hideFooter={true}
      />
      {/* {positions.map((p) => (
        <Grid
          container
          columns={8}
        >
          <Grid size={1}>
            {p.direction}
          </Grid>
          <Grid size={1}>
            {p.quantity}
          </Grid>
          <Grid size={1}>
            {p.symbol}
          </Grid>
          <Grid size={2}>
            {p.pnl > 0 ? '+' : '-'}{p.pnl.toFixed(2)}
          </Grid>
          <Grid size={3}>
            {p.datetime}
          </Grid>
        </Grid>
      ))} */}
      {/* <Grid
        container columns={5}
        // spacing={2}
      >
        <Grid size={1}>
          a
        </Grid>
        <Grid size={1}>
          b
        </Grid>
        <Grid size={1}>
          c
        </Grid>
        <Grid size={1}>
          d
        </Grid>
      </Grid> */}
      {/* <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Positions
          </ListSubheader>
        }
      >
        {positions.map(p => (
          <ListItemButton>
            <ListItemText primary={`${p.direction} ${p.quantity} ${p.symbol} ${p.pnl} ${p.datetime}`}  />
          </ListItemButton>
        ))}
      </List> */}
    </Box>
  );
}