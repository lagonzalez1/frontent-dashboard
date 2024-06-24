import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
     Stack, IconButton, TextField, InputLabel, Alert, Divider, AlertTitle, Chip, 
     Dialog, DialogContent, DialogTitle, 
     Grid,
     Zoom} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useParams } from "react-router-dom";
import { waitlistRequest,checkDuplicatesRequest, isBusinesssOpen, getBusinessForm, getBusinessTimezone} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTime } from "luxon";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, useTheme } from "@emotion/react";
import { ClientWelcomeTheme, ClientWelcomeThemeDark } from "../../theme/theme";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import LoadingButton from '@mui/lab/LoadingButton';
import "../../css/Welcome.css";
import { CloudDone } from "@mui/icons-material";


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
            externalWaitlistRequest(values);
        },
    });

    const { link } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({title: null, body: null});
    const [openErrors, setOpenErrors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const [showDisclosure, setShowDisclosure] = useState(false);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false});
    const [open, setOpen] = useState(false);
    const [zoomIntoView, setZoomIntoView] = useState(false);
    const [disable, setDisable] = useState(false);
    const [seconds, setSeconds] = useState(180);
    const [timezone, setTimezone] = useState(null);
    
    
    const getTimezone = () => {
        getBusinessTimezone(link)
        .then(response => {
            setTimezone(response.timezone)
        })
        .catch(error => {
            setErrors({title: 'Error', body: error.msg});
            setDisable(true); 
        })
    }

    const [formFields, setFormFields] = useState({
        fullname: null,
        phone: null,
        email: null,

    })


    useEffect(() => {
        setZoomIntoView(true);
        getTimezone();
        getbusinessFormDetails();
        getPreview();
        
        return() => {
            setLoading(false)
        }
    }, []);


    

    const getbusinessFormDetails = () => {
        const time = DateTime.local().toISO()
        Promise.all([
            isBusinesssOpen(link, time),
            getBusinessForm(link)
        ])
        .then(([businessOpenResponse, businessFormResponse]) => {
            setAcceptingStatus({waitlist: businessOpenResponse.acceptingWaitlist, appointments: businessOpenResponse.acceptingAppointments});
            setOpen(businessOpenResponse.isOpen);
            setFormFields(businessFormResponse.inputFields);
            if (businessOpenResponse.acceptingWaitlist === false && businessOpenResponse.acceptingAppointments === false && businessOpenResponse.isOpen === false) {
                setOpen(false);
                setDisable(true);
            }
        })
        .catch(error => {
            if (error.error.status === 404) {
                navigate(`/welcome/${link}`);
            }
            setOpenErrors(true);
            setErrors({title: 'Error', body: error.msg});
            setDisable(true); 
        })
        .finally(() => {
            setLoading(false);
        })
    }


    const closeDisclosure = () => {
        setShowDisclosure(false);
    }

    const getPreview = () => {
        const clientJson = sessionStorage.getItem(CLIENT);
        if (clientJson === null) {
            setErrors({title: 'Error', body: 'There is nothing saved on file.'});
            return 
        }
        const clientData = JSON.parse(clientJson);
        setPreview(() => ({...clientData, date: DateTime.fromISO(clientData.date)})) ;
    }

    const externalWaitlistRequest = (values) => {
        const clientPayload = sessionStorage.getItem(CLIENT);
        if (clientPayload === null) { 
            setZoomIntoView(false);
            navigate(`/welcome/${link}`);
            return
        }
        // This might be causing my issues
        const clientStorage = JSON.parse(clientPayload);
        let timestamp = DateTime.local().toISO();
        let payload = { link, timestamp, timestampOrigin: timestamp, ...clientStorage, ...values, timezone}
        let duplicatePayload = { ...clientStorage, link, values}
        checkDuplicatesRequest(duplicatePayload)
        .then((response) => {
            if (response.flag === true) {
                setErrors({title: 'Issue found', body: response.msg});
                return;
            }
            if(response.duplicate === true) {
                // This should allow the request to complete if less than 4
                navigate(`/welcome/${link}/visits/${response.identifier}`);
            }else{
                // Make the real request to backend.
                return waitlistRequest(payload);
            }
        })
        .then(response => {
            if (response) {
                navigate(`/welcome/${link}/visits/${response.unid}`);
            }
        })
        .catch(error => {
            setOpenErrors(true);
            setErrors({title: 'Error', body: error.msg});
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
        sessionStorage.removeItem(CLIENT);
        navigate(`/welcome/${link}`)
    }

    const redirectBackPage = () => {
        navigate(`/welcome/${link}/selector`)
    }


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
          setSeconds(prevSeconds => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            } else {
              clearInterval(intervalId); // Clear interval when countdown reaches 0
              redirectBack(); // Execute function when countdown reaches 0
              return 0; // Ensure the countdown stops at 0
            }
          });
        }, 1000);
      
        // Clear interval when unmounting
        return () => clearInterval(intervalId);
      }, []);

    return (
        <>  
            <ThemeProvider theme={ClientWelcomeThemeDark}>
            <Box className="center-box">
                <Grid 
                    container
                    sx={{pt: 2, pb: 1}}
                    spacing={1}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"                      
                >
                    <Zoom in={zoomIntoView} mountOnEnter unmountOnExit>
                        <Grid className="grid-item" item xs={12} md={4} lg={3} xl={3}>
                        <Card variant="outlined" sx={{pt: 1, borderRadius: 3, p: 3}}>
                        <Container sx={{ textAlign: 'left'}}>
                            <IconButton onClick={ () => redirectBackPage() }>
                                <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                            </IconButton>
                        </Container>
                        <CardContent sx={{textAlign: 'center'}}>
                            
                            {openErrors && <Alert color={'error'}>
                                <AlertTitle>
                                    <Typography variant="subtitle1" textAlign={'left'} fontWeight={'bold'}>
                                        {errors.title}
                                    </Typography>
                                </AlertTitle>
                                <Typography variant="body2" textAlign={'left'}>
                                - {errors.body}
                                </Typography>
                            </Alert>}
                        
                            <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                                {link}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Enter your details
                            </Typography>
                            <Typography variant="body2" textAlign={'center'} color={'error'} gutterBottom>
                                You have <strong>{`${formatTime(seconds)}`} </strong>to secure your spot!
                            </Typography>

                            
                            <form onSubmit={formik.handleSubmit}>
                            <Stack sx={{pt: 2}} spacing={1}>

                                { formFields && formFields.fullname ? (
                                    <>
                                    <InputLabel htmlFor="fullname" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Name *</InputLabel>
                                        <TextField
                                            id="fullname"
                                            name="fullname"
                                            value={formik.values.fullname}
                                            onChange={formik.handleChange}
                                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                            helperText={formik.touched.fullname && formik.errors.fullname}
                                        /> 
                                </>
                                ): null}
                                
                                { formFields && formFields.phone ? (
                                    <>
                                    <InputLabel htmlFor="phoneNumber" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Phone *</InputLabel>
                                        <TextField
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="xxx-xxx-xxxx"
                                            value={phoneNumber}
                                            onChange={(event) => phoneNumberChange(event)}
                                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                        />
                                    </>
                                ) : null}
                                
                                
                                { formFields && formFields.email ? (
                                    <>
                                        <InputLabel htmlFor="email" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Email *</InputLabel>
                                        <TextField
                                        id="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />    
                                    
                                    </>
                                ): null}
                                
                                
                                <Divider/>
                                <LoadingButton disabled={disable} loading={loading} sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
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
                                                <Alert icon={<CloudDone />} severity='warning' variant="standard" sx={{ textAlign: 'left'}}>
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
                        <CardActions sx={{ justifyContent: 'center'}}>

                            <Stack alignContent={'center'} spacing={2}>
                                <Chip 
                                    sx={{ maxWidth: '80x', color:"black"}} variant="outlined" size="small" clickable={true} 
                                    onClick={() => setShowDisclosure(true)} icon={<InfoOutlinedIcon fontSize="small"/>} 
                                    label={'Disclosure'}> 
                                </Chip> 
                                <Typography textAlign={'center'} gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>

                            </Stack>
                        </CardActions>
                        </Card>
                        </Grid>
                    </Zoom>
            </Grid>
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