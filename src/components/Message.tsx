import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import moo from '../assets/moo.png';
import grizz from '../assets/grizz.png';
import { toLocalDateTimeStr } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

export interface IMessageProps {
  persona: string;
  text: string;
  timestamp: string;
}

export const Message = ({persona, text: message, timestamp}: IMessageProps) => {
  const { timezone } = useAppContext();
  const localTimestamp = toLocalDateTimeStr(timestamp, timezone);
  const bgColor = persona === 'moo' ? colors.green[400] : colors.red[400];
  const capitalized = `${persona?.[0].toUpperCase()}${persona?.slice(1)}`;
  const displayName = capitalized.includes(":") ? capitalized.slice(0, capitalized.indexOf(":") ) : capitalized;
  const avatar = persona?.startsWith('moo') ? moo : grizz;

  return (
    <Grid
      container
      columns={8}
      sx={{
        textAlign: 'left',
        marginBottom: 2,
        marginRight: 1,
      }}
    >
      <Grid
        size={1}
        sx={{
          textAlign: 'center',
        }}
      >
        {persona === 'moo' || persona == 'grizz' ? (
          <>
            <Avatar
              src={avatar}
              sx={{
                height: 56,
                width: 56,
                bgcolor: bgColor,
                margin: 'auto',
              }}
            />
            <Typography
              sx={{
                fontWeight: 'bold'
              }}
            >{displayName}</Typography>
          </>
        ) : (
          <>
            <Typography></Typography>
            
          </>
        )}
      </Grid>
      <Grid
        size={7}
      >
        <Card
          sx={{
            padding: 2
          }}
        >
          <Typography
            sx={{
              marginBottom: 1
            }}
          >
            {message}
          </Typography>
          <Typography
            sx={{
              textAlign: 'right',
              color: 'gray'
            }}
          >
            {localTimestamp}
          </Typography>
        </Card>
      </Grid>
    </Grid>  
  );
}