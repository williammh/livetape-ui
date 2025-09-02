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
        textAlign: 'right',
        maxHeight: 40
      }}
    >
      <Grid
        container
        direction='row'
        spacing={1}
      >
        <Grid
          size={1}
          flexGrow={3}
        >
          <TextField
            size="small"
            label="Email"
            color="default"
            fullWidth
            sx={{
              height: 40,
            }}
          />
        </Grid>
        <Grid
          size={1}
          flexGrow={1}
          flexShrink={1}
        >
          <Button
            ref={buttonRef}
            variant="outlined"
            color="default"
            sx={{
              height: 40,
              width: '100%',
            }}
          >
            <Send />
          </Button>
        </Grid>


      </Grid>
    </Box>
  );
}