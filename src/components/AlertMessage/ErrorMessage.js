import React, { useState, useEffect} from "react";  


import { Box, Container, Alert, AlertTitle, Typography} from "@mui/material"


export default function ErrorMessage({open, setOpen, title, body}) {

    
    const closeAlert = () => {
        setOpen(false);
    }

    return (
        <>
        <Collapse in={open}>
            <Alert
            severity="error"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => closeAlert()}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}
            >
            <AlertTitle>
                {title}
            </AlertTitle>
            {body}
            </Alert>
        </Collapse>        
        </>
    )
}