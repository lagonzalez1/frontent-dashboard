import React, {useState, memo} from "react";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { XCircle, CheckCircle, Divide, Confetti } from "phosphor-react"; 
import { PunchClockTwoTone } from "@mui/icons-material"


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
            <Typography variant="h4" fontWeight={'bold'}>{payload ? payload.title: ''}</Typography>
            <Divider />
        </DialogTitle>
        <DialogContent>
            <Container sx={{ display: 'flex', justifyContent: 'center'}}>
                {payload && payload.icon === "cancelled" && <XCircle weight="fill" size={100} /> }
                {payload && payload.icon === "okay" && <Confetti weight="fill" size={100} /> }
            </Container>
            <br />
            <Typography variant="subtitle1" fontWeight={'bold'} gutterBottom>{payload ? payload.status: ''}</Typography>
            <Typography variant="subtitle1">To manage subscriptions please visit the <u>settings</u> page under <u>Payments</u></Typography>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3}}>
                <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoTone fontSize="small"/> </Typography>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button sx={{ borderRadius: 7}} variant="contained" onClick={onClose}>Start</Button>
        </DialogActions>        
        </Dialog>
    )
}

export default memo(StripeCompletion);