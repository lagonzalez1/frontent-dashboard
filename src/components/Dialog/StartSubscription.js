import React, {useEffect, memo, useState} from "react";
import { Container, Box, Button, Stack, Dialog, DialogContent, DialogTitle, Typography, DialogActions, IconButton, Divider, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import axios from "axios";
import { startSubscriptionTest } from "../FormHelpers/StartSubscriptionHelper";



const StartSubscription = ({open, onClose, plan}) => {

    const [promo, setPromo] = useState('');



    const openSubscription = () => {
        
    }


    // Jan 31 2024
    // CORS - is in charge of this block? 
    // Access-Control-Allow-Origin is denying this redirect 
    // This request returns back a 303 redirect with the header containing my link to stripe.
    // My page is from origin: localhost:3000 -> stripe.com/...


    const testingSubscription = () => {
        // Hard coded price of item in stripe
        if (plan !== "" || plan !== undefined || plan !== null) {
            startSubscriptionTest(plan)
            .then(res => {
                // Redirect user to stripe.
                window.location.href = res.data.link;
            })
            .catch(error => {
                console.log(error)
            })
        }
        
    }


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
                <Typography variant="h5" fontWeight={'bold'}>Start subscription</Typography>
                <Divider />
            </DialogTitle>
                
            <DialogContent>
                <Typography variant="subtitle1" fontWeight={'bold'}>What will happen</Typography>
                <Typography variant="subtitle2">Thank you for choosing us. You will be navigated to one of our trusted source for payment collection <strong>Stripe</strong>. </Typography>
                <Typography variant="subtitle2">Dont worry a new tab will open, once you are done you can come right back.</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => testingSubscription()} endIcon={<OpenInNewOutlinedIcon />} variant="contained" color={'success'} sx={{ borderRadius: 10}}>Proceed</Button>
            </DialogActions>

        </Dialog>  
    )
}

export default memo(StartSubscription);