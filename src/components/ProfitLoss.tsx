import { 
  Box,
  colors,
  Typography,
} from '@mui/material';


export const ProfitLoss = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  const pnl = persona === 'moo' ? 3580 : -137;

  const pnlStr = `${pnl > 0 ? '+' : '-'} $${Math.abs(pnl).toFixed(2)}`

  return (
    <Box>
      {/* <Typography>{personaStr}</Typography> */}
      <Typography
        sx={{
          color: pnl > 0 ? colors.green[400] : colors.red[400] 
        }}
      >
        Profit/Loss: {pnlStr}
      </Typography>
    </Box>
  );
}