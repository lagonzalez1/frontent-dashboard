import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { IconButton, Alert, LinearProgress, Box, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from '../../reducers/user';
import { DateTime } from 'luxon';
import { ClockCounterClockwise } from "phosphor-react";


export default function Trial() {

    const termDate = useSelector((state) => state.user.trial)
    const requestStatus = useSelector((state) => state.user.trialStatus);
    const tz = useSelector((state) => state.business.timezone);
    const [daysLeft, setDaysLeft] = useState(null);

    useEffect(() => {
      calculateDaysLeft();
    }, [])

    const calculateDaysLeft = () => {
      if (requestStatus){
        const term = DateTime.fromJSDate(new Date(termDate)).setZone(tz);
        const current = DateTime.local();
        const difference = term.diff(current, 'day').toObject();
        setDaysLeft(Math.floor(difference.days) * 10);
      }
    }

    const action = (
        <React.Fragment>
        </React.Fragment>
    );

  return (
        <Snackbar
            open={requestStatus}
            action={action}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          >
            <Alert
            severity="error"
            sx={{p: 1}}
            icon={<ClockCounterClockwise size={32} />}
            variant="filled">
              
                <Typography variant='body1'>{'You account is active until ' + DateTime.fromJSDate( new Date(termDate)).setZone(tz).toLocaleString() + "." }</Typography>
                <LinearProgress color="inherit" variant="determinate" value={daysLeft} />
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.white">{`Days left ${daysLeft/10}`}</Typography>
                </Box>
          </Alert>    
        </Snackbar>
  );
}