import { 
  Box,
  colors,
  Grid,
  Typography,
} from '@mui/material';


export const ProfitLoss = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const pnl = persona === 'moo' ? 3580 : -137;

  const pnlStr = `${pnl > 0 ? '+' : '-'} $${Math.abs(pnl).toFixed(2)}`

  return (
    <Box>
      <Grid
        container
        columns={2}
      >
        <Grid
          size={1}
          sx={{
            textAlign: 'left'
          }}
        >
          <Typography
            variant='h6'
            // component='span'
          >
            {`${personaStr} `}
          </Typography>
        </Grid>

        <Grid
          size={1}  
          sx={{
            textAlign: 'right'
          }}
        >
          <Typography
            variant='h6'
            // component='span'
            sx={{
              color: pnl > 0 ? colors.green[400] : colors.red[400] 
            }}
          >
            {pnlStr}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}