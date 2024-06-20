import React, { useEffect, useState, useRef, useMemo } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Select, ButtonGroup, InputLabel, MenuItem, TextField, Grid, CardActionArea, Paper, Grow, Alert, Chip, Divider, AlertTitle, Tooltip, 
    useMediaQuery,
    Zoom,
    ListItemIcon,
    Avatar,
    LinearProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { getExtras, getEmployeeList,getAvailableAppointments, isBusinesssOpen, getBusinessPresent, getBusinessTimezone  } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSelector.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

import { ThemeProvider, useTheme } from "@emotion/react";
import { ClientWelcomeTheme } from "../../theme/theme";
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";
import { AttachMoney, AttachMoneyOutlined, AttachMoneyRounded, CloudDone, CloudDoneOutlined, CloudQueue, FiberManualRecord, Restore, RestoreRounded, SetMeal, SettingsEthernetRounded } from "@mui/icons-material";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { CurrencyCircleDollar, ClockClockwise, ClockCounterClockwise } from "phosphor-react";

export default function WelcomeSelector() {

    const { link } = useParams();

    const currentDate = DateTime.now();
    const navigate = useNavigate();

    const errorRef = useRef();
    const employeesRef = useRef();
    const servicesRef = useRef();
    const availabiltyRef = useRef();

    const [loading, setLoading] = useState(false);
    const [openEmployees, setOpenEmployees] = useState(false);
    const [openServices, setOpenServices] = useState(false);
    const [openAvailabity, setOpenAvailability] = useState(false);

    const [openSummary, setOpenSummary] = useState(false);
    const [openWaitlistSummary, setOpenWaitlistSummary] = useState(false);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false});

    const [alertAppointments, setAlertAppointment] = useState(false);
    const [errorMessage, setErrorMessage] = useState({title: '', body: ''});
    const [appointmentSearchErrors, setAppointmentSearchErrors] = useState({title: null, body: null, type: null});
    const [employeeSearchErrors, setEmployeeSearchErrors] = useState({open: false, title: null, body: null});
    const [timezone, setTimezone] = useState(null);


    const [open, setOpen] = useState(false);

    const [systemTypeSelected, setSystem] = useState(null);

    const [error, setError] = useState(null);
    const [slots, setSlots] = useState(false);
    const [disable, setDisable] = useState(false);
    const [zoomIntoView, setZoomIntoView] = useState(false);
    const [appointmentLoader,setAppointmentLoader ] = useState(false);    

    

    const [serviceTags, setServiceTags] = useState({}); 
    const [appointmentEmployees, setAppEmployees] = useState(null);

    const [waitlistData, setWaitlistData] = useState({
        fullname: null,
        serviceTitle: null,
        resourceTitle: null,
        employee_id: '',
        service_id: '',
        resource_id: '',
        notes: '',
        partySize: null,
    })
    const [appointmentData, setAppointmentData] = useState({
        fullname: null,
        serviceName: null,
        employee_id: null,
        service_id: null,
        resource_id: null,
        end: null,
        date: null,
        start: null,
        notes: null,
        partySize: null,
    });

    const [system, setBusinessSystem] = useState({
        waitlist: null,
        appointments: null,
        equalDate: null,
        autoDelete: null,
        maxAppointmentDate: null
    })

    const [businessPresent, setBusinessPresent] = useState({
        position: null,
        waittime: null,
        waitlist: null,
        services: null,
        employees: null,
        resources: null,
        servicePrice: null,
        notes: null
    });

    const [businessExtras, setBusinessExtras] = useState({
        maxDateAvailable: null,
        services: null,
        resources: null,
        employees: null,
        timezone: null
    })


    const appointmentSlotSelect = (duration) => {
        const {start, end} = duration;
        setAppointmentData((prev) => ({...prev, start: start, end: end}));
        setOpenSummary(true);
    }

    const setDataAndContinue = () => {
        if (systemTypeSelected === APPOINTMENT){
            if (appointmentData.date === null || appointmentData.start === null || appointmentData.end === null || appointmentData.employee_id === null){
                handleErrorRefChange(); // Trigger ref to show error message.
                setErrorMessage({title: 'Error', body: 'Please select a date, employee and service.'});
                return;
            }
            if (appointmentData.partySize > 1 && !isGuestServiceFilled() ) {
                handleErrorRefChange(); // Trigger ref to show error message.
                setErrorMessage({title: 'Error', body: 'Please select a service for each guest.'});
                return;
            }
            const payload = sessionStorage.getItem(CLIENT);
            if (payload === null) { 
                handleErrorRefChange(); // Trigger ref to show error message.
                setErrorMessage({title: 'Error', body: 'Unable to find previous saved values.'});
                return;
            }
            // Check if data is empty.
            let previousData = JSON.parse(payload);
            const object = {
                ...previousData,
                TYPE: APPOINTMENT,
                ...appointmentData,
                date: appointmentData.date.toISO(),
                serviceTags: serviceTags
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            setZoomIntoView(false);
            navigate(`/welcome/${link}/details`);   
            return;
        }
        if (systemTypeSelected === WAITLIST){
            const payload = sessionStorage.getItem(CLIENT);
            if (payload === null) { 
                handleErrorRefChange(); // Trigger ref to show error message.
                setErrorMessage({title: 'Error', body: 'Unable to find previous saved values.'});
                return;
            }
            let previousData = JSON.parse(payload);
            const object = {
                ...previousData,
                TYPE: WAITLIST,
                ...waitlistData,
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            setZoomIntoView(false);
            navigate(`/welcome/${link}/details`);

            return;
        }
        handleErrorRefChange(); // Trigger ref to show error message.
        setErrorMessage({title: 'Error', body: 'Please select from the options available.'});
        return;
    }

    const getPreviouslySaved = () => {
        const payload = sessionStorage.getItem(CLIENT);
        if (!payload) {
            setErrorMessage({title: 'Warning', body: 'Unable to get your party count, please start over.'});
            setDisable(true);
            setTimeout(() => {
                navigate(`/welcome/${link}`);
            }, 30000)
            return;
        }
        try {
            const previousData = JSON.parse(payload);
            // Always set the party size.
            setAppointmentData((prev) => ({...prev, partySize: previousData.partySize}))
            setWaitlistData((prev) => ({...prev, partySize: previousData.partySize}))

            if (previousData.TYPE === APPOINTMENT) {
                setAppointmentData({
                    ...previousData,
                    date: DateTime.fromISO(previousData.date)
                });
                setServiceTags({...previousData.serviceTags})
                setSystem(APPOINTMENT);
                setOpenSummary(true);
            }
            if (previousData.TYPE === WAITLIST) {
                setWaitlistData({...previousData});
                setSystem(WAITLIST);
                setOpenWaitlistSummary(true);
            }


        } catch (error) {
            console.error("Failed to parse session storage data:", error);
        }
    };
    

    const getTimezone = () => {
        getBusinessTimezone(link)
        .then(response => {
            setTimezone(response.timezone)
        })
        .catch(error => {
            setErrorMessage({title: 'Error', body: error.msg});
            setDisable(true); 
        })
    }
    
    useEffect(() => {
        setLoading(true);
        setZoomIntoView(true);
        getTimezone();

        getBusinessData();
        getPreviouslySaved();
        return() => {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if ( isGuestServiceFilled() && appointmentData.service_id !== null) {
            setAppointmentLoader(true);
            setOpenAvailability(true);
            searchAppointments(appointmentData.service_id)
        }

        return () => {
            setAppointmentLoader(false);
            setOpenAvailability(false);
        }
    } ,[serviceTags, appointmentData.service_id])


    const getBusinessData = () => {
        // Local timezone applied.
        const time = DateTime.local().toISO();
        Promise.all([
            isBusinesssOpen(link, time),
            getBusinessPresent(link, time),
            getExtras(link, time)
        ])
        .then(([businessOpenResponse, businessPresentResponse, extrasResponse]) => {
            setOpen(businessOpenResponse.isOpen);
            setAcceptingStatus({appointments: businessOpenResponse.acceptingAppointments, waitlist: businessOpenResponse.acceptingWaitlist});
            setBusinessPresent(businessPresentResponse.presentables);
            setBusinessSystem(businessPresentResponse.system);
            setBusinessExtras(extrasResponse);
        })
        .catch(error => {
            if (error.status === 404) {
                navigate(`/welcome/${link}`);
            }
            handleErrorRefChange();
            setAcceptingStatus({waitlist: false, appointments: false});
            setErrorMessage({title: 'Error', body: error.msg});
            setDisable(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }
   
   
    const typeChange = (TYPE) => {
        setSystem(TYPE);
        setWaitlistData((prev) => ({ ...prev,
            employee_id: null,
            service_id: null,
            resource_id: null,
            notes: null
        }))
        setAppointmentData((prev) => ({...prev,
            employee_id: null,
            service_id: null,
            resource_id: null,
            start: null,
            end: null,
            date: null,
            start: null,
            end: null
        }));
        setSlots(null);
        setAppEmployees(null);
        setOpenEmployees(false);
        setOpenAvailability(false)
        setOpenWaitlistSummary(false);
        setOpenSummary(false);
    }

    const redirectBack = () => {
        navigate(`/welcome/${link}/size`)
    }

    const handleEmployeeRefChange = () => { 
        if (employeesRef.current){ employeesRef.current.scrollIntoView({behavior: 'smooth'}) }
    }

    const handleServiceRefChange = () => { 
        if (servicesRef.current){ servicesRef.current.scrollIntoView({behavior: 'smooth'}) }
    }

    const handleAvailabilityRefChange = () => { 
        if (availabiltyRef.current){ availabiltyRef.current.scrollIntoView({behavior: 'smooth'}) }
    }

    const handleErrorRefChange = () => {
        if (errorRef.current) { errorRef.current.scrollIntoView({behavior: 'smooth'})}
    }

    /**
     * 
     * @param {ISO} date
     * Date change promps employee availability
     *  
     */
    const handleDateChange = (date) => {
        setOpenEmployees(false);
        setOpenSummary(false);
        setAppEmployees(null);
        setOpenWaitlistSummary(false);
        setSlots(null);
        setOpenServices(false);
        setAppointmentData((prev) => ({...prev, date: date, start: null, end: null}));
        setAppointmentSearchErrors({title: null, body: null, type: null})
        getAvailableEmployees(date);
        handleEmployeeRefChange(); // Trigger focus on employee section
        
    }

    const handleGuestServiceClick = (idx, service) => {
        setSlots(null);
        setServiceTags((prev) => ({...prev, [idx]: service._id }));
        setAppointmentData((prev) => ({...prev, service_id: service._id, serviceName: service.title, start: null, end: null}))
    }
    const isGuestServiceFilled = () => {
        for (let i = 0; i < appointmentData.partySize; i ++) {
            if (serviceTags[i] === "" || serviceTags[i] === undefined || serviceTags[i] === null) {
                return false;
            }  
        }
        return true;
    }

    /**
     * 
     * @param {STRING} date
     * Employee select promps service filtration.
     *  
     */
    const handleEmployeeChange = (employee) => {
        setOpenAvailability(false);
        setOpenSummary(false);
        setOpenServices(true);
        setAppointmentData((prev) => ({...prev, employee_id: employee.id, fullname: employee.fullname}));
        handleServiceRefChange(); // Trigger on service section

    }

    const searchAppointments = (id) => {
        setAlertAppointment(false);
        if (appointmentData.date === null || appointmentData.employee_id === null){ 
            handleErrorRefChange(); // Trigger ref to show error message.
            setErrorMessage({title: 'Error', body: 'Please make sure you have selected a date, employee and service.'});
            return;
        }
        const currentDate = DateTime.local().setZone(timezone).toISO();
        const payload = { employeeId: appointmentData.employee_id, serviceId: id, appointmentDate: appointmentData.date.setZone(timezone).toISO(), link, currentDate, serviceTags }
        getAvailableAppointments(payload)
        .then(response => {
            if(Object.keys(response.data).length === 0){
                setAlertAppointment(true);
                setAppointmentSearchErrors({title: 'Error', body: response.msg, type: 'warning'})
                return;
            }
            setSlots(response.data);
        })
        .catch(error => {
            handleErrorRefChange(); // Trigger ref to show error message.
            setErrorMessage({title: 'Error', body: error.msg});
        })
        .finally(() => {
            setAppointmentLoader(false);
        })
    }


    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate, link)
        .then(response => {
            if(Object.keys(response).length === 0){
                setEmployeeSearchErrors({open: true, title: 'Warning', body: 'No employees available for date.'});
                return;
            }
            setEmployeeSearchErrors({open: false, title: null, body: null});
            setAppEmployees(response);
        })
        .catch(error => {
            handleErrorRefChange(); // Trigger ref to show error message.
            setErrorMessage({title: 'Error', body: error.msg});
        })  
        .finally(() => {
            setLoading(false);
            setOpenEmployees(true);
        })
    }



    return (
        <>  
            <ThemeProvider theme={ClientWelcomeTheme}>
            <Box className="center-box">
                <Grid 
                container
                sx={{pt: 2, pb: 1}}
                id={'gridContainer'}
                spacing={1}
                direction="column"
                justifyContent="center"
                alignItems="center" 
            >   
                <Zoom in={zoomIntoView} mountOnEnter unmountOnExit>
                <Grid className="grid-item" item xs={12} md={4} lg={4} xl={3}>
                    <Card className="wcard" variant="outlined" sx={{ borderRadius: 3, p: 1, pt: 1}}>
                    {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center', pt: 2}}>
                        <CircularProgress size={15} />
                    </Box>): 
                    <CardContent sx={{ pt: 1, justifyItems: 'center', paddingLeft: 0, paddingRight: 0}}>
                        <Box sx={{ textAlign: 'left'}}>
                            <IconButton onClick={ () => redirectBack() }>
                                <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                            </IconButton>
                        </Box>
                        <Box id="header_selector">
                        <Typography textAlign={'center'} variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" fontWeight="bolder" textAlign={'center'}>
                            Type
                        </Typography>
                        <Typography variant="body2" fontWeight="normal" textAlign={'center'}>
                            Choose which suits your schedule
                        </Typography>
                        </Box>
                        
                        <Container sx={{ justifyContent: 'center', alignItems: 'center', paddingRight: 0, paddingLeft: 0}}>
                        { errorMessage.title ? (
                            <Alert
                            ref={errorRef}
                            severity="warning"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="warning"
                                    size="small"
                                    onClick={() => {
                                        setErrorMessage({title: null, body: null})
                                    }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            >
                            <AlertTitle>
                                <Typography fontWeight={'bold'} variant="subtitle1">
                                    {errorMessage.title}
                                </Typography>
                            </AlertTitle>

                            <Typography variant="body2">{errorMessage.body}</Typography>
                            </Alert>
                        ): null}

                        <br/>
                        <ButtonGroup size="large" fullWidth={true} variant="outlined">
                            <Tooltip title="Waitlist - Wait in a general line.">
                                <Button color="primary" disabled={acceptingStatus && (acceptingStatus.waitlist === true && open === true) ? false : true} variant={systemTypeSelected === WAITLIST ? 'contained': 'outlined'} onClick={() => typeChange(WAITLIST)}>
                                    <Typography variant="body2" fontWeight={'bold'}>Waitlist</Typography>
                                </Button>

                            </Tooltip>
                            <Tooltip title="Appointment - Schedule an appointment that best suits your schedule.">
                                <Button color="primary" disabled={acceptingStatus && !acceptingStatus.appointments } variant={systemTypeSelected === APPOINTMENT ? 'contained': 'outlined'} onClick={() => typeChange(APPOINTMENT)}> 
                                    <Typography variant="body2" fontWeight={'bold'}>Appointment</Typography>
                                </Button>
                            </Tooltip>
                            
                        </ButtonGroup>
                        {
                            systemTypeSelected === APPOINTMENT 
                            &&
                            <Container id="appointmentSection">
                                <Typography align="left" sx={{pt: 1}} variant="body1" fontWeight={'bold'}>Select a preferred date</Typography>
                                    <DateCalendar
                                        sx={{width: 'auto'}}
                                        disablePast={true}
                                        value={appointmentData.date}
                                        onChange={(newDate) => handleDateChange(newDate) }
                                        defaultValue={currentDate} 
                                        maxDate={businessExtras && DateTime.fromISO(businessExtras.maxDateAvailable)}
                                    />
                                        <Box sx={{pt: 1, display: openEmployees ? 'flex': 'none', paddingLeft: 0, paddingRight: 0}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                        </Box>

                                        <Box ref={employeesRef}  sx={{ display: openEmployees ? 'flex': 'none', overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                            <Fade in={openEmployees}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(openEmployees ? { timeout: 1000 } : {})}
                                            >
                                                <Grid
                                                    maxHeight={1}
                                                    container 
                                                    wrap='nowrap'
                                                    flexDirection={'row'}
                                                    rowSpacing={2}
                                                    spacing={.5}
                                                    alignItems="stretch"
                                                >
                                                    
                                                    {   appointmentEmployees !== null ? 
                                                        appointmentEmployees.map((employee) => {
                                                            return (
                                                                <Grid item key={employee.id}>
                                                                    <Card className="card-style" sx={{backgroundColor: appointmentData.employee_id === employee.id ? "#E8E8E8": "" }} variant="outlined" onClick={() => handleEmployeeChange(employee)}>
                                                                        <CardActionArea>
                                                                            <CardContent>
                                                                                <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                                                                    <Avatar src={employee.image !== null ? employee.image : null} />
                                                                                    <Typography variant="body2" fontWeight={'bold'}>
                                                                                        {employee.fullname}
                                                                                    </Typography>
                                                                                    <Typography variant="caption">
                                                                                        {employee.message}
                                                                                    </Typography>
                                                                                </Stack>

                                                                            </CardContent>
                                                                        </CardActionArea>
                                                                    </Card>
                                                                </Grid>
                                                            
                                                            )
                                                        })
                                                    : null
                                                    }     
                                                    {
                                                        employeeSearchErrors && employeeSearchErrors.open === true ? (
                                                            <Box>
                                                                <Alert severity="warning" onClose={() => setEmployeeSearchErrors({open: false, title: null, body: null})}>
                                                                    <AlertTitle>
                                                                        <Typography variant="body2">{employeeSearchErrors.title}</Typography>
                                                                    </AlertTitle>
                                                                    <Typography variant="caption">{employeeSearchErrors.body}</Typography>
                                                                </Alert>
                                                            </Box>
                                                        ) : null
                                                    }                                               
                                                </Grid>
                                            </Fade>
                                        </Box>
                                    
                                        {
                                            appointmentData ?  
                                                (
                                                    <Stack sx={{display: openServices ? 'flex' : 'none'}}>
                                                        {
                                                            [...Array(appointmentData.partySize)].map(( _ , index) => {
                                                                let guestCount = index + 1;
                                                                return (
                                                                    <Box sx={{pt: 1}}>
                                                                        <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Services available guest {guestCount}</Typography>
                                                                    <Box sx={{pt: 1, display: openServices ? 'flex': 'none', overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                                                        <Stack>
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
                                                                                businessExtras.services ? 
                                                                                businessExtras.services
                                                                                .filter((service) => service.employeeTags.includes(appointmentData.employee_id))
                                                                                .map((service) => (
                                                                                    <Grid item key={service._id}>
                                                                                        <Card variant="outlined" className="card-style" sx={{backgroundColor: serviceTags[index] === service._id ? "#E8E8E8": "", minHeight: 180}} onClick={() => handleGuestServiceClick(index,service)}>
                                                                                            <CardActionArea>
                                                                                                <CardContent>
                                                                                                <Stack spacing={0.2}>
                                                                                                    <Typography component="div" variant="body2" textAlign={'center'} fontWeight={'bold'}>{service.title}</Typography>
                                                                                                    <Typography className="large-desc" textAlign="center" gutterBottom color="text.secondary" variant="caption">
                                                                                                        {service.description}
                                                                                                    </Typography>
                                                                                                </Stack>
                                                                                                <Divider variant="middle" />                                                                    
                                                                                                <Stack sx={{m: 1}} spacing={0.5}>
                                                                                                    <Chip color="secondary"  variant="contained" label={"Length: " + service.duration + " min"} icon={<RestoreRounded color={'white'} size={10} />} />
                                                                                                    <Chip color="success" variant="contained" label={"Cost: " + service.cost} icon={<AttachMoneyRounded color={'white'} size={10} />} />
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
                                                                        </Stack>
                                                                    </Box>
                                                                    </Box>
                                                                )
                                                            })
                                                        }
                                                    </Stack>

                                                )   
                                            : null
                                        }


                                        {
                                            appointmentLoader ? (
                                                <Box>
                                                    <LinearProgress />
                                                </Box>
                                            ) : null
                                        } 
                                    
                                        <Box sx={{ pt: 1, display: openAvailabity ? 'flex' : 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>                                         
                                        </Box>
                                        <Box id="intervalSelect" sx={{pt: 1, display: openAvailabity ? 'flex': 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Grow ref={availabiltyRef} in={openAvailabity}>
                                            <Box className="scroll-left" sx={{display: 'block', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                                    <Grid
                                                        maxHeight={1}
                                                        container 
                                                        wrap='nowrap'
                                                        flexDirection={'row'}
                                                        rowSpacing={2}
                                                        spacing={.5}
                                                    >
                                                
                                                    {
                                                        slots ? (
                                                            Object.keys(slots).map((key, index) => {
                                                                const appointment = slots[key];
                                                                return (   
                                                                    <Grid item key={index}>
                                                                    <Button 
                                                                        sx={{borderRadius: 10}}
                                                                        variant={appointmentData.start === appointment.start ? "contained": "outlined"}
                                                                        size="sm"
                                                                        onClick={() => appointmentSlotSelect(appointment)} 
                                                                        color={appointmentData.start === appointment.start ? 'primary': 'primary'}
                                                                        id="appointmentButtons">
                                                                        {appointment.start ? (<Typography variant="body2" sx={{ pl: 1, pr: 1}}>{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("h:mm a")}</Typography>) : null}          
                                                                    </Button>
                                                                    </Grid>
                                                                )
                                                            })
                                                        ): null
                                                    }
                                                        <Grid item>
                                                            <AlertMessageGeneral open={alertAppointments} onClose={setAlertAppointment} title={appointmentSearchErrors.title} body={appointmentSearchErrors.body} type={appointmentSearchErrors.type} />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grow>
                                        </Box>

                                        <Box sx={{pt: 1.5}}>
                                            {businessPresent && businessPresent.notes === true ? (
                                            <>
                                            <TextField
                                                id="notes"
                                                name="notes"
                                                label="Anything we need to know?"
                                                fullWidth
                                                color="secondary"
                                                size="small"
                                                placeholder="Additional notes"
                                                value={appointmentData.notes}
                                                onChange={(e) => setAppointmentData((prev) => ({...prev, notes: e.target.value})) }
                                            />
                                            </>
                                                
                                            ): null}
                                        </Box>
                                        
                                        {
                                            (openSummary && systemTypeSelected === APPOINTMENT) ? (
                                                <Box sx={{ pt: 2, display: openSummary ? "block": 'none', width: '100%', maxWidth: '100%'}}>
                                                    <Alert icon={<CloudDone />} severity='secondary' sx={{ textAlign: 'left'}}>
                                                        <AlertTitle><Typography variant="body1"><strong>Details saved</strong></Typography></AlertTitle>
                                                        {appointmentData.date ? (<Typography variant="caption">Date assigned — <strong>{appointmentData.date.toFormat('LLL dd yyyy') }</strong></Typography>) : null}
                                                        <br/>
                                                        {appointmentData.start && appointmentData.end ? 
                                                        (<Typography variant="caption">Start — <strong>{appointmentData.start && DateTime.fromFormat(appointmentData.start,"HH:mm").toFormat("h:mm a")}</strong> — End <strong>{DateTime.fromFormat(appointmentData.end, "HH:mm").toFormat("h:mm a")} </strong></Typography>): null}
                                                        <br/>
                                                        {appointmentData.fullname ? (
                                                            <Typography variant="caption">With — <strong>{appointmentData.fullname}</strong></Typography>
                                                        ): null}
                                                        <br />
                                                        {appointmentData.partySize ? (
                                                            <Typography variant="caption">Party size — <strong>{appointmentData.partySize}</strong></Typography>
                                                        ): null}

                                                        <br/>
                                                        {appointmentData.serviceName ? (
                                                            <Typography variant="caption">Doing — <strong>{appointmentData.serviceName}</strong></Typography>
                                                        ): null}                                                            
                                                    </Alert>
                                                </Box>
                                            ) : null
                                        }
                                        
                                        
                            </Container>
                            ||
                            systemTypeSelected === WAITLIST 
                            && 
                            <Container id="waitlistSection">
                                
                                <Stack sx={{ pt: 1 }} direction="column" spacing={1.5} textAlign="left">
                                    <Typography textAlign={'center'} variant="body1" fontWeight={'bold'}>We have options available</Typography>
                                    {businessPresent && businessPresent.employees === true ? (
                                        <>
                                            <Typography  fontWeight={'bold'} id="employee" variant="subtitle2">Employee preference</Typography>
                                            <Select
                                                id="employee"
                                                name="employee_id"
                                                color="secondary"
                                                value={waitlistData.employee_id}
                                                onChange={(event) => {
                                                    const selectedEmployeeId = event.target.value;
                                                    const selectedEmployee = businessExtras.employees.find(employee => employee.id === selectedEmployeeId);
                                                    setWaitlistData((prev) => ({
                                                        ...prev,
                                                        employee_id: selectedEmployeeId,
                                                        fullname: selectedEmployee ? selectedEmployee.fullname : ''
                                                    }));
                                                }}
                                            >
                                                {Array.isArray(businessExtras.employees) ? businessExtras.employees.map((employee) => (
                                                    <MenuItem key={employee.id} value={employee.id}>
                                                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                                            <Avatar src={employee.image !== null ? employee.image : null} />
                                                            <Typography variant="body2" fontWeight={'bold'}>
                                                                {employee.fullname}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                {employee.message}
                                                            </Typography>
                                                        </Stack>
                                                    </MenuItem>
                                                )) : 
                                                    null
                                                }
                                            </Select>

                                        </>
                                    ) : null}
                                    {businessPresent && businessPresent.services === true ? (
                                    <>
                                        <Typography fontWeight={'bold'} variant="subtitle2" id="services">Services available</Typography>
                                        {
                                            waitlistData && waitlistData.employee_id ? (
                                                <Box sx={{pt: 0, overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
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
                                                        businessExtras ? 
                                                        businessExtras.services
                                                        .filter((service) => service.employeeTags.includes(waitlistData.employee_id))
                                                        .map((service) => (
                                                            <Grid item key={service._id}>
                                                                <Card variant="outlined" className="card-style" sx={{backgroundColor: waitlistData.service_id === service._id ? "#E8E8E8": "", minHeight: 200}} onClick={() => setWaitlistData((prev) => ({...prev, service_id: service._id, serviceTitle: service.title}))}>
                                                                    <CardActionArea>
                                                                        <CardContent>
                                                                        <Stack spacing={0.2}>
                                                                            <Typography component="div" variant="body2" textAlign={'center'} fontWeight={'bold'}>{service.title}</Typography>
                                                                            <Typography className="large-desc" textAlign="center" gutterBottom color="text.secondary" variant="caption">
                                                                                {service.description}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Divider variant="middle" />                                                                    
                                                                        <Stack sx={{m: 1}} spacing={0.5}>
                                                                            <Chip color="secondary"  variant="contained" label={"Length: " + service.duration + " min"} icon={<RestoreRounded color={'white'} size={10} />} />
                                                                            <Chip color="success" variant="contained" label={"Cost: " + service.cost} icon={<AttachMoneyRounded color={'white'} size={10} />} />
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
                                            ): (
                                                <Box sx={{pt: 0, overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
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
                                                    businessExtras ? 
                                                    businessExtras.services.map((service) => (
                                                        <Grid item key={service._id}>
                                                            <Card variant="outlined" className="card-style" sx={{backgroundColor: waitlistData.service_id === service._id ? "#E8E8E8": "", minHeight: 200}} onClick={() => setWaitlistData((prev) => ({...prev, service_id: service._id, serviceTitle: service.title}))}>
                                                                <CardActionArea>
                                                                    <CardContent>
                                                                    <Stack spacing={0.2}>
                                                                        <Typography component="div" variant="body2" textAlign={'center'} fontWeight={'bold'}>{service.title}</Typography>
                                                                        <Typography className="large-desc" textAlign="center" gutterBottom color="text.secondary" variant="caption">
                                                                            {service.description}
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Divider variant="middle" />                                                                    
                                                                    <Stack sx={{m: 1}} spacing={0.5}>
                                                                        <Chip color="secondary"  variant="contained" label={"Length: " + service.duration + " min"} icon={<RestoreRounded color={'white'} size={10} />} />
                                                                        <Chip color="success" variant="contained" label={"Cost: " + service.cost} icon={<AttachMoneyRounded color={'white'} size={10} />} />
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
                                            )
                                        }
                                        
                                    </>
                                    ) : null}

                                    {businessPresent && businessPresent.resources === true ? (
                                    <>
                                        <Typography fontWeight={'bold'} variant="subtitle2" id="resources" textAlign="left">Resources available</Typography>
                                        <Select
                                        as={Select}
                                        id="resources"
                                        name="resource_id"
                                        color="secondary"
                                        value={waitlistData.resource_id}
                                        >
                                        {Array.isArray(businessExtras.resources) ? businessExtras.resources.map((resource) => {
                                            return (
                                            <MenuItem key={resource._id} value={resource._id} onClick={() => setWaitlistData((prev) => ({...prev, resource_id: resource._id, resourceTitle: resource.title}))}>
                                                <Stack>
                                                <Typography variant="body2" fontWeight={'bold'}>{resource.title} </Typography>
                                                    {resource.description ? (<Typography variant="caption">{`Description: ${resource.description}`}</Typography>): null}
                                                </Stack>
                                            </MenuItem>
                                            )}) : null}
                                        </Select>
                                    </>
                                    ) : null}
                                    {
                                        businessPresent && businessPresent.notes === true ? (
                                            <>
                                            <Typography variant="subtitle2" fontWeight={'bold'} id="notes">Anything we need to know before hand?</Typography>
                                            <TextField
                                                id="notes"
                                                name="notes"
                                                label="Notes"
                                                color="secondary"
                                                placeholder="Additional notes"
                                                value={waitlistData.notes}
                                                onChange={(e) => setWaitlistData((prev) => ({...prev, notes: e.target.value})) }
                                            />
                                            </>
                                        ):null
                                    }
                                    
                                </Stack>

                                {
                                    (openWaitlistSummary && systemTypeSelected === WAITLIST) ? (
                                        <Box sx={{ pt: 1, display: openWaitlistSummary ? "block": 'none', width: '100%', maxWidth: '100%'}}>
                                            <Alert icon={<CloudDone />} severity='secondary' sx={{ textAlign: 'left'}}>
                                                <AlertTitle><Typography variant="body1"><strong>Details</strong></Typography></AlertTitle>
                                                { waitlistData && waitlistData.fullname ? (
                                                <>
                                                <Typography variant="caption">Employee assigned — <strong>{waitlistData.fullname }</strong></Typography>
                                                <br/>
                                                </>
                                                ) : null}
                                                
                                                { waitlistData && waitlistData.serviceTitle ? (
                                                <>
                                                <Typography variant="caption">Service — <strong>{waitlistData.serviceTitle }</strong></Typography>
                                                <br/>
                                                </>
                                                ) : null}
                                                { waitlistData && waitlistData.resourceTitle ? (
                                                <>
                                                <Typography variant="caption">Resource — <strong>{waitlistData.resourceTitle }</strong></Typography>
                                                <br/>
                                                </>
                                                ) : null}
                                                { waitlistData && waitlistData.notes ? (
                                                <>
                                                <Typography variant="caption">Notes — <strong>{waitlistData.notes }</strong></Typography>
                                                <br/>
                                                </>
                                                ) : null}
                                            </Alert>
                                        </Box>
                                    ): null
                                }
                                
                            </Container>
                        }
                        </Container>

                        
                        <Container sx={{ pt: 3}}>
                            <Button disabled={systemTypeSelected === null || disable === true} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
                        </Container>       
                    </CardContent>
                    }


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                    </Card>
                </Grid>
                </Zoom>
                </Grid>
            </Box>
            </ThemeProvider>

        </>
    )
}