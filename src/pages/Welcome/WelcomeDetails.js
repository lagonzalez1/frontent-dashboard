import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
     Stack, IconButton, TextField, InputLabel, Alert, Divider, AlertTitle, Chip, 
     Dialog, DialogContent, DialogTitle } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useParams } from "react-router-dom";
import { allowClientJoin, getBuisnessForm, waitlistRequest,checkDuplicatesRequest } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTime } from "luxon";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from "@emotion/react";
import { ClientWelcomeTheme } from "../../theme/theme";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import LoadingButton from '@mui/lab/LoadingButton';
import "../../css/Welcome.css";


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
    const [showDisclosure, setShowDisclosure] = useState(false);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false})



    const businessForm = () => {
        getBuisnessForm(link)
        .then(data => {
            setInputs(data.inputFields);
        })
        .catch(error => {
            setErrors(errors);
            if (error.response.status === 404) {
                navigate(`/welcome/${link}`);
                return;
            }
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


    const closeDisclosure = () => {
        setShowDisclosure(false);
    }

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
                setAcceptingStatus({ waitlist: response.data.isAccepting, appointments: response.data.acceptingAppointments});
                if (response.data.isAccepting === false && response.data.acceptingAppointments === false) {
                    navigate(`/welcome/${link}`);
                    return;
                }
            }            
        })
        .catch(error => {
            if (error.response.status === 404) {
                navigate(`/welcome/${link}`);
                return;
            }
            setErrors('Error found when trying to reach business.');
        })
    }

    const checkAcceptingState = async (values) => {
        let timestamp = DateTime.local().toUTC();
        try {
            const response = await allowClientJoin(timestamp, link);
            const { isAccepting, acceptingAppointments } = response.data;
            if ( acceptingAppointments === true || isAccepting === true ) {
                externalWaitlistRequest(values);
            }
            else if (acceptingAppointments === false && isAccepting === false){
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
        }
    }


    const externalWaitlistRequest = (values) => {
        const clientPayload = sessionStorage.getItem(CLIENT);
        if (clientPayload === null) { 
            navigate(`/welcome/${link}`);
            return
        }
        // This might be causing my issues
        const clientStorage = JSON.parse(clientPayload);
        let timestamp = DateTime.local().toISO();
        let payload = { link, timestamp, timestampOrigin: timestamp, ...clientStorage, ...values}
        let duplicatePayload = { ...clientStorage, link, values}
        checkDuplicatesRequest(duplicatePayload)
        .then((response) => {
            if(response.duplicate === true) {
                setLoading(false);
                navigate(`/welcome/${link}/visits/${response.identifier}`);
            }else{
                // Make the real request to backend.
                return waitlistRequest(payload);
            }
        })
        .then(response => {
            navigate(`/welcome/${link}/visits/${response.unid}`)
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            setErrors(error);
        })
        .finally(() => {
            setLoading(false);
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
            formik.setFieldValue('phoneNumber', phoneNumber);
        }
        setPhoneNumber(phoneNumber);
    }

    const redirectBack = () => {
        navigate(`/welcome/${link}/selector`)
    }
    return (
        <>  
            <ThemeProvider theme={ClientWelcomeTheme}>
            <Box className="center-box" >
                <Card className="custom-card" sx={{ maxWidth: '100vh', minWidth: '30%', textAlign:'center', p: 2, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    <CardContent sx={{overflowY: 'auto', maxHeight: "70vh", mt: 1}}>
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
                             <LoadingButton loading={loading} sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
                             <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                submit 
                            </Typography> 
                            </LoadingButton> 

                            </Stack>
                            </form>

                            {
                                preview ? (
                                    <>
                                        <Box sx={{ pt: 2, display: 'block', width: '100%', maxWidth: '100%'}}>
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
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 4}}>

                        <Stack spacing={2}>
                            <Chip 
                                sx={{ maxWidth: '80x'}} variant="outlined" size="small" clickable={true} 
                                onClick={() => setShowDisclosure(true)} icon={<InfoOutlinedIcon fontSize="small"/>} 
                                label={'Disclosure'}> 
                            </Chip> 
                            <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>

                        </Stack>
                    </CardActions>
                </Card>
            </Box>


            <Dialog
                id={'disclosure'}
                open={showDisclosure}
                onClose={closeDisclosure}
            >
                <DialogTitle> 
                    <Typography variant="h6" fontWeight="bold">{"Disclosure"}
                </Typography> 
                <IconButton
                    aria-label="close"
                    onClick={closeDisclosure}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="caption">
                    By entering your email address and phone number on our webpage, you authorize us to send periodic reminders and notifications 
                    related to the subscribed service. These communications may include appointment confirmations, updates, promotions, 
                    or other relevant information. We assure you that your contact details will be used exclusively for reminder purposes 
                    and will not be shared, sold, or distributed to third parties without your explicit consent, except when required by law. 
                    You reserve the right to opt-out from receiving reminders at any time by following the instructions in our communications or contacting us directly. 
                    Please be aware that standard message and data rates may apply for SMS notifications based on your mobile carrier and plan. 
                    Your submission implies your acceptance of these terms regarding the usage of your email address and phone number for reminder purposes.
                    </Typography>
                </DialogContent>
            </Dialog>
            </ThemeProvider>

        </>
    )
}