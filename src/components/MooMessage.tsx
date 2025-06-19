import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import moo from '../assets/moo.png';
export const MooMessage = ({message}) => {
  
  return (
    <Grid
      container
      columns={6}
      sx={{
        textAlign: 'left',
        marginBottom: 2
      }}
    >
      <Grid size={1}>
        <Avatar
          src={moo}
          sx={{
            height: 48,
            width: 48,
            bgcolor: colors.green[900],
            margin: 'auto'
          }}
        />
      </Grid>
      <Grid
        size={5}
      >
        <Card
          sx={{
            padding: 2
          }}
        >
          {message}
        </Card>
      </Grid>
    </Grid>  
  );
}