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
  
  const [mooOpen, setMooOpen] = useState<boolean>(false);
  const [grizzOpen, setGrizzOpen] = useState<boolean>(false);


  useEffect(() => {
    if (replayDate !== '' && isServerOnlineRef.current === false) {
      setMooOpen(true);
      setTimeout(() => {
        setMooOpen(false);
      }, 5000);

      setTimeout(() => {
        setGrizzOpen(true);
        setTimeout(() => {
          setGrizzOpen(false);
        }, 5000);
      }, 1000);
     
    }
  }, [replayDate]);

  const dialogStyles = {
    height: 56,
    width: 720
  }

  return (
    <>
    {/* Moo */}
      <Dialog
        open={mooOpen}
        onClose={() => {
          setMooOpen(false);
          setGrizzOpen(false);
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
                Our servers are undergoing maintenance. Thanks for your patience.
              </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Grizz */}
      <Dialog
        open={grizzOpen}
        onClose={() => {
          setMooOpen(false);
          setGrizzOpen(false);
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
                We'll be back shortly. Here's a replay of some old tape.
              </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}