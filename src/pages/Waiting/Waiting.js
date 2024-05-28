import React, {useState, useEffect } from "react";
import { Box, Swtich , Paper, Slide, Alert, Card, CardContent, Typography, Stack, Container, Button, Divider, CardActions,
    AlertTitle, Dialog, DialogContent, DialogTitle,DialogActions, ButtonBase, Snackbar, CircularProgress, Link, Rating ,
Collapse, IconButton, DialogContentText, Grow, TextField, Select, Grid, Menu, MenuItem, CardActionArea, Chip, LinearProgress, ThemeProvider} from "@mui/material";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import StarIcon from '@mui/icons-material/Star';

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
import { Field, Formik,Form, ErrorMessage, useFormik } from "formik";
import { CheckCircle, Check, Star, Calendar, NavigationArrow, Share, Copy, Flag  } from "phosphor-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { getIdentifierData, leaveWaitlistRequest, requestBusinessArguments, requestClientStatus,
    getAvailableAppointments, requestClientEditApp, getEmployeeList, PHONE_REGEX, iconsList, placementTitle, requestClientReview, getBusinessTimezone, 
    acknowledgeChat} from "./WaitingHelper.js";
import { DatePicker } from "@mui/x-date-pickers";
import { ClientWaitingTheme } from "../../theme/theme.js";
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import { LoadingButton } from "@mui/lab";


