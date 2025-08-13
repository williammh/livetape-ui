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
  average: number | string;
  pnl: number | string;
  datetime: string;
}

export const Positions = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const columns = [
    {
      field: 'direction',
      headerName: 'Direction',
      width: 120
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
      field: 'datetime',
      headerName: 'Opened',
      width: 180
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
      <Grid
        textAlign={'left'}
      >
        <Typography
          // variant="h6"
          component="span"
        >
          Positions
        </Typography>
      </Grid>
      <DataGrid
        rows={positions}
        columns={columns}
        showColumnVerticalBorder={false}
        hideFooter={true}
      />
      
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