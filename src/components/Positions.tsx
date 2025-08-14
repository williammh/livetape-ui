import { 
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toLocalDateTimeStr } from '../util/misc';
import { textAlignRight } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

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
  const { timezone } = useAppContext();
  

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const columns = [
    {
      field: 'direction',
      headerName: 'Direction',
      headerAlign: 'left',
      width: 120,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 40,
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      headerAlign: 'left',
      width: 80
    },
    {
      field: 'datetime',
      headerName: 'Opened',
      headerAlign: 'left',
      width: 200
    },
    {
      field: 'average',
      headerName: 'Avg',
      headerAlign: 'right',
      cellClassName: textAlignRight,
      width: 80

    },
    {
      field: 'pnl',
      headerName: 'P/L',
      headerAlign: 'right',
      cellClassName: textAlignRight,
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
      datetime: toLocalDateTimeStr(new Date(), timezone),
    }
  ];

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
    </Box>
  );
}