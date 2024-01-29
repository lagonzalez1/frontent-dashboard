import React, {useEffect, memo, useState} from "react";
import { Container, Box, Button, Stack, Dialog, DialogContent, DialogTitle, Typography, DialogActions, IconButton, Divider, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"




const StartSubscription = ({open, onClose}) => {

    const [promo, setPromo] = useState('');


    return (
        <Dialog
        keepMounted
        id="servingClient"
        open={open}
        onClose={onClose}
        maxWidth={'sm'}
        fullWidth={true}
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
                <Typography variant="h5" fontWeight={'bold'}>Start subsciption</Typography>
                <Divider />
            </DialogTitle>
                
            <DialogContent>
                <Typography variant="subtitle1" fontWeight={'bold'}>What will happen</Typography>
                <Typography variant="subtitle2">Thank you for choosing us. You will be navigated to one of our trusted source for payment collection. </Typography>
                <Typography variant="subtitle2">Dont worry a new tab will open, once you are done you can come right back.</Typography>

                <Typography variant="subtitle1" fontWeight={'bold'}>You have selected the current plan</Typography>
                <Typography variant="subtitle2"><strong>Package: </strong>Waitlist + Appointment + Analytics</Typography>
                <Typography variant="subtitle2"><strong>Price: </strong>15.99 USD</Typography>
                <Typography variant="subtitle2" gutterBottom><strong>Subscription: </strong> Monthly</Typography>
                <TextField size="small" variant="outlined" placeholder="promo code" value={promo} onChange={e => setPromo(e.target.value)}></TextField>

            </DialogContent>
            <DialogActions>
                <Button variant="contained" color={'success'} sx={{ borderRadius: 10}}>Proceed</Button>
            </DialogActions>

        </Dialog>  
    )
}

export default memo(StartSubscription);