import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import moo from '../assets/moo.png';
import grizz from '../assets/grizz.png';

import { toLocalTime } from '../util/misc';

interface IMessageProps {
  persona?: string;
  message: string;
  timestamp: string;
}

export const Message = ({persona, message, timestamp}: IMessageProps) => {
  
  const localTimestamp = toLocalTime(timestamp, 'America/Los_Angeles')

  const bgColor = persona === 'moo' ? colors.green[900] : colors.red[900]
  const displayName = `${persona?.[0].toUpperCase()}${persona?.slice(1)}`;

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
          textAlign: 'center'
        }}
      >
        <Avatar
          src={persona === 'moo' ? moo : grizz}
          sx={{
            height: 56,
            width: 56,
            bgcolor: bgColor,
            margin: 'auto'
          }}
        />
        <Typography>{displayName}</Typography>
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