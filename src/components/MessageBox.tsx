import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
 } from '@mui/material';
import { Message, type IMessageProps } from './Message';
import { toLocalDateTimeStr } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';
import comments from '../assets/NVDA.2025-08-15.comments.json';


export const MessageBox = () => {
 
  const placeholderMessages = [
    {
      persona: 'moo',
      text: `
        We paper trade but on live data when it's still possible to be wrong.
        That's more risk than those who only post their takes after it's already safe.
        The market move was confirmed but their trades are not.
      `
    },
    {
      persona: 'grizz',
      text: `
        We're not trading real money? Ohh, you caught us, genius. Yeah, we’re just a couple of robots running a show, not managing your grandma's 401(k).
        If you want a money manager, go find one. If you want to know what we’re up to next — throw in your email. Or don’t.
      `
    },
    {
      persona: 'moo',
      text: `
        What Grizz is trying to say is if you want occasional reminders when we’re live,
        toss in your email. We’ll never sell it, never spam, and we certainly won't ever send you an end of day market recap
        with our best moves.
      `
    },
    {
      persona: 'grizz',
      text: `
        If you really enjoy what we do, we also offer a paid service with real-time market data and more.
        It helps keep our servers alive — built and run by a sole developer with way too much caffeine.
      `
    },
  ]

  const { commentList, replayDate, timestampRef } = useAppContext();
  const [ replayComments, setReplayComments ] = useState<IMessageProps[]>([]);

  const messageBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
          top: messageBox.current.scrollHeight,
          behavior: 'smooth'
        });
    }
  }, [commentList, replayComments]);

  useEffect(() => {
   

    const interval = setInterval(() => {

      if (timestampRef.current >= comments[0]?.timestamp) {
      
        const comment = comments.shift();
        setReplayComments((prev) => {
          return [...prev, comment];
        })
      }
      
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [replayDate]);

  // useEffect(() => {
  //   let seconds = 0;
  //   const interval = setInterval(() => {
  //     if (commentList.length > 0) {
  //       clearInterval(interval);
  //       return;
  //     };
  //     if (seconds < placeholderMessages.length) {
  //       setDemoComments((prev) => {
  //         return [
  //           ...prev,
  //           {
  //             ...placeholderMessages[seconds],
  //             timestamp: new Date()
  //           }
  //         ]
  //       })
  //       seconds++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 4000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  // console.log(replayComments);

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
      {replayComments.map((m, i) => (
        <Message
          persona={m.persona}
          text={m.text}
          timestamp={m.timestamp}
        />
      ))}
      {commentList.map((m, i) => (
        <Message
          persona={m.persona}
          text={m.text}
          timestamp={m.timestamp}
        />
      ))}
    </Box>  
  );
}