export default function Waiting() {

    const { link, unid } = useParams();
    const navigate = useNavigate();
    
    const [alert, setAlert] = useState({title: null, message: null, color: null, open: false});
    const [message, setMessage] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [wait, setWait] = useState(false);

    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(false);
    const [type, setType] = useState(null);


    const [appointments, setAppointments] = useState(null);
    const [editClient, setEditClient] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [updateClient, setUpdateClient] = useState(false);
    const [serviceList, setServiceList] = useState(null);
    const [employeeList, setEmployeeList] = useState(null);
    const [position, setPosition] = useState(null);
    const [serving, setServing] = useState(false);
    const [review, setReview] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [business, setBusinessInfo] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [acknowledgeLoading, setAcknowledgeLoading] = useState(false);

    const [service, setService] = useState(null);
    const [loader, setLoader] = useState(false);



    const [openSnack, setOpenSnack] = useState(false);
    const [presentArgs, setPresent] = useState(null);

    const [clientStatus, setClientStatus] = useState({
        noShow: false,
        here: false,
        parking: false,
        late: false,
        complete: false,
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

    
    const removeSetEdit = () => {
        setEditClient(false);
        setAppointments(null);
    }


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

    const [timezone, setTimezone] = useState(null);
    
    
    const getTimezone = () => {
        getBusinessTimezone(link)
        .then(response => {
            setTimezone(response.timezone)
        })
        .catch(error => {
            setErrors({title: 'Error', body: error.msg});
            setDisabled(true); 
        })
    }

    useEffect(() => {
        getTimezone();
        loadUserAndBusinessArgs();
        return () => {
            setLoading(false)
        }
    }, []);
    
    const loadUserAndBusinessArgs = () => {
        const timestamp = DateTime.local().setZone(timezone).toISO();
        setLoading(true);
        Promise.all([
            getIdentifierData(link, unid, timestamp),
            requestBusinessArguments(link)
        ])
        .then(([userResponse, argsResponse]) => {
            if (userResponse.status === 203){
                setReview(userResponse.data.review);
                setCompleted(userResponse.data.completed);
            }
            if (userResponse.status === 201) {
                setErrors(userResponse.data.msg);
                setUser(userResponse.data.client);
            }  
            if (userResponse.status === 200) {
                const user = userResponse.data.client;
                setEmployeeName(userResponse.data.employeeName);
                setService(userResponse.data.service);
                setServing(user.status.serving);
                setPosition(userResponse.data.clientPosition);
                setUser(userResponse.data.client);
                setClientStatus({ here: user.status.here, parking: user.status.parking, late: user.status.late, noShow: user.status.noShow});
                setStatus(userResponse.data.statusTrigger); 
                setType(userResponse.data.type);
                // Display the notifications
                if (user.status.notified === true){
                    setAlert({title: argsResponse.notification.title, message: argsResponse.notification.message, color: 'warning', open: true});
                }
            }
            setBusinessInfo(argsResponse.businessDetails);
            setPresent(argsResponse.present);
            setServiceList(argsResponse.services);
        })
        .catch(error => {
            console.log(error);
            //setErrors('Error: ' + error.data.msg);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    

    const handleDirectionsClick = () => {
        copyAddressToClipboard()
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
        if (presentArgs.waitlist === true) {
            const url = `https://waitonline.us/welcome/${link}/waitlist`
            window.open(url, '_blank');
        }
        else {
            setAlert({title: 'Error', message: 'Waitlist is currently disabled for this business.', color: 'error', open: true});
            
        }
    }

    async function copyAddressToClipboard () {
        let businessAddress = "";
        if ('clipboard' in navigator){
            return await navigator.clipboard.writeText(businessAddress);
        }else {
            return document.execCommand('copy', true, businessAddress)
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
            setAlert({title: 'Success', open: true, color: 'success', message: response})
        })
        .catch(error => {
            setAlert({title: 'Error', open: true, color: 'error', message: error})
        })
        .finally(() => {
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
        setLoading(true);
        if (selectedDate === "" || selectedDate === null) {
            setErrors('Please select a valid date.');
            setLoading(false);
            return; 
        }
        requestClientEditApp({...payload, selectedDate : selectedDate.setZone(timezone).toISO(), link, unid})
        .then(response => {
            setAlert({title: 'Status', message: response, open: true, color: 'warning'});
            setEditClient(false);
        })
        .catch(error => {
            console.log(error);
            setAlert({title: 'Error!', message: error.response.msg, open: true, color: 'warning'});
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


    const ChatBox = ({chat}) => {
        if (chat.body) {
            return (
                <Alert
                    severity='success'
                    sx={{ mb: 2 }}
                    icon={<ChatRoundedIcon />}
                    >
                        <AlertTitle textAlign="left"><strong>Message from establishment</strong></AlertTitle>
                        <Stack>
                        <Typography textAlign={'left'} variant="body2">{chat ? chat.body: null}</Typography>
                        <Typography textAlign={'left'} variant="caption">{chat ? "updated: " + DateTime.fromJSDate(new Date(chat.timestamp)).toFormat('LLL dd hh:mm a'): null}</Typography>
                       </Stack>
                       {chat && chat.acknowledge === true ? <Button endIcon={<CheckCircle/>}>acknowledged</Button> : <LoadingButton loading={acknowledgeLoading} onClick={() => updateChatAcknowledge()}>acknowledge</LoadingButton>}

                </Alert>
            )
        }else {
            return null;
        }
    }

    const updateChatAcknowledge = () => {
        setAcknowledgeLoading(true);
        acknowledgeChat(user._id, link, user.type)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false);
            setAcknowledgeLoading(false);
        })
    }

      
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
        setLoader(true)
        setErrors(null);
        const currentDate = DateTime.local().setZone(timezone).toISO()
        const payload = { employeeId: employee_id, serviceId: service_id , appointmentDate: selectedDate.setZone(timezone).toISO(), currentDate, link}
        getAvailableAppointments(payload)
        .then(response => {
            setAppointments(response.data)
        })
        .catch(error => {
            setErrors(error);
        })
        .finally(() => {
            setLoader(false);
            setWait(false);
        })
    }

    

    const LoadHeader = ({presentArgs}) => {
        // No show case
        if(clientStatus.noShow === true) {
            return (
                <Stack spacing={2.5}>
                <Container sx={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
                    <div className="circle_red">
                    <FontAwesomeIcon icon={faCircleExclamation} size="9x" color="#fc0303" />
                    </div>
                </Container>
                <Typography textAlign={'center'} variant="h4" fontWeight="bold" > {'Please contact the business'} </Typography>
                <Typography textAlign={'center'} variant="body2"> {'Your request is dweling under no show'}</Typography>
            </Stack>
                
            )
        }

        if (serving === true) {
            return (
                <Stack direction={'column'}>
                    
                    <Container sx={{display: 'flex', justifyContent: 'center',  justifyItems: 'center'}}>
                    <div className="blob_appointment">
                        <Star size={88} color="white" weight="thin" />
                    </div>
                </Container>
                    <Typography textAlign={'center'} variant="h4" fontWeight="bold" > {'Thanks for choosing us!'} </Typography>
                    <Typography textAlign={'center'} variant="body2" fontWeight={'bold'}> {'Enjoy your service, write us a review here once your service is complete!'} </Typography>
                </Stack>
            )
        }
        
        // Appointment case
        if (type === APPOINTMENT) {
            return (
            <Stack spacing={2.0}>
                <Container sx={{display: 'flex', justifyContent: 'center',  justifyItems: 'center'}}>
                    <div className="blob_appointment">
                        <Calendar color="white" size={70} weight="light"/>
                    </div>
                </Container>
                <Typography textAlign={'center'} variant="h5" fontWeight="bold"> Appointment details </Typography>
                <Typography textAlign={'center'} variant="body2"> Keep this page open for any updates!</Typography>

                <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                    <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                    </Typography>
                </Button>
                <ChatBox chat={user.chat} />
            </Stack>
            );
        }
        // Waitlist case
        if (type === WAITLIST) {
            return (
            <Stack spacing={2}>
                <Container sx={{display: 'flex', justifyContent: 'center',  justifyItems: 'center'}}>
                
                <div className="circle_green">
                    { presentArgs.position === true ? (
                        <>
                        { position <= 9 ? placementTitle[position].icon : <Check size={88} color="#40932a" weight="bold" />}

                        </>
                    ): 
                        <>
                            <Check size={88} color="#40932a" weight="bold" />
                        </>
                    }
                </div>
                </Container>
                {
                    presentArgs.position === true ? (
                        <>
                        <Typography textAlign={'center'} variant="h4" fontWeight="bold" > {position <= 9 ? placementTitle[position].message : 'Thank you for joining!'} </Typography>
                        <Stack>
                            <Typography textAlign={'center'} variant="body2" fontWeight={'bold'}> { position <= 9 ? `Currently ${position}` + placementTitle[position].abrv + ' in line': null } </Typography>
                            <Typography variant="body2" textAlign={'center'} fontWeight={'bold'}> { position <= 9 ? placementTitle[position].message2 : 'Please check back often for any updates'} </Typography>
                        </Stack>        
                        </>
                    ):
                    (
                        <>
                        <Typography variant="h4" fontWeight="bold" > {'Thank you for joining!'} </Typography>
                        <Stack>
                            <Typography variant="body2" fontWeight={'bold'} textAlign={'center'}> {'Keep an eye out for any notifications on this page'} </Typography>
                            <Typography variant="body2" fontWeight={'bold'} textAlign={'center'}> { 'Please check back often'} </Typography>
                        </Stack>  
                        </>
                    )
                }
                
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
                        <ChatBox chat={user.chat} />

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
                    <Typography variant="caption" sx={{ color: "gray"}}> Name </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Phone </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Email </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.email : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Unique identifier </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.identifier : ''}</Typography>
                </Container>
                {serving !== true &&
                <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                    <Stack direction={'row'} spacing={2}>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info" startIcon={<IosShareRoundedIcon fontSize="small" />} onClick={() => copyToClipboardHandler()}>Share</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<FormatListNumberedRoundedIcon  fontSize="small"/>} onClick={() => navigateToWaitlist() }> Waitlist</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BlockRoundedIcon  fontSize="small"/>} onClick={() => setOpen(true)}> Cancel</Button>
                    </Stack>
                </Container>}
                </>
            )
        }
        if (type === APPOINTMENT) {
            return (
                <>
                <Grid container justifyItems={'center'} alignItems={'center'} spacing={1}>
                    <Grid item xs>
                    <Card variant="outlined">
                        <CardActionArea onClick={ () => handleDirectionsClick() }>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                            <NavigationArrow alignmentBaseline="center" weight="duotone" size={24} />
                            <Typography variant="caption">Directions</Typography>
                        </CardContent>
                        </CardActionArea>

                        </Card>
                    </Grid>

                    <Grid item xs>
                    <Card variant="outlined">
                        <CardActionArea onClick={() => copyToClipboardHandler()}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                <Share alignmentBaseline="center" weight="duotone" size={24} />
                                <Typography variant="caption">Share</Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
                <Container sx={{ textAlign: 'left'}}>
                    <Typography variant="caption" sx={{ color: "gray"}}> Name </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Phone </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Duration </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromFormat(user.start, 'HH:mm').toFormat('h:mm a') +  " - " + DateTime.fromFormat(user.end, 'HH:mm').toFormat('h:mm a') : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Date </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromISO(user.appointmentDate).toFormat('LLL dd yyyy') : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Employee </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{employeeName ? employeeName : ''}</Typography>

                    <Typography variant="caption" sx={{ color: "gray"}}> Unique identifier </Typography>
                    <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.identifier : ''}</Typography>
                    
                </Container>
                {serving !== true &&
                <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                    <Stack direction={'row'} spacing={2}>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<NotificationsActiveRoundedIcon  fontSize="small"/>} onClick={() => setUpdateClient(true)}>Status</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BorderColorRoundedIcon  fontSize="small"/>} onClick={() => setEditClient(true)}>Edit</Button>
                        <Button disabled={errors ? true: false} size="small" variant="text" color="info"  startIcon={<BlockRoundedIcon  fontSize="small"/>} onClick={() => setOpen(true)}>Cancel</Button>
                    </Stack>
                </Container>}
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
                    <Typography textAlign={'center'} variant="h4" fontWeight="bold"> {'Error!'} </Typography>
                    <Typography textAlign={'center'} variant="h5"> {'Your request is no longer valid for the reason listed below'}</Typography>
                    <Typography textAlign={'center'} variant="body2"> {errors}</Typography>
                    <Typography textAlign={'center'} variant="body2"> Unique identifier: {unid}</Typography>

                </Stack>
            )
        }
    }

    const ReviewHeader = () => {
        return (
            <Stack direction={'column'}>
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="blob_appointment">
                    <Star size={88} color="white" weight="thin" />
                </div>
            </Container>
                <Typography textAlign={'center'} variant="h4" fontWeight="bold" > {'Thank you for choosing us'} </Typography>
                <Typography textAlign={'center'} variant="body2"> {'Enjoyed your service ? '} </Typography>
                <Typography textAlign={'center'} variant="body2"> {'Leave us a review'} </Typography>
            </Stack>
        )
    }

    const submitReview = (reviewValue, comment) => {
        setLoading(true)
        requestClientReview({rate: reviewValue, comment, link, unid})
        .then(response => {
            setAlert({title: response.msg, open: true, message: 'Your review is appreciated', color:'success'});
            setCompleted(true)
            setTimeout(() => {
                loadUserAndBusinessArgs();
              }, 5000);
        })
        .catch(error => {
            console.log(error)
            setUser(null)
            setReview(null)
            console.log(error)
        })
        .finally(() => {
            setLoading(false);
            setUser(null)
            setReview(null)
        })

    }

    const ReviewBody = () => {

        const [reviewValue, setReviewValue] = useState(2);
        const [hover, setHover] = useState(-1);
        const [reviewComment, setReviewComment] = useState('');

        const labels = {
            0.5: 'Useless',
            1: 'Useless+',
            1.5: 'Poor',
            2: 'Poor+',
            2.5: 'Ok',
            3: 'Ok+',
            3.5: 'Good',
            4: 'Good+',
            4.5: 'Excellent',
            5: 'Excellent+',
          };
          
        function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
        }
        return (
            <>
                <Box
                    sx={{
                        width: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    >
                    <Rating
                        name="hover-feedback"
                        value={reviewValue}
                        precision={0.5}
                        getLabelText={getLabelText}
                        onChange={(event, newValue) => {
                            setReviewValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    {reviewValue !== null && (
                        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : reviewValue]}</Box>
                    )}
                </Box>

                <TextField value={reviewComment} onChange={e => setReviewComment(e.target.value)} multiline rows={3} label={'Comments'} />
                <Button sx={{borderRadius: 7}} onClick={() => submitReview(reviewValue, reviewComment)} variant="contained">Submit</Button>
            
            </>
        )
    }

    const CompleteCycle = () => {
        return (
            <Stack spacing={2}>
                <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
                <div className="circle_green">
                    <Flag size={68} color="#40932a" weight="duotone" />
                </div>
                </Container>
                <Typography textAlign={'center'} variant="h5" fontWeight={'bold'}>Thanks for completing our survey</Typography>
                <Typography textAlign={'center'} variant="body2" fontWeight={'bold'}>Feel free to close this page.</Typography>
            </Stack>
        )
    }

    {
        /***
         * 
         * identifierRequest -> Finds user information -> [User]
         *   -> If error, possible not found business, not found client, client under noshow. [setError, errors]( Displays Error sections) [review = false] [user = false]
         *   -> If review, true, possible review can be completed. On submit reload the page where the state changes based on identifierRequest. [setError, errors = false]( Displays Error sections) [review = true] [user = false]
         *          
         ***/
    }


    return(
        <>
            <ThemeProvider theme={ClientWaitingTheme}>

            <Box className="center-box">
                <Grid container
                    sx={{pt: 2, pb: 1}}
                    spacing={1}
                    direction={'column'}
                    alignItems={'center'}                    
                >
                <Grid className="grid-item" item xs={12} md={3} lg={4} xl={4}>
                    <Card variant="outlined" sx={{pt: 1, borderRadius: 5, p: 2}}>
                    <Typography sx={{pt: 1}} variant="body2" fontWeight="bold" color="gray" textAlign={'center'} gutterBottom>
                        <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                    </Typography>
                    {loading ? (
                    <Box>
                        <Container sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
                            <CircularProgress sx={{ p: 2}} />
                        </Container>
                    </Box>)
                    : 
                    <CardContent sx={{ paddingRight: 0, paddingLeft: 0}}>
                        <Box>
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
                                <Typography textAlign={'left'}>{alert.message}</Typography>
                            </Alert>
                        </Collapse>
                        </Box>
                        
                    { editClient ? 
                    (<Box>
                    <Grow in={editClient}>
                        <Box sx={{ mt: 0}}>
                        <IconButton onClick={ () => removeSetEdit() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>

                        <Typography textAlign={'center'} gutterBottom variant="h5" fontWeight="bold">
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
                                        <>
                                    <Box sx={{pt: 0, display: employeeList !== 0 ? 'flex': 'none'}}>
                                        <Typography gutterBottom variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                    </Box>
                                    <Container sx={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                        <Grid
                                            maxHeight={1}
                                            container 
                                            wrap='nowrap'
                                            flexDirection={'row'}
                                            rowSpacing={2}
                                            spacing={.5}
                                            alignItems="stretch"
                                        
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
                                    </Container>
                                        </>
                                    )
                                }
                                {values.employee_id ? (
                                        <>
                                        <Box sx={{pt: 0, display: employeeList !== 0 ? 'flex': 'none', overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                                <Typography gutterBottom variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Services available</Typography>
                                            </Box>
                                            <Container sx={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                            
                                            <Grid
                                                 maxHeight={1}
                                                 container 
                                                 wrap='nowrap'
                                                 flexDirection={'row'}
                                                 rowSpacing={2}
                                                 spacing={.5}
                                                 alignItems="stretch"
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
                                                                    <Typography className="large-desc" gutterBottom color="text.secondary" variant="body2">
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
                                        </Container>
                                        </>
                                        
                                ) : null}

                                
                                {

                                    
                                    (appointments !== null) ? 
                                    (
                                        
                                        <>
                                        <Box sx={{ pt:0, display: appointments ? 'flex' : 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>                                                
                                        </Box>
                                        <Container sx={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                        { wait ? (<LinearProgress />) : (
                                        <div style={{ width: '100%', height: '100%',overflowX: 'auto'}}>
                                            {
                                                wait ? <LinearProgress />: 
                                            
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap'}}> 
                                            <Stack direction={'row'}>
                                            
                                            { 
                                            Object.keys(appointments).map((key, index) => {
                                                const appointment = appointments[key];
                                                return (
                                                    <Button 
                                                        sx={{ margin: 1, borderRadius: 7}}
                                                        variant={values.start === appointment.start ? "contained": "outlined"}
                                                        onClick={() => handleAppointmentClick(appointment, setFieldValue)} 
                                                        color={values.start === appointment.start ? 'primary': 'secondary'}
                                                        id={`appointment${index}`}>
                                                        <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                        
                                                    </Button>
                                                )
                                            })
                                            }
                                            </Stack>
                                            </Box>
    }
                                        </div>
                                        )} 

                                        </Container>
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

                        {review ? <ReviewHeader /> : null }
                        {(review === false && completed === true) && <CompleteCycle /> }


                        {user && <LoadHeader presentArgs={presentArgs} /> }

                        <Divider />
                        {review ? <ReviewBody  /> : null }

                        {user && <LoadFooter />}
                        
                        <Divider />
                    </Stack>
                    )}
                    
                    </CardContent>
                    }
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>

                    {
                        service && service[0] ? (
                            <Container>
                                <Divider />
                                <Typography sx={{pt: 1}} fontWeight={'bolder'} textAlign={'center'} variant="h5">Your service</Typography>
                                <Typography variant="caption">Title</Typography>
                                <Typography fontWeight={'bold'} variant="subtitle1">{service ? service[0].title: null}</Typography>
                                <Typography variant="caption">Duration</Typography>
                                <Typography fontWeight={'bold'} variant="subtitle1">{service ? service[0].duration + "min": null}</Typography>
                                <Typography variant="caption">Cost</Typography>
                                <Typography fontWeight={'bold'} variant="subtitle1">{service ? service[0].cost: null}</Typography>
                                <Typography variant="caption">Description</Typography>
                                <Typography fontWeight={'bold'} variant="subtitle1">{service ? service[0].description: null}</Typography>
                            </Container>
                        ): null
                    }
                    </Card>
                </Grid>

                </Grid>
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
                <Alert
                    icon={<Copy size={20} />}
                    onClose={closeSnack}
                    severity="success"
                    variant="standard"
                >
                    <Typography variant="body1">Copied!</Typography>
                </Alert>
            </Snackbar>
            
            </ThemeProvider>
        </>
    )
}