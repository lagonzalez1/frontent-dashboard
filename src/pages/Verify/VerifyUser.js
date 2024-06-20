import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, TextField, CircularProgress, Stack, Container, Grid, Card, Alert } from "@mui/material";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { CheckBoxRounded, PunchClockTwoTone } from "@mui/icons-material";



export default function VerifyUser () {
    const { idd, email } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({title: '', body: ''});
    const [success, setSuccess] = useState({title: '', body: ''});

    const verifyAccount = () => {   
        setLoading(true);
        if (!idd || !email) { 
            setErrors({title: 'Error', body: 'Missing parameters to complete this process.'});
            setLoading(false);
            return;
        }
        setLoading(true);
        axios.post('/api/external/verify/user', {idd: idd, email: email})
        .then(response => {
            if (response.status === 200) {
                setSuccess({title: 'Success', body: response.data.msg});
                return;
            }
            setErrors({title: 'Error', body: 'Unable to reach 200 status code. Account has not been verified. Try again later.'});
            return;
        }) 
        .catch(error => {
            console.log(error);
            if (error.response) {
                console.log(error.response);
                setErrors({body: 'Response error', title: 'Error'});
            }
            else if (error.request){
                console.log(error.request);
                setErrors({body: 'No response from server', title: 'Error'})
            }
            else {
                setErrors({body: 'Request setup error', title: 'Error'})
            }   
        })
        .finally( async () => {
            setErrors({title: '', body: ''});
            setLoading(false);
        })
        
        
    }

    const isVerified = () => {
        if (!idd || !email) {
            setErrors({title: 'Warning', body: 'Your account has not yet been verified.'});
            setLoading(false);
            return;
        }
        axios.get('/api/external/verify/check', {params: {idd, email}})
        .then(response => {
            if (response.status === 200 && response.data.confirmed === true) {
                setSuccess({title: 'Success', body: 'Your account has been verified.'});
                return;
            }
            if (response.status === 200 && response.data.confirmed === false){
                setErrors({title: 'warning', body: 'Your account has not verified.'});
                return;
            }
            setErrors({title: 'warning', body: 'Your account is not yet verified.'});
            return;
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                console.log(error.response);
                setErrors({body: 'Response error', title: 'Error'});
            }
            else if (error.request){
                console.log(error.request);
                setErrors({body: 'No response from server', title: 'Error'})
            }
            else {
                setErrors({body: 'Request setup error', title: 'Error'})
            } 
        })
        .finally(async() => {
            setLoading(false)
        })
        // This is null
    }

    const closeCurrentTab = () => {
        navigate('https://waitonline.us/Dashboard?quick_start=true')
    }

    useEffect(() => {
        isVerified();
    }, [])

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center'}} justifyContent={'center'} alignItems={'center'} textAlign={'center'}>    
            <Stack spacing={2} sx={{minWidth: '50vw', maxWidth: '100vw', mt: 3}}>
            {errors.title === "warning" ? <Alert severity="warning" variant="standard">{errors.body}</Alert> : null}
            <Typography variant="h5" fontWeight={'bold'}>
                Verify your account
            </Typography>
            <Typography variant="subtitle1">Is this email associated with your account? If so go ahead and verify!</Typography>
            <TextField defaultValue={email} disabled={true} variant="outlined" />
            {success.title === "Success" ? (
                <>
                    <Button sx={{borderRadius: 5}} variant="contained" startIcon={<CheckBoxRounded />} color="success" onClick={() => closeCurrentTab()}>Visit dashboard</Button> 
                    <Typography variant="subtitle1">Start booking!</Typography>
                </>
            ):
            <LoadingButton sx={{borderRadius: 5}} loading={loading} variant="contained" onClick={() => verifyAccount()}>Verify now</LoadingButton> 
            }
            <Box sx={{display: 'flex', justifyContent: 'center', pt: 1}}>
                <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoTone fontSize="small"/> </Typography>
            </Box>
            </Stack>
            
        </Container>
    )
}