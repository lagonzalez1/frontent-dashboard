import React, {useState, memo} from "react";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { XCircle, CheckCircle, Divide } from "phosphor-react"; 


const StripeCompletion = ({open, onClose, payload}) => {

    return (

        <Dialog
        open={open}
        onClose={onClose}
        maxWidth={'xs'}
        fullWidth={true}
        id="StripeCompletion"
        >       
        <DialogTitle>
            <Typography variant="h6" fontWeight={'bold'}>{payload ? payload.title: ''}</Typography>
            <Divider />
        </DialogTitle>
        <DialogContent>
            
            <Container sx={{ display: 'flex', justifyContent: 'center'}}>
                {payload && payload.icon === "cancelled" && <XCircle weight="fill" size={60} /> }
                {payload && payload.icon === "okay" && <CheckCircle color="#00e025" weight="fill" size={60} /> }
            </Container>
            <br />
            <Typography variant="subtitle2" fontWeight={'bold'} gutterBottom>-{payload ? payload.status: ''}</Typography>
            <Typography variant="subtitle2">-To manage subscriptions please visit the settings page under Payments</Typography>
        </DialogContent>
        <DialogActions>
            <Button sx={{ borderRadius: 10}} variant="contained" onClick={onClose}>Close</Button>
        </DialogActions>        
        </Dialog>
    )


}


export default memo(StripeCompletion);