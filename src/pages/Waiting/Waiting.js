import React, {useState, useEffect } from "react";
import { Box, Swtich , Paper, Slide, Alert, Card, CardContent, Typography, Stack, Container, Button, Divider, CardActions,
    AlertTitle, Dialog, DialogContent, DialogTitle,DialogActions, ButtonBase, Snackbar, CircularProgress, Link, 
Collapse, IconButton, DialogContentText, Grow, TextField, Select, Grid, Menu, MenuItem, CardActionArea, Chip, LinearProgress, ThemeProvider} from "@mui/material";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useNavigate, useParams } from "react-router-dom";
import { APPOINTMENT, WAITLIST } from "../../static/static.js";
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import * as Yup from 'yup';
import "../../css/Waiting.css";
import { DateTime } from "luxon";
import { Field, Formik,Form, ErrorMessage } from "formik";
import ErrorIcon from '@mui/icons-material/Error';
import { CheckCircle, Check } from "phosphor-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { getIdentifierData, leaveWaitlistRequest, requestBusinessArguments, requestClientStatus,
    getAvailableAppointments, requestClientEditApp, getEmployeeList, PHONE_REGEX, iconsList, placementTitle } from "./WaitingHelper.js";
import { DatePicker } from "@mui/x-date-pickers";
import { ClientWaitingTheme } from "../../theme/theme.js";



