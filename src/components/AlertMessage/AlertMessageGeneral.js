import React, { useState, useEffect} from "react";  
import { Box, Container, Alert, AlertTitle, Typography, Collapse, IconButton} from "@mui/material"

import CloseIcon from '@mui/icons-material/Close';

export default function AlertMessageGeneral({open, onClose, title, body, type}) {

    const closeAlert = () => {
        onClose(false);
    }
    return (
        <>
        <Collapse in={open}>
            <Alert
            severity={type ? type : "error"}
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
                <Typography variant="subtitle1" fontWeight={'bold'}>{title}</Typography>
            </AlertTitle>
                <Typography variant="body2">-{body}</Typography>
            </Alert>
        </Collapse>        
        </>
    )
}