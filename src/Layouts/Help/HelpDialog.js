import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import React, {useState, useEffect} from "react";
import GettingStarted from "./GettingStarted";



export default function HelpDialog({open, onClose}) {


    const closeDialog = () => {
        onClose();
    }

    return (
        <Dialog
            id="help"
            open={open}
            onClose={onClose}
            fullWidth={true} 
            maxWidth={'lg'} 
            scroll={'paper'}
        >
        <DialogTitle>
            <Typography variant="h5" fontWeight={'bold'}>Quick guide: Getting started</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <GettingStarted close={closeDialog} />    
        </DialogContent>
        </Dialog>
    )
}