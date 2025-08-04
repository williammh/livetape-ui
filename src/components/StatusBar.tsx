import Chart from 'react-apexcharts';
import {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';
import { 
  Box,
  Autocomplete,
  TextField,
  Typography,
  Grid
} from '@mui/material';
import { AppContext } from '../Context';


export const StatusBar = ({dateTime}) => {
 
  // console.log(dateTime);

  useEffect(() => {
    console.log(dateTime);
  }, [dateTime]);

  return (
    <Box>
        <Typography>
          {dateTime}
        </Typography>
    </Box>
  );
}