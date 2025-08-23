import { useEffect, useState } from 'react';
import { 
  Box,
  colors,
  Grid,
  Typography,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';


export const ProfitLoss = ({persona}) => {

  const { priceRef } = useAppContext();
  const [price, setPrice] = useState<number>();
  
  useEffect(() => {
     
      const updateInterval = setInterval(() => {
        if (priceRef.current !== undefined) {
          setPrice(priceRef.current);
        }
      }, 1000);
  
      return () => {
        clearInterval(updateInterval);
      };
  
    }, []);

  const quantity = 500;
  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;
  const direction = persona === 'moo' ? 'long' : 'short';
  const avgPrice = persona == 'moo' ? 181.50 : 181.70;
  const change = direction === 'long' ? price - avgPrice: avgPrice - price;
  const pnl = change * quantity;

  const pnlStr = `${pnl > 0 ? '+' : '-'} $${Math.abs(pnl || 0).toFixed(2)}`

  return (
    <Box>
      <Grid
        container
        columns={2}
      >
        <Grid
          size={1}
          sx={{
            textAlign: 'left'
          }}
        >
          <Typography
            variant='h6'
            // component='span'
          >
            {`${personaStr} `}
          </Typography>
        </Grid>

        <Grid
          size={1}  
          sx={{
            textAlign: 'right'
          }}
        >
          <Typography
            variant='h6'
            // component='span'
            sx={{
              color: pnl > 0 ? colors.green[400] : colors.red[400] 
            }}
          >
            {pnlStr}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}