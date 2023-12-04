import React, {useState, useEffect} from "react";
import { Container, TextField, Typography, Box, Paper, Button, Stack, Alert, Collapse, IconButton, AlertTitle, Link, Divider } from "@mui/material";
import { isStrongPassword, requestPasswordUpdate } from "./PasswordResetHelper";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";


export default function PasswordReset () {

    const token = useParams();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({title: null, body: null});
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);


    const requestPasswordChange = () => {
        if (email === null || token === null) {
            setAlert(true);
            setAlertMessage({title: 'error', body: 'Email is empty.'})
            return;
        }
        if (!isStrongPassword(password)) {
            setAlert(true);
            setAlertMessage({title: 'error', body:'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and special character.'})
            return;
        }
        setLoading(true);
        requestPasswordUpdate(email, token, password)
        .then(response => {
            if (response.status === 200) {
                setAlert(true);
                setAlertMessage({title: 'success', body: response.data.msg})
            }
            if (response.status === 201){
                setAlert(true);
                setAlertMessage({title: 'error', body: response.data.msg})
            }
            
        })
        .catch(error => {
            console.log(error)
            setAlert(true);
            setAlertMessage({title: 'error', body: error})
        })
        .finally(() => {
            setLoading(false);
        })

    }


    useEffect(() => {

    },[])

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
                <Paper sx={{p: 2}}>
                <Stack spacing={1.5}>

                <Collapse in={alert}>
                        <Alert
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
                        severity={alertMessage.title ? alertMessage.title : 'info'}
                        sx={{ mb: 2 }}
                        >
                            <AlertTitle sx={{fontWeight: 'bold'}}>
                                {alertMessage.title}
                            </AlertTitle>
                            
                            {"- "+alertMessage.body}
                        </Alert>
                    </Collapse>
                    


                <Typography textAlign={'left'} variant="h5">
                    Password reset
                </Typography>

                <Typography textAlign={'left'} variant="body2">
                    Please confirm your email and input your <strong>new </strong> password.
                </Typography>

                <TextField id="outlined-email" label="Root email" variant="outlined" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}  />
                <TextField id="outlined-pass" label="New password" variant="outlined" value={password} placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}  />

                <LoadingButton sx={{ borderRadius: 10}} loading={loading} onClick={() => requestPasswordChange()} variant="contained">Save</LoadingButton>
                <Divider />
                <Link href="/Login">Back to login</Link>
                </Stack>
                
                
                </Paper>


            </Box>
            
        
        
        </Container>
    )
}