export default function Waiting() {

    const { link, unid } = useParams();
    const navigate = useNavigate();
    
    const [alert, setAlert] = useState({title: null, message: null, color: null, open: false});
    const [message, setMessage] = useState(null);
    
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wait, setWait] = useState(false);

    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [titles, setTitles] = useState({});
    const [status, setStatus] = useState(false);
    const [type, setType] = useState(null);


    const [appointments, setAppointments] = useState(null);
    const [editClient, setEditClient] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [updateClient, setUpdateClient] = useState(false);
    const [serviceList, setServiceList] = useState(null);
    const [employeeList, setEmployeeList] = useState(null);
    const [position, setPosition] = useState(null);


    const [openStatus, setOpenStatus ] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [args, setArgs] = useState(null);

    const [clientStatus, setClientStatus] = useState({
        noShow: false,
        here: false,
        parking: false,
        late: false
    })

    let initialValues = {
        fullname: user ? user.fullname : '',
        email: user ? user.email: '',
        phone: user ? user.phone : '',
        size: user ? user.partySize: 1,
        service_id: '',
        employee_id: '',
        start: '',
        end: '',
        appointmentDate: '',
        notes: user ? user.notes : '',
    };
    
    const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().matches(PHONE_REGEX, 'Phone number must be in the format xxx-xxx-xxxx')
        .required('Phone number is required'),
        email: Yup.string(),
        size: Yup.number(),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        start: Yup.string(),
        end: Yup.string(),
        appointmentDate: Yup.string(),
        notes: Yup.string(),
    });


    function isOnlyOneTrue(obj) {
        const trueValues = Object.values(obj).filter(value => value === true);
        return trueValues.length === 1;
    }

    const closeSnack = () => {
        setOpenSnack(false);
    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleStatusClose = () => {
        setUpdateClient(false);
        setClientStatus({
            here: false,
            parking: false,
            late: false
        })
    }

    useEffect(() => {
        loadUserAndBusinessArgs();
    }, []);
    
    const loadUserAndBusinessArgs = () => {
        const timestamp = DateTime.local().toISO();
        setLoading(true);
        Promise.all([
            getIdentifierData(link, unid, timestamp),
            requestBusinessArguments(link)
        ])
        .then(([userResponse, argsResponse]) => {
            if (userResponse.status === 201) {
                setErrors(userResponse.data.msg);
                setUser(userResponse.data.client);
            }  
            if (userResponse.status === 200) {
                const user = userResponse.data.client;
                setPosition(userResponse.data.clientPosition);
                setUser(userResponse.data.client);
                setClientStatus({ here: user.status.here, parking: user.status.parking, late: user.status.late, noShow: user.status.noShow});
                setStatus(userResponse.data.statusTrigger); 
                setType(userResponse.data.type);
                if (user.status.notified === true){
                    setAlert({title: 'Notification', message: 'You have been notified from the business!', color: 'warning', open: true})
                }
            }
            setArgs(argsResponse);
            setServiceList(argsResponse.services);
        })
        .catch(error => {
            setErrors('Error: ' + error.response.data.msg);
        })
        .finally(() => {
            setLoading(false);
        });
    };
    

    const copyToClipboardHandler = () => {
        copyToClipboard()
        .then(() => {
            setOpenSnack(true);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const navigateToWaitlist = () => {
        if (args.present.waitlist === true) {
            const url = `https://waitonline.us/welcome/${link}/waitlist`
            window.open(url, '_blank');
        }
        else {
            setAlert({title: 'Error', message: 'Waitlist is currently disabled for this business.', color: 'error', open: true});
            
        }
    }

    async function copyToClipboard () {
        let currentLink = window.location.href;
        if ('clipboard' in navigator){
            return await navigator.clipboard.writeText(currentLink);
        }else {
            return document.execCommand('copy', true, currentLink)
        }        
    }

    const handleEmployeeChange = (employee, setFieldValue) => {
        setAppointments(null);
        setFieldValue('employee_id', employee.id);
    }

    
    const leaveWaitlist = () => {
        leaveWaitlistRequest(link, unid, type)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            handleClose();
            navigate(`/welcome/${link}/${type}/landingPage`)
        })
    }


    const statusRequest = () =>{
        if (!isOnlyOneTrue(clientStatus)){
            handleStatusClose();
            setAlert({title: 'Warning', message: 'Please only select one status button.', color: 'warning', open: true});
            
            return;
        }
        const payload = { unid, link, ...clientStatus, type: user.type}
        requestClientStatus(payload)
        .then(response => {
            setMessage(response);
        })
        .catch(error => {
            setMessage(error)
        })
        .finally(() => {
            setAlert({title: null, message: null, color: null, open: false});
            handleStatusClose();
        })
    }

    const handleSubmit = (values, setSubmitting) => {
        console.log("handle submit called.");
        appointmentEdit(values);
    } 

    const handleAppointmentClick = (appointment, setFieldValue) => {
        setFieldValue('start', appointment.start);
        setFieldValue('end', appointment.end);
    }

    const appointmentEdit = (payload) => {
        const appointmentDate = DateTime.fromISO(selectedDate).toString();
        requestClientEditApp({...payload, appointmentDate, link, unid})
        .then(response => {
            setMessage(response);
        })
        .catch(error => {
            console.log(error)
            setErrors(error);
        })
        .finally(() => {
            setLoading(false);
            
        })
    }
    const FutureDatePicker = ({ label, value, onChange }) => {
    const currentDate = DateTime.local();

    return (
        <DemoContainer components={['DatePicker']}>
        <DatePicker
        label={label}
        sx={{
            width: '100%'
        }}
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
        minDate={currentDate}
        />
        </DemoContainer>
    );
    };

      
    const handleDateChange = (date) => {
        getAvailableEmployees(date);
        setSelectedDate(date);
    };



    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate,link)
        .then(response => {
            setEmployeeList(response);
        })
        .catch(error => {
            setErrors(error);
        })
    }

    const handleServiceChange = (service, setFieldValue, values) => {
        setFieldValue('service_id', service._id);
        searchAppointments(service._id, values.employee_id)
    }


    const searchAppointments = (service_id, employee_id) => {
        setWait(true);
        if (!selectedDate || !service_id || !employee_id) {
            setErrors('Missing date and service.');
            return;
        }
        const currentDate = DateTime.local();
        setErrors(null);
        const payload = { employeeId: employee_id, serviceId: service_id , appointmentDate: selectedDate, currentDate, link}
        
        getAvailableAppointments(payload)
        .then(response => {
            setAppointments(response.data)
        })
        .catch(error => {
            setErrors(error);
        })
        .finally(() => {
            setWait(false);
        })
    }


    const LoadHeader = () => {
        // No show case
        if(clientStatus.noShow === true) {
            return (
                <Stack spacing={2.5}>
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="circle_red">
                    <FontAwesomeIcon icon={faCircleExclamation} size="9x" color="#fc0303" />
                    </div>
                </Container>
                <Typography variant="h4" fontWeight="bold" > {'Please contact the business'} </Typography>
                <Typography variant="body2"> {'Your request is dweling under no show'}</Typography>
            </Stack>
                
            )
        }
        // Appointment case
        if (type === APPOINTMENT) {
            return (
            <Stack spacing={2.5}>
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="blob_appointment">
                        <EventAvailableRoundedIcon htmlColor="#fff8e5" sx={{ fontSize: 50 }} />
                    </div>
                </Container>
                <Typography variant="h5" fontWeight="bold"> Appointment details </Typography>
                <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                    <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                    </Typography>
                </Button>
            </Stack>
            );
        }
        // Waitlist case
        if (type === WAITLIST) {
            return (
            <Stack spacing={2}>
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
                <div className="circle_green">
                    { position <= 9 ? placementTitle[position].icon : <Check size={88} color="#40932a" weight="bold" />}
                </div>
                </Container>

                
                <Typography variant="h4" fontWeight="bold" > {position <= 9 ? placementTitle[position].message : 'Thank you for joining!'} </Typography>
                <Typography variant="body2" fontWeight={'bold'}> { position <= 9 ? `Currently ${position}` + placementTitle[position].abrv + ' in line.' + placementTitle[position].message2  : 'Please check back often for any updates' } </Typography>
                {status ? 
                    (
                        <>
                        <Divider />
                        <Button endIcon={<NotificationsActiveRoundedIcon/>} onClick={() => setUpdateClient(true)} variant="outlined" color="primary" sx={{ borderRadius: 10}}>
                            <Typography variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>Status
                        </Typography>
                        </Button>
                        </>
                    )
                    : 
                    (
                        <>
                        <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                            <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                            </Typography>
                        </Button>
                        </>
                    )
                    }
            </Stack>
            )
        }
    }

    const LoadFooter = () => {
        if (type === WAITLIST) {
            return(
                <>
                <Container sx={{ textAlign: 'left'}}>
                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Email </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.email : ''}</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Unique identifier </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.identifier : ''}</Typography>
                </Container>
                <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                    <Stack direction={'row'} spacing={2}>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info" startIcon={<IosShareRoundedIcon fontSize="small" />} onClick={() => copyToClipboardHandler()}>Share</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<FormatListNumberedRoundedIcon  fontSize="small"/>} onClick={() => navigateToWaitlist() }> Waitlist</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BlockRoundedIcon  fontSize="small"/>} onClick={() => setOpen(true)}> Cancel</Button>
                    </Stack>
                </Container>
                </>
            )
        }
        if (type === APPOINTMENT) {
            return (
                <>
                <Container sx={{ textAlign: 'left'}}>
                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Duration </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromFormat(user.start, 'HH:mm').toFormat('h:mm a') +  " - " + DateTime.fromFormat(user.end, 'HH:mm').toFormat('h:mm a') : ''}</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Date </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromISO(user.appointmentDate).toFormat('LLL dd yyyy') : ''}</Typography>

                    <Typography variant="subtitle2" sx={{ color: "gray"}}> Unique identifier </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.identifier : ''}</Typography>
                </Container>

                <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                    <Stack direction={'row'} spacing={2}>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<NotificationsActiveRoundedIcon  fontSize="small"/>} onClick={() => setUpdateClient(true)}>Status</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BorderColorRoundedIcon  fontSize="small"/>} onClick={() => setEditClient(true)}>Edit</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BlockRoundedIcon  fontSize="small"/>} onClick={() => setOpen(true)}>Cancel</Button>
                    </Stack>
                </Container>
                </>
            )
        }
    }


    const LoadErrorHeader = () => {
        if (errors !== null) {
            return(
                <Stack spacing={2.5}>
                    <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div className="circle_red">
                        <FontAwesomeIcon icon={faCircleExclamation} size="9x" color="#fc0303" />
                        </div>
                    </Container>
                    <Typography variant="h4" fontWeight="bold"> {'Error!'} </Typography>
                    <Typography variant="h5"> {'Your request is no longer valid for the reason listed below'}</Typography>
                    <Typography variant="body2"> {errors}</Typography>
                    <Typography variant="body2"> Unique identifier: {unid}</Typography>

                </Stack>
            )
        }
    }

    return(
        <>
            <ThemeProvider theme={ClientWaitingTheme}>
            <Box className="center-box" sx={{ pt: 3 }}>
                    <Card className="custom-card" sx={{ textAlign:'center', p: 2, borderRadius: 5, boxShadow: 0 }}>
                    <Box sx={{ width: '100%' }}>
                    <Collapse in={alert.open}>
                        <Alert
                        severity='warning'
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert({title: null, message: null, open: false, color: null});
                                setMessage(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        <AlertTitle textAlign="left"><strong>{alert.title}</strong></AlertTitle>
                        {alert.message}
                        </Alert>
                    </Collapse>
                    </Box>
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                        </Typography>
                        {loading ? 
                        <CircularProgress sx={{ p: 3}} /> : 
                        <CardContent>
                            
                            
                        { editClient ? 
                        (<Box>
                        <Grow in={editClient}>
                            <Box>
                            <IconButton onClick={ () => setEditClient(false) }>
                                <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                            </IconButton>

                            <Typography variant="h5" fontWeight="bold">
                                Edit appointment
                            </Typography>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                            {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
                                
                                <Form>
                                <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                                    <Field
                                    as={TextField}
                                    id="fullname"
                                    size="small"
                                    name="fullname"
                                    label="Customer name"
                                    placeholder="Customer name"
                                    error={touched.fullname && !!errors.fullname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="fullname" component="div" />

                                    <Field
                                    as={TextField}
                                    id="email"
                                    size="small"
                                    name="email"
                                    disabled={true}
                                    label="Customer email"
                                    placeholder="Email"
                                    error={touched.email && !!errors.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="email" component="div" />


                                    <Field
                                    as={TextField}
                                    id="phone"
                                    size="small"
                                    name="phone"
                                    disabled={true}
                                    label="Phone"
                                    placeholder="xxx-xxx-xxxx"
                                    error={touched.phone && !!errors.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="phone" component="div" />

                                
                                    <Typography gutterBottom variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Select your new date </Typography>
                                    <Box>
                                        <FutureDatePicker label="Appointment date" value={selectedDate} onChange={handleDateChange}  />
                                    </Box>

                                        {
                                            employeeList && 
                                            (
                                            <Box>
                                            <Box sx={{pt: 0, display: employeeList !== 0 ? 'flex': 'none'}}>
                                                <Typography gutterBottom variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                            </Box>

                                                <Grid
                                                    container 
                                                    direction={'row'}
                                                    rowSpacing={1}
                                                    columnSpacing={1}
                                                
                                                >
                                                    {
                                                        employeeList.map((employee) => {
                                                            return (
                                                                <Grid item key={employee.id}>
                                                                    <Card className="card-style" sx={{backgroundColor: values.employee_id === employee.id ? "#E8E8E8": "" }} variant="outlined" onClick={() => handleEmployeeChange(employee, setFieldValue)}>
                                                                        <CardActionArea>
                                                                            <CardContent>
                                                                                <PersonIcon />
                                                                                <Typography variant="caption">{employee.fullname}</Typography>
                                                                            </CardContent>
                                                                        </CardActionArea>
                                                                    </Card>
                                                                </Grid>
                                                            
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                                </Box>

                                            )

                                        }
      
                                    
                                    {values.employee_id ? (
                                        
                                            <Box>
                                                <Box sx={{pt: 0, display: employeeList !== 0 ? 'flex': 'none'}}>
                                                    <Typography gutterBottom variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                                </Box>
                                                <Grid
                                                    container 
                                                    direction={'row'}
                                                    rowSpacing={1}
                                                    columnSpacing={1}
                                                    sx={{pt: 0}}
                                                >
                                                    {
                                                        serviceList ? 
                                                        serviceList
                                                        .filter((service) => service.employeeTags.includes(values.employee_id))
                                                        .map((service) => (
                                                            <Grid item key={service._id}>
                                                                <Card variant="outlined" className="card-style" sx={{backgroundColor: values.service_id === service._id ? "#E8E8E8": "" }} onClick={() => handleServiceChange(service, setFieldValue, values)}>
                                                                    <CardActionArea>
                                                                        <CardContent>

                                                                        <Grid container alignItems="center">
                                                                            <Grid item xs>
                                                                                <Typography component="div" variant="subtitle2" textAlign={'center'} fontWeight={'bold'}>{service.title}</Typography>
                                                                            </Grid>
                                                                            <Grid item>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Typography gutterBottom color="text.secondary" variant="body2">
                                                                            { service.description }
                                                                        </Typography>
                                                                        <Divider variant="middle" />                                                                    
                                                                        <Stack sx={{m: 1}} spacing={0.5}>
                                                                            <Chip size="small" label={"Duration: " + service.duration + " min" } avatar={<AvTimerRoundedIcon fontSize="small" />} />
                                                                            <Chip size="small" label={"Cost: " + service.cost} avatar={<PaidRoundedIcon fontSize="small" />} />
                                                                        </Stack>
                                                                        </CardContent>
                                                                    </CardActionArea>
                                                                </Card>
                                                            </Grid>
                                                        )):
                                                        <Grid item>
                                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>No availability found</Typography>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Box>
                                    ) : null}

                                    
                                    {
                                        (appointments !== null) ? 
                                        (
                                            
                                            <>
                                            <Box sx={{ pt:0, display: appointments ? 'flex' : 'none', paddingRight: 0, paddingLeft: 0}}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>                                                
                                            </Box>
                                            { wait ? (<LinearProgress />) : (
                                            <div style={{ width: '100%', height: '100%',overflowX: 'auto'}}>
                                                {
                                                    wait ? <LinearProgress />: 
                                                
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap'}}> 
                                                <Stack direction={'row'} sx={{ backgroundColor: 'lightgray'}}>
                                                
                                                { 
                                                Object.keys(appointments).map((key, index) => {
                                                    const appointment = appointments[key];
                                                    return (
                                                        <Button 
                                                            sx={{ margin: 1, borderRadius: 10}}
                                                            variant={values.start === appointment.start ? "contained": "outlined"}
                                                            onClick={() => handleAppointmentClick(appointment, setFieldValue)} 
                                                            color={values.start === appointment.start ? 'primary': 'secondary'}
                                                            id={`appointment${index}`}>
                                                            <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                            <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{"-"}</Typography>
                                                            <Typography sx={{ whiteSpace: 'nowrap' }}  variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                        </Button>
                                                    )
                                                })
                                                }
                                                </Stack>
                                                </Box>
}
                                            </div>
                                            )} 

                                            </>
                                        )
                                        : null
                                    }
                                    <Divider variant="middle" />
                                    <Field
                                    as={TextField}          
                                    id="size"
                                    name="size"
                                    size="small"
                                    label="Party size"
                                    error={touched.size && !!errors.size}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="size" component="div" />


                                    <Field
                                    as={TextField}
                                    id="notes"
                                    name="notes"
                                    size="small"
                                    label="Notes"
                                    placeholder="Additional notes"
                                    error={touched.notes && !!errors.notes}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="notes" component="div" />

                                    <Button disabled={isSubmitting} type="submit" sx={{ borderRadius: 10}} variant="contained">Submit</Button>

                                </Stack>
                                </Form>
                            )}
                            </Formik>
                            </Box>
                        </Grow> 
                        </Box>)
                        :(   
                        <Stack sx={{ pt: 2}} spacing={3}>


                            {errors && <LoadErrorHeader />}
                            {user && <LoadHeader /> }
                            <Divider />
                            {user && <LoadFooter />}
                            
                            <Divider />
                        </Stack>
                        )}
                        
                        </CardContent>
                        }
                        <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                            <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                        </CardActions>
                    </Card>
            </Box>

            <Dialog
                id="leave_dialog"
                open={open}
                onClose={handleClose}
                maxWidth={'xs'}
            >
                
            <DialogTitle>
                <Box>
                    {type === APPOINTMENT && (<Typography variant="h5" fontWeight={'bold'}>Cancel appointment ? </Typography> )}
                    {type === WAITLIST && (<Typography variant="h5" fontWeight={'bold'}>Leave waitlist ? </Typography> )}
                </Box>
                
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                <Divider />
                    {type === APPOINTMENT && (<Typography variant="body2">Are you sure you want to give up your appointment?</Typography> )}
                    {type === WAITLIST && (<Typography variant="body2">This means that you will no longer receive notifications or updates regarding your position in line.</Typography> )}
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 7}} variant="contained" color="error" onClick={() => leaveWaitlist()}>Yes</Button>
            </DialogActions>
            </Dialog>

            <Dialog
                id="status_dialog"
                open={updateClient}
                onClose={handleStatusClose}
                minWidth={'xs'}
                maxWidth={'sm'}
            >
            <DialogTitle>
                <Typography variant="h5" fontWeight={'bold'}>Status</Typography>  
                <IconButton
                    aria-label="close"
                    onClick={handleStatusClose}
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
                <Divider />
                <Typography gutterBottom variant="body2" textAlign={'left'}>Please keep us updated on your current status <br/> <strong>Thank you!</strong></Typography>  
                <Container sx={{ width: '100%', mt: 1}}>
                <Stack spacing={1}>
                    <Button size="large" fullWidth color="primary"sx={{ borderRadius: 10}} variant={clientStatus.here ? "contained" : "outlined"}  startIcon={<EmojiPeopleIcon /> } onClick={() => setClientStatus((prev) => ({...prev, here: !clientStatus.here})) }>Here 1-2 min</Button>
                    <Button size="large" fullWidth color="warning" sx={{ borderRadius: 10}} variant={clientStatus.parking ? "contained" : "outlined"}  startIcon={<DirectionsCarFilledIcon /> } onClick={() => setClientStatus((prev) => ({...prev, parking: !clientStatus.parking})) }>Parking 3-5 min</Button>
                    <Button size="large" fullWidth color="error" sx={{ borderRadius: 10}} variant={clientStatus.late ? "contained" : "outlined"} startIcon={<WatchLaterIcon /> } onClick={() => setClientStatus((prev) => ({...prev, late: !clientStatus.late})) }>Late 7-15 min</Button>
                </Stack>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 7}} variant="contained" onClick={() => statusRequest()}>Update</Button>
            </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                open={openSnack}
                onClose={closeSnack}
                autoHideDuration={3000}
                message={'Copied to clipboard.'}
            >
            </Snackbar>
            
            </ThemeProvider>
        </>
    )
}