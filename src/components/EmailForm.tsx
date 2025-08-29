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
        textAlign: 'right'
      }}
    >
      <Grid
        container
        direction='row'
        columns={6}
        spacing={1}
      >
        <Grid
          size={5}
        >
          <TextField
            size="small"
            label="Email"
            color="default"
            fullWidth
          />
        </Grid>
        <Grid
          size={1}
        >
          <Button
            variant="outlined"
            color="default"
            sx={{
              height: 40,
              width: '100%'
            }}
          >
            <Send />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}