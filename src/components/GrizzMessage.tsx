import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import grizz from '../assets/grizz.png';
export const GrizzMessage = ({message}) => {
  
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
      <Grid size={1}>
        <Avatar
          src={grizz}
          sx={{
            height: 48,
            width: 48,
            bgcolor: colors.red[900],
            margin: 'auto'
          }}
        />
      </Grid>
    </Grid>  
  );
}