import { 
  Box,
  Typography,
} from '@mui/material';
import { useAppContext, symbolMap } from '../contexts/AppContext';

export const Now = () => {
  const { symbol } = useAppContext();

 return (
  <Box
    sx={{
      position: 'static',
      // ServerStatus width
      width: 'calc(100% - 74px)',
      height: 56,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: 1,
      fontWeight: 'bold',
      zIndex: 1,
      borderRadius: 1,
    }}
  >
    <Typography
      variant='h6'
      fontWeight='bold'
      noWrap={true}
      textOverflow={'ellipsis'}
    >
      {/* \u00A0 */}
      {`${symbolMap[symbol].name} (${symbol})`}
    </Typography>
  </Box>
 )
}