import { 
  Box,
  Typography,
  Grid
} from '@mui/material';
import { textAlignRight, orderStatusMap, toLocalDateTimeStr } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext, type IOrder } from '../contexts/AppContext';
import { useEffect, useMemo, useState } from 'react';


export const Orders = ({persona}) => {
  const { ordersRef, timezone } = useAppContext();
  // const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;
  
  const [orderList, setOrderList] = useState<IOrder[]>([]);



  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      width: 60
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 80
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
      field: 'openTimestamp',
      headerName: 'Opened',
      valueFormatter: (param: string) => toLocalDateTimeStr(param, timezone),
      width: 180,
      
    },
    {
      field: 'status',
      headerName: 'Status',
      valueFormatter: (param: string) => orderStatusMap[param],
      width: 60
    },
    {
      field: 'price',
      headerName: 'Price',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      valueFormatter: (param: number) => param.toFixed(2),
      width: 80,
    },
  ];

  useEffect(() => {
    let prevOrders: IOrder[] = [];
    const updateOrdersInterval = setInterval(() => {
      
        if (persona in ordersRef.current) {
          const newOrders = Object.values(ordersRef.current[persona]);
          
          const changed = newOrders.length !== prevOrders.length ||
            newOrders.some((o, i) => o.id !== prevOrders[i]?.id || o.status !== prevOrders[i]?.status);

          if (changed) {
            prevOrders = newOrders;
            setOrderList(newOrders);
          }
        }
        
      }, 1000);

      return () => {
        clearInterval(updateOrdersInterval);
      };

  }, [ordersRef]);

  console.log("RERENDER ORDERS");

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
        rows={orderList}
        columns={columns}
        hideFooter={true}
        rowCount={2}
        rowHeight={60}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            background: '#181818',
          },
          background: '#181818',
          height: 180,
          width: '100%'
        }}
      />
    </Box>
  );
}