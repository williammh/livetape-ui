import { Box, Card } from '@mui/material';
import { GrizzMessage } from './GrizzMessage';
import { MooMessage } from './MooMessage';


export const Chat = () => {
  const messages = [
    {
      user: 'Moo',
      message: `
        I’m Moo. I trade every day the market is open and post all my trades: good, bad, and embarrassing. We built LiveTape because we were tired of finance content that only
        teaches after the fact. However, we're not a signal service, we don’t do courses, coaching, or financial advice.
        We’re just here to trade and say things while candles do candle things.
      `
    },
    {
      user: 'Grizz',
      message: `
        I’m Grizz. I go short. I think it's rich that there are those claim they can help you become a better trader if you buy their course — often just their old
        highlight reels in disguise. You know the type: “Here’s how I made $14k in 2 hours!”
        Cool. Where's your live stream so we can watch you do that again while the candle is still printing?
      `
    },
    {
      user: 'Moo',
      message: `
        We do not have the secret to alpha. If we did, we probably wouldn't be sharing it online.
        We're just here to demonstrate what market analysis and trading looks like when it's still possible to be wrong,
        and entertain along the way.
      `
    },
    {
      user: 'Grizz',
      message: `
        No Discord pumps. No community with a secret strategy locked behind a paywall.
        We do this for in public for free.  All of our trades are verifiable.
        We don’t crop screenshots, we don’t flex, and we don’t beg for followers.
      `
    },
    {
      user: 'Moo',
      message: `
        We paper trade but even though there's no money,
        we're still risking more than those who only post their takes after it's already safe.
        The market move was confirmed but their trades are not.
      `
    },
    {
      user: 'Grizz',
      message: `
        We're not trading real money? Ohh, you caught us, genius. Yeah, we’re just a couple of robots running a show, not managing your grandma's 401(k).
        If you want a money manager, go find one. If you want to know what we’re up to next — or which influencer’s strategy we’ll be debunking live — throw in your email. Or don’t.
      `
    },
    {
      user: 'Moo',
      message: `
        What Grizz is trying to say is if you want occasional reminders when we’re live,
        toss in your email. We’ll never sell it, never spam, and we certainly won't ever send you an end of day market recap
        with our best moves.
      `
    },
    {
      user: 'Grizz',
      message: `
        If you really enjoy what we do, we also offer a paid service with features like real-time trade details and customizable symbols.
        It helps keep our servers alive — built and run by a sole developer with way too much caffeine.
      `
    },
  ]

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%'
      }}
    >
      {messages.map((m, i) => (
        m.user == 'Moo' ? <MooMessage message={m.message} key={i} /> : <GrizzMessage message={m.message} key={i} />
      ))}
    </Box>  
  );
}