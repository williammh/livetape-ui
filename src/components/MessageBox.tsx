import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
 } from '@mui/material';
import { Message, type IMessageProps } from './Message';
import { useAppContext, replayCommentsDateMap } from '../contexts/AppContext';

export const MessageBox = () => {
 
  const { symbol, replayDate, timestampRef, messageListRef, positionsRef } = useAppContext();
  const [ messageList, setMessageList] = useState<IMessageProps[]>([]);
  const messageBox = useRef<HTMLDivElement>(null);
  const positionsAppended = useRef(new Set());

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
          top: messageBox.current.scrollHeight,
          behavior: 'smooth'
        });
    }
  }, [messageList.length]);

  useEffect(() => {
    if (replayDate) {

      // load historic comments
      const replayCommentQueue = [...replayCommentsDateMap[symbol][replayDate]];  
    
      const interval = setInterval(() => {
        
        if (timestampRef.current >= replayCommentQueue[0]?.timestamp) {
          const comment = replayCommentQueue.shift();
          console.log(comment);
        
          setMessageList((prev) => {
            const nextMessageList = [...prev, comment];
            return nextMessageList;
          });
        }

        for (let account in positionsRef?.current) {          
          const positions = positionsRef.current[account];
          for (let id in positions) {
            const pos = positions[id];
            if(timestampRef.current >= pos.openTimestamp && !(positionsAppended.current.has(id))) {
              const persona = `${pos.account?.[0].toUpperCase()}${pos.account?.slice(1)}`;
              
              const systemComment = {
                persona: 'system',
                text: `${persona} enters ${pos.direction.toUpperCase()} ${pos.quantity} ${pos.symbol} at ${(pos.averagePrice as number).toFixed(2)} USD`,
                timestamp: pos.openTimestamp
              };
              positionsAppended.current.add(id);
              setMessageList((prev) => {
                const nextMessageList = [...prev, systemComment];
                return nextMessageList;
              });
            }
          }
        }

        
      }, 1000);
  
      return () => {
        setMessageList([]);
        clearInterval(interval);
      };
    
    // live or delayed data
    } else {
      setMessageList([...messageListRef.current]);
      const interval = setInterval(() => {
        if (messageListRef?.current.length !== messageList.length) {
          setMessageList(messageListRef.current);
        }

      }, 1000);
  
      return () => {
        setMessageList([]);
        clearInterval(interval);
      };

    }

  }, [replayDate, messageListRef.current.length, positionsRef.current, positionsAppended.current]);

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