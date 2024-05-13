import React, {useState, useEffect} from "react";
import { Alert, AlertTitle, Box, Collapse, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';



export default function StartingHours({show, setShow}) {






    const closeDialog = () => {
        setShow(false);
    }


    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={show}>
                <Alert
                    id="gettingStarted"
                    action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            closeDialog()
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                    
                >
                <AlertTitle>
                    <Typography variant="subtitle1" fontWeight={'bold'}>Getting started</Typography>
                </AlertTitle>
                    
                </Alert>
        </Collapse>
        </Box>
    )
}