import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import { Alert, Typography } from '@mui/material';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}


export default function WaitingResponse({open, onClose, payload, title, body}) {
  const [state, setState] = useState({ open: false});
  
  useEffect(() => {
    console.log(payload);
  }, [payload])
    
  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{vertical: 'top',
        horizontal: 'center'}}
        TransitionComponent={SlideTransition}
        message="Open messsage"
        key={'waitingReponse'}
        autoHideDuration={1200}
      >
        <Alert
          onClose={onClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          <Typography variant="body2">{title}</Typography>
          <Typography variant="body2">{body}</Typography>
        </Alert>
        </Snackbar>
    </div>
  );
}
