import {
  useEffect,
  useState,
  useRef
} from 'react';
import { 
  Box,
} from '@mui/material';
import { textAlignRight, orderStatusMap, toLocalDateTimeStr } from '../util/misc';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext, type IOrder } from '../contexts/AppContext';


export const Orders = ({persona}) => {
  const { ordersRef, timezone } = useAppContext();  
  const [orderList, setOrderList] = useState<IOrder[]>([]);

  const columns = [
    {
      field: 'action',
      headerName: 'Order',
      width: 80,
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 60
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName:
      textAlignRight,
      width: 60,
      minWidth: 60
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      // flex: 1,
      width: 80,
      minWidth: 80
    },
    {
      field: 'openTimestamp',
      headerName: 'Opened',
      valueFormatter: (param: string) => toLocalDateTimeStr(param, timezone),
      // flex: 2,
      width: 240,
      minWidth: 240,
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   valueFormatter: (param: string) => orderStatusMap[param],
    //   minWidth: 60
    // },
    {
      field: 'price',
      headerName: 'Filled',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      valueFormatter: (param: number) => `${param.toFixed(2)} USD`,
      flex: 1,
      minWidth: 140
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

  const orderBoxRef = useRef<HTMLDivElement>(null);

  return (
      <Box
        ref={orderBoxRef}
        sx={{
          marginTop: 1,
          width: '100%'
        }}
      >      
        <DataGrid
          rows={orderList}
          columns={columns}
          columnVisibilityModel={{
            action: true,
            type: orderBoxRef?.current?.offsetWidth > 440,
            symbol: true,
            quantity: orderBoxRef?.current?.offsetWidth > 380,
            openTimestamp: orderBoxRef?.current?.offsetWidth > 760,
            price: true
          }}
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
            fontSize: 18,
            border: 'unset',
            height: 128,
            width: '100%',
            padding: 1,
            
          }}
        />
      </Box>

  );
}