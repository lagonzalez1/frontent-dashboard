import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Select, ButtonGroup, InputLabel, MenuItem, TextField, Grid, CardActionArea, Paper, Grow, Alert, Chip, Divider, AlertTitle, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { requestBusinessArguments, getExtras, getEmployeeList,getAvailableAppointments, allowClientJoin  } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSelector.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import * as Yup from 'yup';


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

    const [systemTypeSelected, setSystem] = useState(null);

    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [present, setPresent] = useState(null);
    const [services, setServices] = useState(null);
    const [resources, setResouces] = useState(null);
    const [slots, setSlots] = useState(false);
    

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
        end: null
    });

    

    const appointmentSlotSelect = (duration) => {
        const {start, end} = duration;
        setAppointmentData((prev) => ({...prev, start: start, end: end}));
        setOpenSummary(true);
    }

    const setDataAndContinue = () => {
        if (systemTypeSelected === APPOINTMENT){
            if (appointmentData.date === null || appointmentData.start === null || appointmentData.end === null || appointmentData.employee_id === null){
                setError('You are missing values for yoour appointment.');
                return;
            }
            const payload = sessionStorage.getItem(CLIENT);
            if (payload === null) { 
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
            navigate(`/welcome/${link}/details`);   
            return;
        }
        if (systemTypeSelected === WAITLIST){
            const payload = sessionStorage.getItem(CLIENT);
            if (payload === null) { 
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
            navigate(`/welcome/${link}/details`);
            return;
        }
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
                if (response.data.isAccepting === false) {
                    navigate(`/welcome/${link}`);
                    return;
                }
            }            
            
        })
        .catch(error => {
            console.log(error);
            setError('Error found when trying to reach business.');
        })
    }

    const getBuisnessForm = () => {
        requestBusinessArguments(link)
        .then(data => {
            console.log(data)
            setArguments(data);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const getBuisnessExtras = () => {
        getExtras(link)
        .then(data => {
            setPresent(data.present);
            setEmployees(data.employees);
            setResouces(data.resources);
            setServices(data.services);
        })
        .catch(error => {
            console.log(error);
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
        setOpenServices(false);
        setAppointmentData((prev) => ({...prev, date: date}));
        getAvailableEmployees(date);
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
        // Call function with (link, employee_id, service_id) -> Durations.
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

    }

    const searchAppointments = (id) => {
        if (appointmentData.date === null || appointmentData.employee_id === null){ 
            setError("Missing values");
            return;
        }
        const currentDate = DateTime.now().toISO();
        const payload = { employeeId: appointmentData.employee_id, serviceId: id, appointmentDate: appointmentData.date.toISO(), link, currentDate }
        getAvailableAppointments(payload)
        .then(response => {
            console.log(response)
            setSlots(response.data)
        })
        .catch(error => {
            setError(error);
            console.log(error)
        })
        .finally(() => {
            //setLoading(false);
        })
    }

    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate,link)
        .then(response => {
            setAppEmployees(response);
            
        })
        .catch(error => {
            setError(error);
        })  
        .finally(() => {
            setLoading(false);
            setOpenEmployees(true);
        })
    }

    return (
        <>
            <Box className="center-box" sx={{}}>
                <Card className="custom-card" sx={{ p: 1, borderRadius: 5, boxShadow: 0, marginTop: 2 }}>
                    {loading ? (<CircularProgress />): 
                    <CardContent>
                        <Container sx={{ textAlign: 'left'}}>
                            <IconButton onClick={ () => redirectBack() }>
                                <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                            </IconButton>
                        </Container>
                        <Container>
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                            {loading ? <CircularProgress /> : null}
                        <Typography variant="h5" fontWeight="bold">
                            Type
                        </Typography>
                        { error ? (
                        <Alert
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
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
                            {'Found error'}
                            </Alert>
                        ): null}

                        <br/>
                        <ButtonGroup fullWidth={true} variant="outlined">
                            <Tooltip title="Waitlist: Wait in a general line.">
                                <Button disabled={args && !args.system.waitlist} variant={systemTypeSelected === WAITLIST ? 'contained': 'outlined'} onClick={() => typeChange(WAITLIST)}> Waitlist</Button>
                            </Tooltip>
                            <Tooltip title="Appointment: Schedule an appointment that best suits your schedule.">
                                <Button disabled={args && !args.system.appointments} variant={systemTypeSelected === APPOINTMENT ? 'contained': 'outlined'} onClick={() => typeChange(APPOINTMENT)}> Appointment</Button>
                            </Tooltip>
                            
                        </ButtonGroup>

                        {
                            loading ? (<CircularProgress /> ):

                            systemTypeSelected === APPOINTMENT 
                            &&
                            <Box id="appointmentSection" sx={{ justifyContent: 'center', alignItems: 'center'}}>
                                    <DateCalendar
                                        sx={{width: 'auto'}}
                                        disablePast={true}
                                        value={appointmentData.date}
                                        onChange={(newDate) => handleDateChange(newDate) }
                                        defaultValue={currentDate} 
                                    />
                                        <Box sx={{pt: 1, display: openEmployees ? 'flex': 'none'}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>
                                        </Box>

                                        <Box className="scroll-left" id="employeeSelect" sx={{ display: openEmployees ? 'flex': 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Grow in={openEmployees}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(openEmployees ? { timeout: 1000 } : {})}
                                            >

                                                <Grid
                                                    container 
                                                    direction={'row'}
                                                    rowSpacing={1}
                                                    columnSpacing={1}
                                                >
                                                    
                                                    {   appointmentEmployees !== null ? 
                                                        appointmentEmployees.map((employee) => {
                                                            return (
                                                                <Grid item key={employee.id}>
                                                                    <Card className="card-style" sx={{backgroundColor: appointmentData.employee_id === employee.id ? "#E8E8E8": "" }} variant="outlined" onClick={() => handleEmployeeChange(employee)}>
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
                                                    : <Grid item>
                                                        <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>No availability found</Typography>
                                                    </Grid>
                                                    }                                                    
                                                </Grid>
                                            </Grow>
                                        </Box>

                                        <Box sx={{pt: 1, display: openServices ? 'flex': 'none'}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Services available</Typography>
                                        </Box>
                                        <Box id="serviceSelect" className="scroll-left" sx={{pt: 0, display: openServices ? 'flex': 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Grow in={openServices}>
                                                <Grid
                                                    container 
                                                    direction={'row'}
                                                    rowSpacing={1}
                                                    columnSpacing={1}
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
                                            </Grow>
                                        </Box>
                                        {
                                            // Slots is causing the entire width to span, overFlowX is not containing the width.
                                            // Oct 12
                                        }
                                    
                                        <Box sx={{ pt: 1, display: openAvailabity ? 'flex' : 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>                                                
                                        </Box>
                                        <Container id="intervalSelect" sx={{pt: 1, display: openAvailabity ? 'flex': 'none', paddingRight: 0, paddingLeft: 0}}>
                                            <Grow in={openAvailabity}>
                                                <Box className="scroll-left" sx={{display: 'block', whiteSpace: 'nowrap'}}>
                                                    <Grid
                                                        maxHeight={1}
                                                        container 
                                                        wrap='nowrap'
                                                        flexDirection={'row'}
                                                        rowSpacing={2}
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
                                                                        color={appointmentData.start === appointment.start ? 'primary': 'secondary'}
                                                                        id="appointmentButtons">
                                                                        <Typography variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("h:mm a")}</Typography>
                                                                        <Typography variant="caption">{"-"}</Typography>
                                                                        <Typography variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("h:mm a")}</Typography>
                                                                    </Button>
                                                                    </Grid>
                                                                )
                                                            })
                                                        
                                                        ): null
                                                    }
                                                    </Grid>
                                                    </Box>
                                            </Grow>
                                        </Container>
                                        

                                        {
                                            (openSummary && systemTypeSelected === APPOINTMENT) ? (
                                                <Box sx={{ pt: 2, display: openSummary ? "flex": 'none', width: '100%', maxWidth: '100%'}}>
                                                    <Alert variant="outlined" severity='success' sx={{ textAlign: 'left'}}>
                                                        <AlertTitle><Typography variant="body1"><strong>Details saved</strong></Typography></AlertTitle>
                                                        <Typography variant="caption">Date assigned — <strong>{appointmentData.date.toFormat('LLL dd yyyy') }</strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">Start — <strong>{DateTime.fromFormat(appointmentData.start, "HH:mm").toFormat("h:mm a")}</strong> — End <strong>{DateTime.fromFormat(appointmentData.end, "HH:mm").toFormat("h:mm a")} </strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">With — <strong>{appointmentData.fullname}</strong></Typography>
                                                        <br/>
                                                        <Typography variant="caption">Service — <strong>{appointmentData.serviceName}  </strong></Typography>
                                                    </Alert>
                                                </Box>
                                            ) : null
                                        }
                                        
                                        
                            </Box>
                            ||
                            systemTypeSelected === WAITLIST 
                            && 
                            <Box id="waitlistSection"  sx={{pt: 2}}>
                                
                                <Stack sx={{ pt: 1 }} direction="column" spacing={2} textAlign="left">


                                {employees && present.employees === true ? (
                                    <>
                                        <InputLabel id="employee">Employee preference</InputLabel>
                                        <Select
                                            id="employee"
                                            name="employee_id"
                                            value={waitlistData.employee_id}
                                        >
                                        {Array.isArray(employees) ? employees.map((employee) => (
                                            <MenuItem key={employee._id} value={employee._id} onClick={() => setWaitlistData((prev) => ({...prev, employee_id: employee._id, fullname: employee.fullname}))}>
                                                <Typography variant="body2">{employee.fullname} </Typography>
                                            </MenuItem>
                                        )) : null}
                                        </Select>
                                    </>
                                    ) : null}

                                    {services && present.services === true ? (
                                    <>
                                        <InputLabel id="services">Services</InputLabel>
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
                                                    <Typography variant="caption">{'Duration: ' + service.duration }</Typography>
                                                    <Typography variant="caption">{present.servicePrice ? ("Cost: " + service.cost) : null}</Typography>
                                                </Stack>
                                    
                                            </MenuItem>
                                            )}):null }
                                        </Select>
                                    </>
                                    ) : null}

                                    {resources && present.resources === true ? (
                                    <>
                                        <InputLabel id="resources" textAlign="left">Resources</InputLabel>
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
                                    <InputLabel id="notes" textAlign="left">Additional notes</InputLabel>
                                    <TextField
                                    id="notes"
                                    name="notes"
                                    label="Notes"
                                    placeholder="Additional notes"
                                    value={waitlistData.notes}
                                    onChange={(e) => setWaitlistData((prev) => ({...prev, notes: e.target.value})) }
                                    />
                                </Stack>

                                {
                                    (openWaitlistSummary && systemTypeSelected === WAITLIST) ? (
                                        <Box sx={{ pt: 1, display: openWaitlistSummary ? "flex": 'none', width: '100%', maxWidth: '100%'}}>
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
                                
                            </Box>
                        }
                        <Container sx={{ pt: 3}}>
                            <Button disabled={systemTypeSelected === null} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
                        </Container>
                                    
                        </Container>
                    </CardContent>
                    }


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}