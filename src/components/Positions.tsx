import { 
  Box,
  Typography,
} from '@mui/material';

export const Positions = ({persona}) => {

  const personaStr = `${persona[0].toUpperCase()}${persona.slice(1)}`;

  return (
    <Box>
      {/* <Typography>{personaStr}</Typography> */}
      <Typography>
        Open Positions: 0
      </Typography>
    </Box>
  );
}