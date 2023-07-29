import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from '../../reducers/user';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Success() {
    const requestMessage = useSelector((state) => state.user.requestMessage)
    const requestStatus = useSelector((state) => state.user.requestStatus)
    const requestType = useSelector((state) => state.user.requestType)
    const dispatch = useDispatch();
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        dispatch(setSnackbar({requestMessage: null, requestStatus: false}));
    };

    const action = (
        <React.Fragment>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
        </React.Fragment>
    );

  return (
        <Snackbar
            open={requestStatus}
            autoHideDuration={3000}
            onClose={handleClose}
            message={requestMessage}
            action={action}
        />
  );
}