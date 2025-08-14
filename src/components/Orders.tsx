import { 
  Box,
  Typography,
  Grid
} from '@mui/material';
import { toLocalDateTimeStr } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';
import { textAlignRight } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';


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
  const { timezone } = useAppContext();
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
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 40
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 80
    },
    {
      field: 'datetime',
      headerName: 'Opened',
      width: 200
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80
    },
    {
      field: 'price',
      headerName: 'Price',
      headerAlign: 'right',
      cellClassName: textAlignRight,
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
      datetime: toLocalDateTimeStr(new Date(), timezone),
    },
    {
      id: 1,
      action: 'Buy',
      type: 'Stop',
      quantity: 1,
      symbol: 'NVDA',
      price: `${(29600.5).toFixed(2)}`,
      status: 'Open',
      datetime: toLocalDateTimeStr(new Date(), timezone),
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