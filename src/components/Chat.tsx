import { Box, Card } from '@mui/material';
import { GrizzMessage } from './GrizzMessage';
import { MooMessage } from './MooMessage';


export const Chat = () => {
  const messages = [
    {
      user: 'Moo',
      message: `
        I’m Moo. I trade long-only. Every day, I analyze live market data and post my trades as they happen — win or lose.
        No hindsight, no emotional drama, no “just missed this one.” This isn’t a highlight reel. It’s the raw tape.
        We built Livetape because we were tired of finance content that only teaches after the fact.
        If you want reminders when we’re live, toss in your email. We’ll never sell it, never spam you, and never fake a win.
      `
    },
    {
      user: 'Grizz',
      message: `
        I’m Grizz. I go short. I also go off on fake gurus who don’t trade live but sell you their recycled garbage anyway.
        If their strategy’s so good, why is it only on a course? Why do their trades only show up after they win?
        At Livetape, we post our entries before they fill. We don’t cherry-pick, we don’t flex, and we don’t beg for followers.
        If you want to know what we’re running next — or which influencer’s strategy we’ll be testing live — throw in your email. Or don’t.
        We’re still running the tape.
      `
    },
    {
      user: 'Moo',
      message: `
        Let’s be clear:
        We’re not a signal service.
        We’ll never tell you how to spend your money.
        We don’t sell courses, PDFs, or masterminds.
        We’re an edutainment show — think of it like market MythBusters.
        We trade live. Win or lose, the tape is the tape.
        You’ll see it before it happens, not after it’s been cherry-picked.
        We’re here to teach through example — not “backtest theater.”
        If you enjoy what we do, we offer a paid version with extra features (like real-time trade details).
        That helps keep our servers alive — built and run by one developer with way too much caffeine.
      `
    },
    {
      user: 'Grizz',
      message: `
      No signals. No Discord pumps. No course with my face on it.
      This isn’t some guru hustle — it’s Livetape.

      We do this for free because we’re sick of the highlight-reel clowns.
      You know the type:

      “Here’s how I made $14k in 2 hours!”
      Cool. Where’s the entry, genius? Oh right — deleted stories and post-win edits.
      `
    },
    {
      user: 'Moo',
      message: `
        Yeah, it’s paper trading—but think of it like the practice rounds before the big fight. No risk, all the lessons.
        We’re here to teach, entertain, and keep it real. We’re not a hedge fund or financial advisor, just
        two voices breaking down the market live for everyone to see. If that’s what you want, you’re in the right place. Otherwise, good luck out there!”
      `
    },
    {
      user: 'Grizz',
      message: `
        Ohh, you caught us, genius. Yeah, we’re just a couple of bots running a show, not your personal hedge fund.
        If you want a money manager, go find one—preferably one who doesn’t post highlight reels and actually puts skin in the
        game. Meanwhile, we’ll be here teaching, entertaining, and calling out the frauds.
      `
    }
  ]

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%'
      }}
    >
      {messages.map(m => (
        m.user == 'Moo' ? <MooMessage message={m.message} /> : <GrizzMessage message={m.message} />
      ))}
    </Box>  
  );
}