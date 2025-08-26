import { useEffect, useState } from 'react';
import { 
  Box,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { Send } from '@mui/icons-material';


export const EmailForm = () => {

  return (
    <Box
      sx={{
        textAlign: 'right'
      }}
    >
      <TextField
        size="small"
        label="Email"
        color="default"
        sx={{
          width: 546,
          marginRight: 1
        }}
      />
      <Button
        variant="outlined"
        color="default"
        sx={{
          height: 40
        }}
      >
        <Send />
      </Button>
    </Box>
  );
}