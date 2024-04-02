import React, {useEffect, useState } from "react";
import { Dialog, Container, Box, Typography, DialogContent, DialogTitle, Button, DialogActions} from "@mui/material";


export default function TemplateDialog({title, body, support, onClose, open}){


    useEffect(() => {

    }, [])

    return (
        <Dialog
            id="TemplateDialog"
            open={open}
            onClose={onClose}
            maxWidth={'xs'}
            fullWidth={true}
        >
            <DialogTitle>
                <Typography variant="substitle1">{title}</Typography>
            </DialogTitle>
            <DialogContent>
                
                <Typography variant="body2">
                    {body}
                </Typography>
                <Typography variant="body2">
                    {support}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Okay</Button>
            </DialogActions>
        </Dialog>
    )
}