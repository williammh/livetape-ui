import { useEffect, useState } from 'react';
import { 
  Box,
  colors,
  Table,
  TableBody,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useAppContext, replayPositionsDateMap, type IPosition } from '../contexts/AppContext';
import nVda20250815positions from '../assets/NVDA.2025-08-15.positions.json';
import { textAlignRight, orderStatusMap, toLocalDateTimeStr, greenOrRed } from '../util/misc';


export const Positions = ({persona}) => {
  const { priceRef, timestampRef, positionsRef, timezone } = useAppContext();

  const openDateTime = new Date();
  openDateTime.setHours(13);
  openDateTime.setMinutes(30);
  openDateTime.setSeconds(0);

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
        console.log(list);
        setPositionList(list);


      } else if (!(persona in positionsRef.current)) {
        setPositionList([]);
      }
   
    }, 1000);

    return () => {
      clearInterval(updatePositionsInterval);
    };

  }, [positionsRef]);

  const columns = [
    {
      field: 'direction',
      headerName: 'Position',
      // flex: 1,
      minWidth: 60
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName:
      textAlignRight,
      // flex: 1,
      minWidth: 60,
      width: 60,
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
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

  const rowHeight = 56
  const fontSize = 18

  const cellStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: fontSize,
    padding: '0px 16px',
    height: rowHeight
  }

  return (
    <Box
      sx={{
        height: '100%'
      }}
    >
      <DataGrid
        rows={postionList}
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
          height: 180,
          width: '100%',
          padding: 1,
          
        }}
      />
    </Box>
  );
}
