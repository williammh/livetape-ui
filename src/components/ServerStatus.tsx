import { useEffect, useState } from 'react';
import { 
  colors,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { CheckCircle, Cancel } from '@mui/icons-material';

export const ServerStatus = () => {
  const {isServerOnlineRef } = useAppContext();
  
    const [isOnline, setIsOnline] = useState<boolean>(false);
  
    useEffect(() => {
      const updateInterval = setInterval(() => {
        setIsOnline(isServerOnlineRef.current);
      }, 1000);

      return () => {
        clearInterval(updateInterval);
      };
    }, []);

  return (
    <Box
      sx={{
        height: 40,
        width: 'fit-content',
        padding: '0px 8px',
        border: `1px solid ${isOnline ? colors.green[400] : colors.grey[600]}`,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        float: 'right'
      }}
    >
      <Typography
        variant='body1'
        component='span'
        height='40px'
        lineHeight={'40px'}
        display={'inline-block'}
        color={isOnline ? colors.green[400] : colors.grey[600]}
      >
        Server
      </Typography>
      {isOnline ? (
        <CheckCircle
          sx={{
            color: colors.green[400],
          }}
        /> 
      ) : (
        <Cancel
           sx={{
            color: colors.grey[600],
          }}
        />
      )}
    </Box>
  );
}