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


export default function Trial() {

    const termDate = useSelector((state) => state.user.trial)
    const requestStatus = useSelector((state) => state.user.trialStatus);


    const [daysLeft, setDaysLeft] = useState(null);
    useEffect(() => {
      calculateDaysLeft();
    }, [])

    const calculateDaysLeft = () => {
      if (requestStatus){
        const term = DateTime.fromISO(termDate);
        const current = DateTime.now();
        const difference = term.diff(current, 'day').toObject();
        setDaysLeft(Math.floor(difference.days));
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
            variant="filled">
                {'You account is active until ' + DateTime.fromISO(termDate).toLocaleString() + "." }
                <LinearProgress color="secondary" variant="determinate" value={daysLeft} />
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`Days left ${daysLeft}`}</Typography>
                </Box>
          </Alert>    
        </Snackbar>
  );
}