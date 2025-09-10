import { useEffect, useState } from 'react';
import { 
  colors,
  Chip,
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
    <Chip
      variant={'outlined'}
      label={'Server'}
      icon={isOnline ? <CheckCircle /> : <Cancel />}
      color={isOnline ? "success": colors.grey[600]}
      sx={{
        fontSize: 18,
        color: isOnline ? colors.green[400] : colors.grey[600]
      }}
    />
  );
}