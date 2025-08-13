import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import moo from '../assets/moo.png';
import { toLocalTime } from '../util/misc';

interface IMooMessageProps {
  message: string;
  timestamp: string;
}

export const MooMessage = ({message, timestamp}: IMooMessageProps) => {
  
  const localTimestamp = toLocalTime(timestamp, 'America/Los_Angeles')

  return (
    <Grid
      container
      columns={6}
      sx={{
        textAlign: 'left',
        marginBottom: 2
      }}
    >
      <Grid
        size={1}
        sx={{
          textAlign: 'center'
        }}
      >
        <Avatar
          src={moo}
          sx={{
            height: 48,
            width: 48,
            bgcolor: colors.green[900],
            margin: 'auto'
          }}
        />
        <Typography>Moo</Typography>
      </Grid>
      <Grid
        size={5} 
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