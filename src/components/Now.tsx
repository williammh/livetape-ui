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
      width: '100%',
      height: 56,
      backgroundColor: '#202020',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      fontWeight: 'bold',
      zIndex: 1,
      borderBottom: '1px solid #444',
      justifyContent: 'center',
      borderRadius: 1,
    }}
  >
    <Typography
      variant='h6'
      fontWeight='bold'
      noWrap={true}
      textAlign={'center'}
    >
      {/* \u00A0 */}
      {`${symbolMap[symbol].name}`}
    </Typography>
  </Box>
 )
}