import { 
  Box,
  Typography,
} from '@mui/material';

export const Orders = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  return (
    <Box>
      {/* <Typography>{personaStr}</Typography> */}
      <Typography>
        Open Orders: 0
      </Typography>
    </Box>
  );
}