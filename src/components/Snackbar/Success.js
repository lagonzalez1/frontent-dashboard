import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Success({message}) {
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
        <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
        </Button>
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
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={action}
        />
  );
}