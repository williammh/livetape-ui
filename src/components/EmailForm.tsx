import { useEffect, useState } from 'react';
import { 
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Send } from '@mui/icons-material';


export const EmailForm = () => {

  return (
    <Box
      sx={{
        // textAlign: 'right'

      }}
    >
      <TextField
        size="small"
        label="Email"
        color="default"
        // fullWidth
        sx={{
          height: 40,
          width: 'calc(80% - 8px)',
          marginRight: '8px'
        }}
      />
       <Button
          variant="outlined"
          color="default"
          sx={{
            height: 40,
            width: '20%'
          }}
        >
          <Send />
        </Button>
   
    </Box>
  );
}