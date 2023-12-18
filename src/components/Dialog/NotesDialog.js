import React, { memo} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, DialogContent, DialogTitle} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";


const NotesDialog = ({open, onClose, payload}) => {


    return (
        <>
        <Dialog
        keepMounted
        id="clientSummary"
        open={open}
        onClose={onClose}
        
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <Typography variant="h5" fontWeight={'bold'}>Client Notes:  {payload ? DateTime.fromISO(payload.timestamp).toLocaleString() : ''} </Typography>
            </DialogTitle>

            <DialogContent>
              <Typography variant='body2'>
                Notes : { payload ? payload.notes : ''}
              </Typography>

            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
            </DialogActions>

      </Dialog>
      
      </>
    )


}

export default memo(NotesDialog);