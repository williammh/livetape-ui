import {
  useState,
  useEffect,
} from 'react';
import { 
  Box,
  Typography,
} from '@mui/material';
import { useSharedWebSocket } from '../WebSocketContext';

export const StatusBar = () => {
  const { message } = useSharedWebSocket();
  const [timestamp, setTimeStamp] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    switch(message.type) {
      case 'open_bar':
        setTimeStamp(message.data['current_datetime']);
        setPrice(message.data['close'])
        break;
    }

  }, [message]);

  return (
    <Box>
        <Typography>
          Timestamp: {timestamp}, Price: {price}
        </Typography>
    </Box>
  );
}