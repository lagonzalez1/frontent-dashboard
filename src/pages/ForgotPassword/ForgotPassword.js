import React, {useState, useEffect} from "react";
import { Container, TextField, Typography, Box, Paper, Link, Stack, Alert, Collapse, IconButton, AlertTitle, Divider } from "@mui/material";
import { requestResetToken } from "./ForgotPasswordHelper";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";


export default function ForgotPassword () {

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({title: null, body: null});
    const [email, setEmail] = useState(null);


    const requestToken = () => {
        if (email === null) {
            setAlert(true);
            setAlertMessage({title: 'error', body: 'Email is empty.'})
            return;
        }
        setLoading(true);
        requestResetToken(email)
        .then(response => {   
            console.log(response);       
            //setAlert(true);
            //setAlertMessage({title: 'success', body: response})
        })
        .catch(error => {
            console.log(error);
            setAlert(true);
            setAlertMessage({title: 'error', body: error})
        })
        .finally(() => {
            setLoading(false);
        })

    }


    return (
        <Container>
            <Box
            sx={{
                pt: 1,
                my: 8,
                mx: 2,
                pb: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Stack spacing={1.5}>
                <Collapse in={alert}>
                        <Alert
                        severity={alertMessage.title === "error" ? "error": 'success'}
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                                setAlertMessage({title: null, body: null});
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                            <AlertTitle sx={{fontWeight: 'bold'}}>
                                {alertMessage.title}
                            </AlertTitle>
                            
                            {"- "+alertMessage.body}
                        </Alert>
                    </Collapse>
                    


                <Typography textAlign={'left'} variant="h5" fontWeight={'bold'}>
                    Forgot password
                </Typography>

                <Typography textAlign={'left'} variant="body2">
                    <u>Attention:</u> This section is only for ROOT users. For employees please refer to your root user to update any password.
                </Typography>
                <Typography textAlign={'left'} variant="body2">
                    <u>1</u>: Please enter your email associated with your account. You will recive a confirmation email.
                </Typography>
                <Typography textAlign={'left'} variant="body2">
                        <u>2</u>: Note you will have a total of 3 minutes to complete this task.
                </Typography>


                <TextField id="outlined-basic" label="Root email" variant="outlined" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}  />
                <LoadingButton sx={{ borderRadius: 7}} loading={loading} onClick={() => requestToken()} variant="contained">Send</LoadingButton>

                <Divider />
                <Link href="/Login">Back to login</Link>
                </Stack>
                

            </Box>
            
        
        
        </Container>
    )
}