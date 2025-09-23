import {
  useEffect,
  useState,
  useRef
} from 'react';
import {
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext, type IPosition } from '../contexts/AppContext';
import { textAlignRight, greenOrRed } from '../util/misc';

export const Positions = ({persona}) => {
  const { priceRef, positionsRef } = useAppContext();

  const openDateTime = new Date();
  openDateTime.setHours(13);
  openDateTime.setMinutes(30);
  openDateTime.setSeconds(0);

  const columns = [
    {
      field: 'direction',
      headerName: 'Position',
      width: 80,
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName:
      textAlignRight,
      minWidth: 60,
      width: 60,
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 80,
      minWidth: 80
    },
    // {
    //   field: 'openTimestamp',
    //   headerName: 'Opened',
    //   valueFormatter: (param: string) => toLocalDateTimeStr(param, timezone),
    //   // flex: 2,
    //   width: 100,
    //   minWidth: 100
    // },
    {
      field: 'averagePrice',
      headerName: 'Avg Price',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      valueFormatter: (param: number) => `${param?.toFixed(2)} USD`,
      flex: 1,
      minWidth: 140
    },
     {
      field: 'change',
      headerName: 'Change',
      headerAlign: 'right',
      cellClassName: (params) => greenOrRed(params) + ' MuiDataGrid-cell--textRight',
      valueFormatter: (param: number) => `${param > 0 ? '+' : ''}${param?.toFixed(2)} USD`,
      flex: 1,
      minWidth: 140
    },
    {
      field: 'pnl',
      headerName: 'P/L',
      headerAlign: 'right',
      cellClassName: (params) => greenOrRed(params) + ' MuiDataGrid-cell--textRight',
      valueFormatter: (param: number) => `${param > 0 ? '+' : ''}${param?.toFixed(2)} USD`,
      flex: 1,
      minWidth: 140
    }
  ];

  const [postionList, setPositionList] = useState<IPosition[]>([]);
  
  useEffect(() => {
    const updatePositionsInterval = setInterval(() => {
      if (persona in positionsRef.current) {
        // TODO: only update if changed
        //   const changed = newOrders.length !== prevOrders.length ||
        //     newOrders.some((o, i) => o.id !== prevOrders[i]?.id || o.status !== prevOrders[i]?.status);

        const positions = Object.values(positionsRef.current[persona]);

        const list = positions.map(pos => {
          const change = priceRef.current - pos.averagePrice;
          const pnl = change * pos.quantity * (pos.direction === 'Long' ? 1 : -1);
          return {
            ...pos,
            change: change,
            pnl: pnl
          }
        });
        setPositionList(list);


      } else if (!(persona in positionsRef.current)) {
        setPositionList([]);
      }
   
    }, 1000);

    return () => {
      clearInterval(updatePositionsInterval);
    };

  }, [positionsRef]);

  const positionBoxRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={positionBoxRef}
      sx={{
        height: '100%'
      }}
    >
      <DataGrid
        rows={postionList}
        columns={columns}
        columnVisibilityModel={{
          direction: true,
          quantity: positionBoxRef?.current?.offsetWidth > 400,
          symbol: true,
          averagePrice: positionBoxRef?.current?.offsetWidth > 640,
          change: positionBoxRef?.current?.offsetWidth > 520,
          pnl: true
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
