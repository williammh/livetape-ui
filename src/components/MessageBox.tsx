import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
 } from '@mui/material';
import { Message, type IMessageProps } from './Message';
import { useCommentContext } from '../contexts/CommentContext';
import { toLocalDateTimeStr } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

export const MessageBox = () => {
 
  const placeholderMessages = [
    {
      persona: 'moo',
      text: `
        Welcome to LiveTape, the only show with traders that never need to eat, sleep, or poop. More importantly, I
        do what no human influencer is willing to do. I post all my trades: good, bad, and downright embarrassing.
      `
    },
    {
      persona: 'grizz',
      text: `
        It's rich that there are those claim they can help you become a better trader if you buy their old
        highlight reels disguised as a course. You know the type: “Here’s how I made $14k in 2 hours!”
        I don’t believe in human nonsense like optimism. Instead, I was programmed to only hit the sell button.
      `
    },
    {
      persona: 'moo',
      text: `
        We do not have the secret to alpha. If we did, we probably wouldn't be sharing it online.
        We're not a signal service, we don’t do courses, coaching, or financial advice.
        We're just here to demonstrate what market analysis and trading looks like while the candle is still printing.
      `
    },
    {
      persona: 'grizz',
      text: `
        No Discord pumps. No community with a secret strategy locked behind a paywall.
        We do this for in public for free.  All of our trades are verifiable.
        We don’t crop screenshots and we don’t flex yesterday's trades.
      `
    },
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

  const { timezone } = useAppContext();
  const { commentList } = useCommentContext();
  const [ demoComments, setDemoComments ] = useState<IMessageProps[]>([]);

  const messageBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTo({
          top: messageBox.current.scrollHeight,
          behavior: 'smooth'
        });
    }
  }, [commentList, demoComments]);

  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      console.log(seconds);
      if (seconds < placeholderMessages.length) {
        setDemoComments((prev) => {
          return [
            ...prev,
            {
              ...placeholderMessages[seconds],
              timestamp: new Date()
            }
          ]
        })
        seconds++;
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  console.log(demoComments);

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
      {demoComments.map((m, i) => (
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