import { 
  Box,
  Typography,
  Grid
} from '@mui/material';
import { toLocalTime } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';


interface IOrder {
  id: number;
  action: string;
  type: string;
  quantity: number;
  symbol: string;
  price: number;
  status: string;
  datetime: string;
}

export const Orders = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      width: 60
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 60
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
      field: 'status',
      headerName: 'Status',
      width: 80
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 80,
    },
  ];

  const orders = [
    {
      id: 0,
      action: 'Buy',
      type: 'Limit',
      quantity: 1,
      symbol: 'NVDA',
      price: `${(29534.5).toFixed(2)}`,
      status: 'Open',
      datetime: toLocalTime(new Date(), 'America/Los_Angeles'),
    },
    {
      id: 1,
      action: 'Buy',
      type: 'Stop',
      quantity: 1,
      symbol: 'NVDA',
      price: `${(29600.5).toFixed(2)}`,
      status: 'Open',
      datetime: toLocalTime(new Date(), 'America/Los_Angeles'),
    }
  ]

  return (
    <Box>
      <Grid
        textAlign={'left'}
      >
        <Typography
          // variant="h6"
          component="span"
        >
          Orders
        </Typography>
      </Grid>
      <DataGrid
        rows={orders}
        columns={columns}
        showColumnVerticalBorder={false}
        hideFooter={true}
      />
    </Box>
  );
}