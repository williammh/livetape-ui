import { useEffect, useState, useRef } from 'react';
import { 
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Send } from '@mui/icons-material';


export const EmailForm = () => {

  const buttonRef = useRef<HTMLButtonElement>(null);
  const textFieldWidth = buttonRef.current ? `calc(100% - ${buttonRef.current.offsetWidth}px - 8px)` : '80%';

  return (
    <Box
      sx={{
        'textAlign': 'right'
      }}
    >
      <TextField
        size="small"
        label="Email"
        color="default"
        sx={{
          height: 40,
          width: textFieldWidth,
          marginRight: '8px',
        }}
      />
      <Button
        ref={buttonRef}
        variant="outlined"
        color="default"
        sx={{
          height: 40,
          width: 'calc(20% - 8px)',
        }}
      >
        <Send />
      </Button>
   
    </Box>
  );
}