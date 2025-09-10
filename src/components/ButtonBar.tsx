import { useState } from 'react';
import { 
  Box,
  Button,
  TextField,
  Dialog,
  ButtonGroup,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  CalendarMonth,
  Settings,
  Email
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

export const ButtonBar = () => {
  const { timezone, setTimezone } = useAppContext();

  const height = 56

  const [open, setOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState('');

  const settingsContent = (
    <>
      <FormControl fullWidth>
        <InputLabel
          color="default"
          id="timezone select"
        >
          Timezone
        </InputLabel>
        <Select
          labelId="timezone select"
          id="timezone-select"
          value={timezone}
          color="default"
          label="Timezone"
          onChange={(event) => setTimezone(event.target.value)}
        >
          <MenuItem value={'America/Los_Angeles'}>Los Angeles</MenuItem>
          <MenuItem value={'America/Denver'}>Denver</MenuItem>
          <MenuItem value={'America/Chicago'}>Chicago</MenuItem>
          <MenuItem value={'America/New_York'}>New York</MenuItem>
          <MenuItem value={'America/Sao_Paulo'}>São Paulo</MenuItem>
          <MenuItem value={'UTC'}>UTC</MenuItem>
          <MenuItem value={'Europe/London'}>London</MenuItem>
          <MenuItem value={'Europe/Frankfurt'}>Frankfurt</MenuItem>
          <MenuItem value={'Europe/Moscow'}>Moscow</MenuItem>
          <MenuItem value={'Asia/Dubai'}>Dubai</MenuItem>
          <MenuItem value={'Asia/Kolkata'}>Mumbai</MenuItem>
          <MenuItem value={'Asia/Hong_Kong'}>Hong Kong</MenuItem>
          <MenuItem value={'Asia/Tokyo'}>Tokyo</MenuItem>
          <MenuItem value={'Australia/Sydney'}>Sydney</MenuItem>
        </Select>
      </FormControl>
    </>
  )

  const emailContent = (
    <>

      <TextField
        label="Email"
        color="default"
        fullWidth
        sx={{
          height: 56,
        }}
      />
    </>
  )

  const handleSettingsClick = () => {
    setOpen(true);
    setActiveDialog('settings');
  }

  const handleEmailClick = () => {
    setOpen(true);
    setActiveDialog('email');
  }

  const getDialogContent = () => {
    if (activeDialog === 'settings') {
      return settingsContent;
    } else if (activeDialog === 'email') {
      return emailContent;
    }
  
  }

  return (
    <Box
      sx={{
        textAlign: 'left',
        maxHeight: height
      }}
    >
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        hideBackdrop={true}
      >
        <DialogContent>
          {getDialogContent()}
        </DialogContent>
      </Dialog>
      <ButtonGroup
        fullWidth
      >
        <Button
          size='large'
          color='default'
          aria-label='settings'
          onClick={handleSettingsClick}
          sx={{
            height: height
          }}
        >
          <Settings />
        </Button>
        <Button
          size='large'
          color='default'
          sx={{
            height: height
          }}
        >
          <CalendarMonth />
        </Button>
        <Button
          size='large'
          color='default'
          onClick={handleEmailClick}
          sx={{
            height: height
          }}
        >
          <Email />
        </Button>
      </ButtonGroup>

    </Box>
  );
}