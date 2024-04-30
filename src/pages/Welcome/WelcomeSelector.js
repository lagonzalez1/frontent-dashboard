import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Select, ButtonGroup, InputLabel, MenuItem, TextField, Grid, CardActionArea, Paper, Grow, Alert, Chip, Divider, AlertTitle, Tooltip, 
    useMediaQuery,
    Zoom} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { requestBusinessArguments, getExtras, getEmployeeList,getAvailableAppointments, allowClientJoin  } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/Welcome.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import { ThemeProvider, useTheme } from "@emotion/react";
import { ClientWelcomeTheme } from "../../theme/theme";
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";


export default function WelcomeSelector() {

    const { link } = useParams();

    const currentDate = DateTime.now();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [args, setArguments] = useState(null);
    const [openEmployees, setOpenEmployees] = useState(false);
    const [openServices, setOpenServices] = useState(false);
    const [openAvailabity, setOpenAvailability] = useState(false);
    const [openSummary, setOpenSummary] = useState(false);
    const [openWaitlistSummary, setOpenWaitlistSummary] = useState(false);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false});

    const errorRef = useRef();
    const employeesRef = useRef();
    const servicesRef = useRef();
    const availabiltyRef = useRef();

    const [alertAppointments, setAlertAppointment] = useState(false);
    const [errorMessage, setErrorMessage] = useState({title: '', body: ''});


    const [systemTypeSelected, setSystem] = useState(null);

    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [present, setPresent] = useState(null);
    const [services, setServices] = useState(null);
    const [resources, setResouces] = useState(null);
    const [slots, setSlots] = useState(false);
    const [disable, setDisable] = useState(false);
    const [zoomIntoView, setZoomIntoView] = useState(false);


    const [appSlotLoader, setAppSlotLoader] = useState(false);
    

    const [appointmentEmployees, setAppEmployees] = useState(null);

    const [waitlistData, setWaitlistData] = useState({
        fullname: null,
        serviceTitle: null,
        resourceTitle: null,
        employee_id: '',
        service_id: '',
        resource_id: '',
        notes: ''
    })
    const [appointmentData, setAppointmentData] = useState({
        fullname: null,
        serviceName: null,
        employee_id: null,
        service_id: null,
        resource_id: null,
        start: null,
        end: null,
        date: null,
        start: null,
        end: null,
        notes: null,
    });

    

    const appointmentSlotSelect = (duration) => {
        const {start, end} = duration;
        setAppointmentData((prev) => ({...prev, start: start, end: end}));
        setOpenSummary(true);
    }

    const setDataAndContinue = () => {
        if (systemTypeSelected === APPOINTMENT){
            if (appointmentData.date === null || appointmentData.start === null || appointmentData.end === null || appointmentData.employee_id === null){
                handleErrorRefChange(); // Trigger ref to show error message.
                setError('Please select a date, employee and service.');
                return;
            }
            const payload = sessionStorage.getItem(CLIENT);
            if (payload === null) { 
                handleErrorRefChange(); // Trigger ref to show error message.
                setError('Unable to find previous values.');
                return;
            }
            // Check if data is empty.
            let previousData = JSON.parse(payload);
            const object = {
                ...previousData,
                TYPE: APPOINTMENT,
                ...appointmentData,
                date: appointmentData.date.toISO(),
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
                setError('Unable to find previous values.');
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
        setError('Please select from the options available.');
        return;
    }

    const getPreviouslySaved = () => {
        const payload = sessionStorage.getItem(CLIENT);
        if (payload) {
            const previousData = JSON.parse(payload);
            if (previousData.TYPE === APPOINTMENT){
                setAppointmentData(() => ({...previousData, date: DateTime.fromISO(previousData.date) }));
                setSystem(APPOINTMENT);
                setOpenSummary(true);
            }
            if (previousData.TYPE === WAITLIST){
                setWaitlistData({...previousData});
                setSystem(WAITLIST);
                setOpenWaitlistSummary(true);
            }
        }
        return;
    }
    
    useEffect(() => {
        setZoomIntoView(true);
        redirectStatus();
        getBuisnessForm();
        getBuisnessExtras();
        getPreviouslySaved();
        return() => {
            setLoading(false);
        }
    }, [loading])


    const redirectStatus = () => {
        const currentTime = DateTime.local().toISO();       
        allowClientJoin(currentTime, link)
        .then(response => {
            if (response.status === 200) {
                if (response.data.isAccepting === false && response.data.acceptingAppointments === false) {
                    setZoomIntoView(false);
                    navigate(`/welcome/${link}`);
                    return;
                }
                setAcceptingStatus({ waitlist: response.data.isAccepting, appointments: response.data.acceptingAppointments});
            }       
        })
        .catch(error => {
            if (error.response.status === 404) {
                setZoomIntoView(false);
                navigate(`/welcome/${link}`);
                return;
            }
            setDisable(true);
            handleErrorRefChange(); // Trigger ref to show error message.
            setError('Error found when trying to reach business.');
            return;
        })
    }

    const getBuisnessForm = () => {
        requestBusinessArguments(link)
        .then(data => {
            setArguments(data);
        })
        .catch(error => {
            if (error.response.status === 400) {
                navigate(`/welcome/${link}`);
                return;
            }
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const getBuisnessExtras = () => {
        const date = DateTime.local().toISO();
        getExtras(link, date)
        .then(data => {
            setPresent(data.present);
            setEmployees(data.employees);
            setResouces(data.resources);
            setServices(data.services);
        })
        .catch(error => {
            setLoading(false);
        })
        .finally(() => {
            setLoading(false);
        })
    }
   
    const typeChange = (TYPE) => {
        setSystem(TYPE);
        setWaitlistData({
            employee_id: '',
            service_id: '',
            resource_id: '',
            notes: ''
        })
        setAppointmentData({
            employee_id: null,
            service_id: null,
            resource_id: null,
            start: null,
            end: null,
            date: null,
            start: null,
            end: null
        })
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
        setOpenWaitlistSummary(false);
        setSlots(null);
        setOpenServices(false);
        setAppointmentData((prev) => ({...prev, date: date, start: null, end: null}));
        getAvailableEmployees(date);
        handleEmployeeRefChange(); // Trigger focus on employee section
        
    }
        /**
     * 
     * @param {STRING} date
     * Service change promps availabilty durations
     * Issue: We assume this value will be filled once the state is fullfilled. 
     */
    const handleServiceChange = (service) => {
        setOpenAvailability(true);
        setAppointmentData((prev) => ({...prev, service_id: service._id, serviceName: service.title})); // Assume this will not fail, might be q issue later. 
        searchAppointments(service._id);
        handleAvailabilityRefChange() // Trigger focus on intervals.
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
            setError("Please check if date, employee or resource is cheked.");
            return;
        }
        const currentDate = DateTime.now().toISO();
        const payload = { employeeId: appointmentData.employee_id, serviceId: id, appointmentDate: appointmentData.date.toISO(), link, currentDate }
        setAppSlotLoader(true)
        getAvailableAppointments(payload)
        .then(response => {
            
            if(response.data.length === 0){
                setAlertAppointment(true);
                setErrorMessage({title: 'No available appointments.'})
                return;
            }
            setSlots(response.data);
        })
        .catch(error => {
            handleErrorRefChange(); // Trigger ref to show error message.
            setError(error);
            console.log(error)
        })
        .finally(() => {
            setAppSlotLoader(false);
        })
    }

    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate, link)
        .then(response => {
            setAppEmployees(response);
        })
        .catch(error => {
            handleErrorRefChange(); // Trigger ref to show error message.
            setError(error);
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
                    <Zoom in={zoomIntoView}>
                    <Grid className="grid-item" item xs={12} md={3} lg={4} xl={4}>
                        <Card variant="outlined" sx={{ borderRadius: 5, p: 3, pt: 1}}>
                        {loading ? (<CircularProgress />): 
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
                            </Box>
                            
                            <Container sx={{ justifyContent: 'center', alignItems: 'center', paddingRight: '2px', paddingLeft: '2px'}}>
                            { error ? (
                            <Alert
                                ref={errorRef}
                                severity="error"
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        setError(null);
                                    }}
                                    >
                                    <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                                >
                                {error}
                                </Alert>
                            ): null}

                            <br/>
                            <ButtonGroup size="large" fullWidth={true} variant="outlined">
                                <Tooltip title="Waitlist - Wait in a general line.">
                                    <Button disabled={args && !args.system.waitlist || acceptingStatus.waitlist === false} variant={systemTypeSelected === WAITLIST ? 'contained': 'outlined'} onClick={() => typeChange(WAITLIST)}> Waitlist</Button>

                                </Tooltip>
                                <Tooltip title="Appointment - Schedule an appointment that best suits your schedule.">
                                    <Button disabled={args && !args.system.appointments} variant={systemTypeSelected === APPOINTMENT ? 'contained': 'outlined'} onClick={() => typeChange(APPOINTMENT)}> Appointment</Button>
                                </Tooltip>
                                
                            </ButtonGroup>
                            {
                                systemTypeSelected === APPOINTMENT 
                                &&
                                <Container id="appointmentSection">
                                    <Typography align="left" sx={{pt: 1}} variant="body1" fontWeight={'bold'}>Select a date</Typography>
                                        <DateCalendar
                                            sx={{width: 'auto'}}
                                            disablePast={true}
                                            value={appointmentData.date}
                                            onChange={(newDate) => handleDateChange(newDate) }
                                            defaultValue={currentDate} 
                                            maxDate={args && DateTime.fromISO(args.maxDateAvailable)}
                                        />
                                            <Box sx={{pt: 1, display: openEmployees ? 'flex': 'none', paddingLeft: 0, paddingRight: 0}}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                            </Box>

                                            <Container ref={employeesRef}  sx={{ display: openEmployees ? 'flex': 'none', overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
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
                                                                                    <PersonIcon fontSize="small" />
                                                                                    <Typography variant="caption">{employee.fullname}</Typography>
                                                                                </CardContent>
                                                                            </CardActionArea>
                                                                        </Card>
                                                                    </Grid>
                                                                
                                                                )
                                                            })
                                                        : <Grid item>
                                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>No availability found</Typography>
                                                        </Grid>
                                                        }                                                    
                                                    </Grid>
                                                </Fade>
                                            </Container>

                                            <Box sx={{pt: 1, display: openServices ? 'flex': 'none'}}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Services available</Typography>
                                            </Box>
                                            
                                            <Container sx={{pt: 0, display: openServices ? 'flex': 'none', overflowX: 'auto', whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0}}>
                                                <Fade in={openServices}>
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
                                                            services ? 
                                                            services
                                                            .filter((service) => service.employeeTags.includes(appointmentData.employee_id))
                                                            .map((service) => (
                                                                <Grid item key={service._id}>
                                                                    <Card variant="outlined" className="card-style" sx={{backgroundColor: appointmentData.service_id === service._id ? "#E8E8E8": "" }} onClick={() => handleServiceChange(service)}>
                                                                        <CardActionArea>
                                                                            <CardContent>
                                                                            <Stack spacing={0.2}>
                                                                                <Typography component="div" variant="body2" textAlign={'center'} fontWeight={'bold'}>{service.title}</Typography>
                                                                                <Typography className="large-desc" textAlign="left" gutterBottom color="text.secondary" variant="caption">
                                                                                    {service.description}

                                                                                </Typography>
                                                                            </Stack>
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
                                                </Fade>
                                            </Container>
                                        
                                            <Box sx={{ pt: 1, display: openAvailabity ? 'flex' : 'none', paddingRight: 0, paddingLeft: 0}}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>                                                
                                            </Box>
                                            <Container id="intervalSelect" sx={{pt: 1, display: openAvailabity ? 'flex': 'none', paddingRight: 0, paddingLeft: 0}}>
                                                <Grow ref={availabiltyRef} in={openAvailabity}>
                                                    {appSlotLoader === true ? (
                                                        <Box>
                                                            <CircularProgress size={'small'}/>
                                                        </Box>
                                                    ) :
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
                                                                            color={appointmentData.start === appointment.start ? 'secondary': 'secondary'}
                                                                            id="appointmentButtons">
                                                                            <Typography variant="body2" sx={{ pl: 1, pr: 1}}>{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("h:mm a")}</Typography>
                                                                            
                                                                        </Button>
                                                                        </Grid>
                                                                    )
                                                                })
                                                            
                                                            ): null
                                                        }
                                                            <Grid item>
                                                                <AlertMessageGeneral open={alertAppointments} onClose={setAlertAppointment} title={errorMessage.title} body={''} />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    }
                                                </Grow>
                                            </Container>

                                            <Box sx={{pt: 1.5}}>
                                                {present && present.notes === true ? (
                                                    <>
                                                <TextField
                                                    id="notes"
                                                    name="notes"
                                                    label="Anything we need to know?"
                                                    fullWidth
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
                                                        <Alert variant="outlined" severity='success' sx={{ textAlign: 'left'}}>
                                                            <AlertTitle><Typography variant="body1"><strong>Details saved</strong></Typography></AlertTitle>
                                                            <Typography variant="caption">Date assigned — <strong>{appointmentData && appointmentData.date.toFormat('LLL dd yyyy') }</strong></Typography>
                                                            <br/>
                                                            <Typography variant="caption">Start — <strong>{appointmentData && DateTime.fromFormat(appointmentData.start, "HH:mm").toFormat("h:mm a")}</strong> — End <strong>{DateTime.fromFormat(appointmentData.end, "HH:mm").toFormat("h:mm a")} </strong></Typography>
                                                            <br/>
                                                            <Typography variant="caption">With — <strong>{appointmentData && appointmentData.fullname}</strong></Typography>
                                                            <br/>
                                                            <Typography variant="caption">Service — <strong>{appointmentData && appointmentData.serviceName}  </strong></Typography>
                                                            
                                                        </Alert>
                                                    </Box>
                                                ) : null
                                            }
                                            
                                            
                                </Container>
                                ||
                                systemTypeSelected === WAITLIST 
                                && 
                                <Container sx={{paddingLeft: 0, paddingRight: 0}}>
                                    
                                    <Stack sx={{ pt: 1 }} direction="column" spacing={1.5} textAlign="left">
                                        <Typography textAlign={'center'} variant="body1" fontWeight={'bold'}>Choose from the following</Typography>
                                        {employees && present.employees === true ? (
                                            <>
                                                <Typography  fontWeight={'bold'} id="employee" variant="subtitle2">Employee preference</Typography>
                                                <Select
                                                    id="employee"
                                                    name="employee_id"
                                                    defaultValue={waitlistData.employee_id}
                                                    onChange={(event) => {
                                                        const selectedEmployeeId = event.target.value;
                                                        const selectedEmployee = employees.find(employee => employee.id === selectedEmployeeId);
                                                        setWaitlistData(prev => ({
                                                            ...prev,
                                                            employee_id: selectedEmployeeId,
                                                            fullname: selectedEmployee ? selectedEmployee.fullname : ''
                                                        }));
                                                    }}
                                                >
                                                    {Array.isArray(employees) ? employees.map((employee) => (
                                                        <MenuItem key={employee.id} value={employee.id}>
                                                            {employee.fullname}
                                                        </MenuItem>
                                                    )) : null}
                                                </Select>
                                            </>
                                        ) : null}
                                        {services && present.services === true ? (
                                        <>
                                            <Typography fontWeight={'bold'} variant="subtitle2" id="services">Services</Typography>
                                            <Select
                                            id="services"
                                            name="service_id"
                                            value={waitlistData.service_id}
                                            >
                                            { Array.isArray(services) ? services.map((service) => {
                                                if (!service.public) { return null;}
                                                return (
                                                <MenuItem key={service._id} value={service._id} onClick={() => setWaitlistData((prev) => ({...prev, service_id: service._id, serviceTitle: service.title}))}>
                                                    <Stack>
                                                        <Typography variant="body2">{service.title}</Typography>
                                                        <Typography variant="caption">{'Duration: ' + service.duration + " (min) " }</Typography>
                                                        <Typography variant="caption">{present.servicePrice ? ("Cost: " + service.cost) : null}</Typography>
                                                    </Stack>
                                        
                                                </MenuItem>
                                                )}):null }
                                            </Select>
                                        </>
                                        ) : null}

                                        {resources && present.resources === true ? (
                                        <>
                                            <Typography fontWeight={'bold'} variant="subtitle2" id="resources" textAlign="left">Resources</Typography>
                                            <Select
                                            as={Select}
                                            id="resources"
                                            name="resource_id"
                                            value={waitlistData.resource_id}
                                            >
                                            {Array.isArray(resources) ? resources.map((resource) => {
                                                if (!resource.public) { return null }
                                                return (
                                                <MenuItem key={resource._id} value={resource._id} onClick={() => setWaitlistData((prev) => ({...prev, resource_id: resource._id, resourceTitle: resource.title}))}>
                                                    <Typography variant="body2">{resource.title} </Typography>
                                                </MenuItem>
                                                )}) : null}
                                            </Select>
                                        </>
                                        ) : null}
                                        {
                                            present && present.notes === true ? (
                                                <>
                                                <Typography variant="subtitle2" fontWeight={'bold'} id="notes">Anything we need to know before hand?</Typography>
                                                <TextField
                                                    id="notes"
                                                    name="notes"
                                                    label="Notes"
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
                                                <Alert variant="outlined" severity='success' sx={{ textAlign: 'left'}}>
                                                    <AlertTitle><Typography variant="body1"><strong>Details</strong></Typography></AlertTitle>
                                                    { (waitlistData && waitlistData.fullname === true) ? (
                                                    <>
                                                    <Typography variant="caption">Employee assigned — <strong>{waitlistData.fullname }</strong></Typography>
                                                    <br/>
                                                    </>
                                                    ) : null}
                                                    
                                                    { (waitlistData && waitlistData.serviceTitle === true) ? (
                                                    <>
                                                    <Typography variant="caption">Service — <strong>{waitlistData.serviceTitle }</strong></Typography>
                                                    <br/>
                                                    </>
                                                    ) : null}
                                                    { (waitlistData && waitlistData.resourceTitle === true) ? (
                                                    <>
                                                    <Typography variant="caption">Resource — <strong>{waitlistData.resourceTitle }</strong></Typography>
                                                    <br/>
                                                    </>
                                                    ) : null}
                                                    { (waitlistData && waitlistData.notes) ? (
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