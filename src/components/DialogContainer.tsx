import { useEffect, useState, forwardRef } from 'react';
import { 
  Dialog,
  DialogContent,
  Avatar,
  colors,
  Typography,
  Box,
  Slide
} from '@mui/material';
import moo from '../assets/moo.png';
import grizz from '../assets/grizz.png';
import { type TransitionProps } from '@mui/material/transitions';

import { useAppContext } from '../contexts/AppContext';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const DialogContainer = () => {
  const {replayDate, isServerOnlineRef } = useAppContext();
  
  const [mooMessage, setMooMessage] = useState<string>('');
  const [grizzMessage, setGrizzMessage] = useState<string>('');

  const displayDialog = (
    persona: string,
    text: string,
    delay: number = 0,
    duration: number = 5000
  ) => {
    switch (persona) {
      case 'moo':
        setTimeout(() => {
          setMooMessage(text);
          setTimeout(() => {
            setMooMessage('');
          }, duration);
        }, delay);
        break;
      case 'grizz':
        setTimeout(() => {
          setGrizzMessage(text);
          setTimeout(() => {
            setGrizzMessage('');
          }, duration);
        }, delay);
        break;
    }
  };

  useEffect(() => {
    if (replayDate !== '' && isServerOnlineRef.current === false) {
      displayDialog('moo', "Our servers are undergoing maintenance. Thanks for your patience.", 0);
      displayDialog('grizz', "We'll be online shortly. Meanwhile, here's a replay of some old tape.", 500);
    }
  }, [replayDate]);

  const dialogStyles = {
    height: 56,
    width: 740
  }

  return (
    <>
    {/* Moo */}
      <Dialog
        open={mooMessage.length > 0}
        onClose={() => {
          setMooMessage('');
          setGrizzMessage('');
        }}
        hideBackdrop={true}
        maxWidth={false}
        slots={{
          transition: Transition,
        }}
      >
        <DialogContent>
          <Box
            sx={dialogStyles}
          >
            <Avatar
                src={moo}
                sx={{
                  height: 56,
                  width: 56,
                  bgcolor: colors.green[400],
                  display: 'inline-block'
                }}
              />
              <Typography
                variant='h6'
                component={'span'}
                lineHeight={'56px'}
                height={'56px'}
                paddingLeft={2}

                sx={{
                  verticalAlign: 'top'
                }}
              >
                {mooMessage}
              </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Grizz */}
      <Dialog
        open={grizzMessage.length > 0}
        onClose={() => {
          setMooMessage('');
          setGrizzMessage('');
        }}
        hideBackdrop={true}
        maxWidth={false}
        slots={{
          transition: Transition,
        }}
        sx={{
          // dialog and padding
          top: 96 + 32 + 32 + 56
        }}
      >
        <DialogContent>
          <Box
            sx={dialogStyles}
          >
            <Avatar
                src={grizz}
                sx={{
                  height: 56,
                  width: 56,
                  bgcolor: colors.red[400],
                  display: 'inline-block'
                }}
              />
              <Typography
                variant='h6'
                component={'span'}
                lineHeight={'56px'}
                height={'56px'}
                paddingLeft={2}
                sx={{
                  verticalAlign: 'top'
                }}
              >
                {grizzMessage}
              </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}