import { useEffect, useState } from 'react';
import { 
  colors,
  Box,
  Typography,
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { Cloud, CloudOff } from '@mui/icons-material';

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
        height: 56,
        width: 74,
        padding: '0px 8px',
        border: `1px solid ${isOnline ? colors.green[400] : colors.grey[700]}`,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        float: 'right'
      }}
    >
      <Typography
        variant='body1'
        component='span'
        height='40px'
        lineHeight={'40px'}
        display={'inline-block'}
        color={isOnline ? colors.green[400] : colors.grey[700]}
        fontWeight='bold'
        sx={{
          marginRight: 1,
        }}
      >
        {isOnline ? 'On' : 'Off'}
      </Typography>
      {isOnline ? (
        <Cloud
          sx={{
            color: colors.green[400],
          }}
        /> 
      ) : (
        <CloudOff
           sx={{
            color: colors.grey[700],
          }}
        />
      )}
    </Box>
  );
}