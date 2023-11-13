import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, ToggleButtonGroup, ToggleButton, IconButton, Zoom, TextField, InputLabel, Select, MenuItem, Alert, Divider, AlertTitle } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useParams } from "react-router-dom";
import { allowClientJoin, getBuisnessForm, waitlistRequest,checkDuplicatesRequest } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTime } from "luxon";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";

export default function WelcomeDetails() {

    
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const validationSchema = Yup.object({
        fullname: Yup.string().required('Full Name is required'),
        phoneNumber: Yup.string().required('Phone').matches(phoneRegex, 'Phone number must be in the format xxx-xx-xxxx')
        .required('Phone number is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
          fullname: '',
          phoneNumber: '',
          email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            checkAcceptingState(values);
        },
    });

    const { link } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [preview, setPreview] = useState(null);
    const [appointmentsOnly, setAppointmentsOnly] = useState(false);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false})



    const businessForm = () => {
        getBuisnessForm(link)
        .then(data => {
            setInputs(data.inputFields);
        })
        .catch(error => {
            setErrors(errors);
            console.log(error);
        })
    }

    useEffect(() => {
        redirectStatus();
        businessForm();
        getPreview();
        return() => {
            setLoading(false)
        }
    }, []);

    const getPreview = () => {
        const clientJson = sessionStorage.getItem(CLIENT);
        if (clientJson === null) {
            setErrors('No data has been saved.');
            return 
        }
        const clientData = JSON.parse(clientJson);
        setPreview(() => ({...clientData, date: DateTime.fromISO(clientData.date)})) ;
    }


    const redirectStatus = () => {
        const currentTime = DateTime.local().toISO();       
        allowClientJoin(currentTime, link)
        .then(response => {
            if (response.status === 200) {
                setAcceptingStatus({ waitlist: response.data.isAccepting, appointments: response.data.accpetingAppointments});
                if (response.data.isAccepting === false && response.data.accpetingAppointments === false) {
                    navigate(`/welcome/${link}`);
                    return;
                }
            }            
        })
        .catch(error => {
            console.log(error);
            setErrors('Error found when trying to reach business.');
        })
    }

    const checkAcceptingState = async (values) => {
        let timestamp = DateTime.local().toUTC();
        try {
            const response = await allowClientJoin(timestamp, link);
            const { isAccepting, accpetingAppointments } = response.data;
            if ( accpetingAppointments === true || isAccepting === true ) {
                externalWaitlistRequest(values);
            }
            else if (accpetingAppointments === false && isAccepting === false){
                setErrors('Business is currently not accpeting appointments and waitlist request.');
                setLoading(false);
                return;
            }
            else{
                setLoading(false);
                redirectBack();
            }
            
        }catch(error) {
            setLoading(false);
            redirectBack();
            console.log(error);
        }
    }


    const externalWaitlistRequest = (values) => {
        const clientPayload = sessionStorage.getItem(CLIENT);
        if (clientPayload === null) { 
            navigate(`/welcome/${link}`);
            return
        }
        const clientStorage = JSON.parse(clientPayload);
        let timestamp = DateTime.local().toISO();
        let payload = { link, timestamp, timestampOrigin: timestamp, ...clientStorage, ...values}
        let duplicatePayload = { ...clientStorage, link, values}
        checkDuplicatesRequest(duplicatePayload)
        .then((response) => {
            console.log(response);
            if(response.duplicate === true) {
                setLoading(false);
                navigate(`/welcome/${link}/visits/${response.identifier}`);
            }else{
                // Make the real request to backend.
                return waitlistRequest(payload);
            }
        })
        .then(response => {
            setLoading(false);
            navigate(`/welcome/${link}/visits/${response.unid}`)
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            setErrors(error);
        })
    }
    const formatPhoneNumber = (input) => {
        const digits = input.replace(/\D/g, '');
        if (digits.length <= 3) {
            return digits;
          } else if (digits.length <= 6) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
          } else {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    }
    const phoneNumberChange = (event) => {
        const input = event.target.value;
        // Apply formatting to the input and update the state
        const phoneNumber = formatPhoneNumber(input);
        if (phoneNumber.length === 12) {
            console.log("Completed", phoneNumber);
            formik.setFieldValue('phoneNumber', phoneNumber);
        }
        setPhoneNumber(phoneNumber);
    }

    const redirectBack = () => {

        navigate(`/welcome/${link}/selector`)
    }
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ maxWidth: '100vh', minWidth: '30%',  minHeight: '70vh', textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    <CardContent>
                        { errors ? <Alert color="warning">{errors}</Alert>: null} 
                    
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Enter your details
                        </Typography>

                        
                        <form onSubmit={formik.handleSubmit}>
                        <Stack sx={{pt: 2}} spacing={1}>

                            { inputs.fullname ? (
                                <>
                                <InputLabel htmlFor="fullname" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Name *</InputLabel>
                                    <TextField
                                        id="fullname"
                                        name="fullname"
                                        label="Name"
                                        value={formik.values.fullname}
                                        onChange={formik.handleChange}
                                        error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                        helperText={formik.touched.fullname && formik.errors.fullname}
                                    /> 
                            </>
                            ): null}
                            
                            { inputs.phone ? (
                                <>
                                <InputLabel htmlFor="phoneNumber" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Phone *</InputLabel>
                                    <TextField
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="Phone Number"
                                        placeholder="xxx-xxx-xxxx"
                                        value={phoneNumber}
                                        onChange={(event) => phoneNumberChange(event)}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                    />
                                </>
                            ) : null}
                            
                            
                            { inputs.email ? (
                                <>
                                    <InputLabel htmlFor="email" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Email *</InputLabel>
                                    <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />    
                                
                                </>
                            ): null}
                            
                            
                             <Divider/>
                             <Button sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
                            { loading ? (<CircularProgress />) :
                             <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                Join waitlist
                                </Typography> }
                            </Button> 
                            </Stack>

                            </form>

                            {
                                preview ? (
                                    <>
                                        <Box sx={{ pt: 2, display: 'flex', width: '100%', maxWidth: '100%'}}>
                                            <Alert variant="outlined" severity='success' sx={{ textAlign: 'left'}}>
                                                <AlertTitle><Typography variant="body1"><strong>Details</strong></Typography></AlertTitle>

                                                {
                                                    preview && preview.TYPE === APPOINTMENT ? (
                                                        <>
                                                        <Typography variant="caption">Employee assigned — <strong>{preview.fullname}</strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">Service — <strong>{preview.serviceName }</strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">Date assigned — <strong>{preview.date.toFormat('LLL dd yyyy') }</strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">Start — <strong>{DateTime.fromFormat(preview.start, "HH:mm").toFormat("h:mm a")}</strong> — End <strong>{DateTime.fromFormat(preview.end, "HH:mm").toFormat("h:mm a")} </strong></Typography>
                                                        <br/>
                                                        </>
                                                    ) : null
                                                }

{
                                                    preview && preview.TYPE === WAITLIST ? (
                                                        <>
                                                        <Typography variant="caption">For today — <strong>{DateTime.local().toFormat('LLL dd yyyy')}</strong></Typography>
                                                        <br/>   
                                                        { preview.fullname && (<>
                                                            <Typography variant="caption">Employee assigned — <strong>{preview.fullname}</strong></Typography>
                                                            <br/>
                                                        </>)}

                                                        { preview.serviceTitle && (<>
                                                            <Typography variant="caption">Service — <strong>{preview.serviceTitle}</strong></Typography>
                                                            <br/>
                                                        </>)}

                                                        { preview.resourceTitle && (<>
                                                            <Typography variant="caption">Resource — <strong>{preview.resourceTitle}</strong></Typography>
                                                            <br/>
                                                        </>)}

                                                        { preview.notes && (<>
                                                            <Typography variant="caption">Notes  — <strong>{preview.notes}</strong></Typography>
                                                            <br/>
                                                        </>)}
                                                        </>
                                                    ) : null
                                                }
                                                
                                                
                                            </Alert>
                                        </Box>
                                    </>
                                ) : null
                            }      
                
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                    
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}