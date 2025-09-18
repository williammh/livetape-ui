import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
 } from '@mui/material';
import { Message, type IMessageProps } from './Message';
import { useAppContext } from '../contexts/AppContext';

export const MessageBox = () => {
 
  const {messageListRef } = useAppContext();
  const [ messageList, setMessageList] = useState<IMessageProps[]>([]);
  const messageBox = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    setMessageList([...messageListRef.current]);
  }, []);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
          top: messageBox.current.scrollHeight,
          behavior: 'smooth'
        });
    }
  }, [messageList.length]);

  useEffect(() => {
    
    const interval = setInterval(() => {
      if (messageListRef?.current.length !== messageList.length) {
        setMessageList([...messageListRef.current]);
      }
      
    }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, [messageList]);



  return (
    <Box
      sx={{

        overflowY: 'scroll',
        height: '100%',

        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'end',

        // Custom scrollbar styles inline
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#1a1a1a',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(135deg, #424242 0%, #616161 100%)',
          borderRadius: '4px',
          border: '1px solid #2a2a2a',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #616161 0%, #757575 100%)',
            boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
          }
        },
        scrollbarWidth: 'thin',
        scrollbarColor: '#424242 #1a1a1a',
      }}
      ref={messageBox}
    >
      {messageList.map((m, i) => (
        <Message
          key={i + m.persona}
          persona={m.persona}
          text={m.text}
          timestamp={m.timestamp}
        />
      ))}
    </Box>  
  );
}