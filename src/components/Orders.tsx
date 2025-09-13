import { 
  Box,
} from '@mui/material';
import { textAlignRight, orderStatusMap, toLocalDateTimeStr } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext, type IOrder } from '../contexts/AppContext';
import { useEffect, useState } from 'react';


export const Orders = ({persona}) => {
  const { ordersRef, timezone } = useAppContext();  
  const [orderList, setOrderList] = useState<IOrder[]>([]);

  const columns = [
    {
      field: 'action',
      headerName: 'Order',
      flex: 1,
      minWidth: 60
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 60
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName:
      textAlignRight,
      flex: 1,
      minWidth: 40
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      flex: 1,
      minWidth: 80
    },
    {
      field: 'openTimestamp',
      headerName: 'Opened',
      valueFormatter: (param: string) => toLocalDateTimeStr(param, timezone),
      flex: 2,
      minWidth: 120
    },
    {
      field: 'status',
      headerName: 'Status',
      valueFormatter: (param: string) => orderStatusMap[param],
      flex: 1, minWidth: 60
    },
    {
      field: 'price',
      headerName: 'Price',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      valueFormatter: (param: number) => param.toFixed(2),
      flex: 1,
      minWidth: 80
    }
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

  const fontSize = 18

  return (
      <Box
        sx={{
          marginTop: 1,
          width: '100%'
        }}
      >      
        <DataGrid
          rows={orderList}
          columns={columns}
          hideFooter={true}
          rowHeight={56}
          scrollbarSize={0}
          sx={{
            backgroundColor: '#202020',
            // TODO: style scrollbars when screen width is too small instead of hiding
              '& .MuiDataGrid-scrollbar--horizontal': {
              overflowX: 'hidden',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#202020',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
            },
            '& .MuiDataGrid-filler': {
              backgroundColor: '#202020',
            },
            fontSize: fontSize ,
            border: 'unset',
            height: 192,
            width: '100%',
            padding: 1,
            
          }}
        />
      </Box>

  );
}