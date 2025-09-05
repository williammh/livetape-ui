import { 
  Box,
} from '@mui/material';
import { textAlignRight, orderStatusMap, toLocalDateTimeStr } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext, type IOrder } from '../contexts/AppContext';
import { useEffect, useMemo, useState } from 'react';


export const Orders = ({persona}) => {
  const { ordersRef, timezone } = useAppContext();  
  const [orderList, setOrderList] = useState<IOrder[]>([]);

  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      width: 80
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
      width: 80
    },
    {
      field: 'price',
      headerName: 'Price',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      valueFormatter: (param: number) => param.toFixed(2),
      flex: 1,
      minWidth: 80, 
      
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
  return (
      <Box
        sx={{
          marginTop: 1,
          position: 'relative',
          width: '100%'
        }}
      >      
        {/* Fake group header */}
        <Box
          sx={{
            position: 'static',
            width: '100%',
            height: 56,
            backgroundColor: '#202020',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
            padding: '16px',
            fontWeight: 'bold',
            zIndex: 1,
            borderBottom: '1px solid #444'
          }}
        >
          Orders
        </Box>

        {/* Actual DataGrid with top padding to not overlap group header */}
        <Box>
          <DataGrid
            rows={orderList}
            columns={columns}
            hideFooter={true}
            rowCount={1}
            rowHeight={56}
            sx={{
              fontWeight: 'bold',
              border: 'unset',
              backgroundColor: '#202020',
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#202020',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-filler': {
                backgroundColor: '#202020',
              },
              height: '100%',
              width: '100%',
              padding: 1,

            }}
          />
        </Box>
      </Box>


  );
}