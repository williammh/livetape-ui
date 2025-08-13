import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import grizz from '../assets/grizz.png';
import { toLocalTime } from '../util/misc';

interface IGrizzMessageProps {
  message: string;
  timestamp: string;
}

export const GrizzMessage = ({message, timestamp}: IGrizzMessageProps) => {
  
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
          src={grizz}
          sx={{
            height: 48,
            width: 48,
            bgcolor: colors.red[900],
            margin: 'auto'
          }}
        />
        <Typography>Grizz</Typography>
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