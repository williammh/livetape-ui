import { useEffect, useState } from 'react';
import { 
  Box,
  colors,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';

export const ProfitLoss = ({persona}) => {

  const { priceRef, positionsRef, replayDate } = useAppContext();

  const [price, setPrice] = useState<number>();
  const [accountValue, setAccountValue] = useState<number>();

  const beginningOfDayBalance = 50000;

  
  useEffect(() => {
     
      const updateInterval = setInterval(() => {
        if (priceRef.current !== undefined) {
          setPrice(priceRef.current);
        }

        if (positionsRef.current?.[persona]) {
          const position = Object.values(positionsRef.current[persona])[0];
          if (position) {
            const quantity = position.quantity;
            const direction = position.direction;
            const avgPrice = position.averagePrice;
            const change = direction === 'Long' ? price - avgPrice : avgPrice - price;
            const unrealizedPNL = change * quantity;
            const accountValue = beginningOfDayBalance + unrealizedPNL;
  
            setAccountValue(accountValue);
          }
        }

      }, 1000);
  
      return () => {
        clearInterval(updateInterval);
      };
  
    }, [price, positionsRef]);

  const rows = [
    {
      name: 'Beginning of Day',
      value: beginningOfDayBalance,

    },
    {
      name: 'Account Value',
      value: accountValue,
    },
    {
      name: 'Realized P/L',
      value: 0,
    },
  ]

 
  return (
    <Box
      sx={{
        width: '100%',
        paddingRight: 1
      }}
    > 
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 'bold'
        }}
      >
        +0.00 USD
      </Typography>
     
    </Box>
  );
}