import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Select, ButtonGroup, InputLabel, MenuItem, TextField, Grid, CardActionArea, Paper, Grow, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { requestBusinessArguments, getExtras, getEmployeeList, getAvailableAppointments} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSize.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


export default function WelcomeSelector() {

    const { link } = useParams();

    const currentDate = DateTime.now();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [args, setArguments] = useState(null);
    const [openEmployees, setOpenEmployees] = useState(false);
    const [openServices, setOpenServices] = useState(false);
    const [openAvailabity, setOpenAvailability] = useState(false);

    const [systemTypeSelected, setSystem] = useState(null);

    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [present, setPresent] = useState(null);
    const [services, setServices] = useState(null);
    const [resources, setResouces] = useState(null);
    const [slots, setSlots] = useState(false);
    

    const [appointmentEmployees, setAppEmployees] = useState(null);

    const [waitlistData, setWaitlistData] = useState({
        employee_id: '',
        service_id: '',
        resource_id: '',
        notes: ''
    })
    const [appointmentData, setAppointmentData] = useState({
        employee_id: null,
        service_id: null,
        resource_id: null,
        start: null,
        end: null,
        date: null,
        start: null,
        end: null
    });

    const setDataAndContinue = () => {
        if (systemTypeSelected === APPOINTMENT){
            if (appointmentData.date === null || appointmentData.start === null || appointmentData.end === null){
                setError('You are missing values for yoour appointment.');
                return;
            }
            const payload = sessionStorage.getItem(CLIENT);
            // Check if data is empty.
            let previousData = JSON.parse(payload);
            const object = {
                TYPE: APPOINTMENT,
                ...appointmentData,
                ...previousData
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            navigate(`/welcome/${link}/details`);
            return;
        }
        if (systemTypeSelected === WAITLIST){
            const payload = sessionStorage.getItem(CLIENT);
            let previousData = JSON.parse(payload);
            const object = {
                ...previousData,
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            navigate(`/welcome/${link}/details`);
            return;
        }
        setError('Please select from the options available.');
        return;
    }
    
    useEffect(() => {
        getBuisnessForm();
        getBuisnessExtras();
        return() => {
            setLoading(false);
        }
    }, [loading])

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
        setAppointmentData((prev) => ({...prev, date: date}));
        getAvailableEmployees(date);
    }
        /**
     * 
     * @param {STRING} date
     * Service change promps availabilty durations
     * Issue: We assume this value will be filled once the state is fullfilled. 
     */
    const handleServiceChange = (id) => {
        setOpenAvailability(true);
        setAppointmentData((prev) => ({...prev, service_id: id})); // Assume this will not fail, might be q issue later. 
        searchAppointments(id);
        // Call function with (link, employee_id, service_id) -> Durations.
    }
    /**
     * 
     * @param {STRING} date
     * Employee select promps service filtration.
     *  
     */
    const handleEmployeeChange = (id) => {
        setOpenServices(true);
        setAppointmentData((prev) => ({...prev, employee_id: id}));

    }

    const searchAppointments = (id) => {
        if (appointmentData.date === null || appointmentData.employee_id === null){ 
            setError("Missing values");
            return;
        }
        console.log("Called");
        const payload = { employeeId: appointmentData.employee_id, serviceId: id, appointmentDate: appointmentData.date.toISO(), link }
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 465, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>

                    {loading ? (<CircularProgress />): 
                    <CardContent>
                    
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
                            <Button disabled={args && !args.system.waitlist} variant={systemTypeSelected === WAITLIST ? 'contained': 'outlined'} onClick={() => typeChange(WAITLIST)}> Waitlist</Button>
                            <Button disabled={args && !args.system.appointments} variant={systemTypeSelected === APPOINTMENT ? 'contained': 'outlined'} onClick={() => typeChange(APPOINTMENT)}> Appointment</Button>
                        </ButtonGroup>

                        {
                            loading ? (<CircularProgress /> ):

                            systemTypeSelected === APPOINTMENT 
                            &&
                            <Box id="appointmentSection" sx={{ pt: 1}}>
                                    <DateCalendar
                                        value={appointmentData.date}
                                        onChange={(newDate) => handleDateChange(newDate) }
                                        defaultValue={currentDate} />

                                        <Box id="employeeSelect">
                                            <Grow in={openEmployees}
                                                style={{ transformOrigin: '0 0 0' }}
                                                {...(openEmployees ? { timeout: 1000 } : {})}
                                            >
                                                <Stack sx={{ display: 'flex', justifyContent: 'left'}} spacing={1}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Employees available</Typography>

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
                                                                    <Card sx={{backgroundColor: appointmentData.employee_id === employee.id ? "#E8E8E8": "" }} variant="outlined" onClick={() => handleEmployeeChange(employee.id)}>
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
                                                    : <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>No availability found</Typography>}                                                    
                                                </Grid>
                                                </Stack>
                                            </Grow>
                                        </Box>
                                        <Box id="serviceSelect" sx={{pt: 1}}>
                                            <Grow in={openServices}>
                                                <Stack sx={{display: 'flex', justifyContent: 'left'}} spacing={1}>
                                                <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Services available</Typography>

                                                        {
                                                        services ? 
                                                        services
                                                        .filter((service) => service.employeeTags.includes(appointmentData.employee_id))
                                                        .map((service) => (
                                                            <Grid item key={service._id}>
                                                                <Card sx={{backgroundColor: appointmentData.service_id === service._id ? "#E8E8E8": "" }} onClick={() => handleServiceChange(service._id)}>
                                                                    <CardActionArea>
                                                                        <CardContent>
                                                                        <Stack>
                                                                            <Typography variant="body2">{service.title}</Typography>
                                                                            <Typography variant="caption">{'Duration: ' + service.duration + ", Cost: " + service.cost }</Typography>
                                                                        </Stack>    
                                                                        </CardContent>
                                                                    </CardActionArea>
                                                                </Card>
                                                            </Grid>
                                                        )):
                                                        <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>No services found</Typography> 
                                                    }
                                                </Stack>
                                            </Grow>
                                        </Box>
                                        {
                                            // Slots is causing the entire width to span, overFlowX is not containing the width.
                                            // Oct 12
                                        }
                                        <Box id="intervalSelect"sx={{ maxWidth: '100%', overflowX: 'auto'}}>
                                            <Grow in={openAvailabity}>
                                                <Stack sx={{ display: 'flex', justifyContent: 'left'}} spacing={1}> 
                                                    <Typography variant="subtitle2" fontWeight={'bold'} textAlign={'left'}>Available appointments</Typography>
                                                    <Grid
                                                        container 
                                                        direction={'row'}
                                                        rowSpacing={1}
                                                        columnSpacing={0}
                                                    >
                                        {
                                            slots ? (

                                                Object.keys(slots).map((key, index) => {
                                                    const appointment = slots[key];
                                                    return (
                                                        
                                                        <Grid item key={index}>
                                                        <Button 
                                                            sx={{borderRadius: 10}}
                                                            //variant={selectedAppointment === appointment ? "contained": "outlined"}
                                                            size="sm"
                                                            onClick={() => console.log(appointment)} 
                                                            //color={selectedAppointment === appointment ? 'primary': 'secondary'}
                                                            id="appointmentButtons">
                                                            <Typography display="block" variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                            <Typography display="block" variant="caption">{"-"}</Typography>
                                                            <Typography display="block" variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                        </Button>
                                                        </Grid>
                                                    )
                                                })
                                            
                                            ): null
                                        }
                                    </Grid>
                                                </Stack>
                                            </Grow>
                                                
                                        </Box>
                                        
                            </Box>
                            ||
                            systemTypeSelected === WAITLIST 
                            && 
                            <Box id="waitlistSection"  sx={{pt: 2}}>
                                <Formik
                                initialValues={initialValues}
                                onSubmit={setDataAndContinue}
                                validationSchema={validationSchema}
                        >
                        {({ errors, touched, handleChange, handleBlur }) => (
                        <Form>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2} textAlign="left">


                        {employees && present.employees === true ? (
                            <>
                                <InputLabel id="employee">Employee preference</InputLabel>
                                <Field
                                as={Select}
                                id="employee"
                                name="employee_id"
                                onChange={handleChange}
                                >
                                {Array.isArray(employees) ? employees.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                            ) : null}

                            {services && present.services === true ? (
                            <>
                                <InputLabel id="services">Services</InputLabel>
                                <Field
                                as={Select}
                                id="services"
                                name="service_id"
                                onChange={handleChange}
                                >
                                { Array.isArray(services) ? services.map((service) => {
                                    if (!service.public) { return null;}
                                    return (
                                    <MenuItem key={service._id} value={service._id}>
                                        <Stack>
                                            <Typography variant="body2">{service.title}</Typography>
                                            <Typography variant="caption">{'Duration: ' + service.duration }</Typography>
                                            <Typography variant="caption">{present.servicePrice ? ("Cost: " + service.cost) : null}</Typography>
                                        </Stack>
                            
                                    </MenuItem>
                                    )}):null }
                                </Field>
                            </>
                            ) : null}

                            {resources && present.resources === true ? (
                            <>
                                <InputLabel id="resources" textAlign="left">Resources</InputLabel>
                                <Field
                                as={Select}
                                id="resources"
                                name="resource_id"
                                onChange={handleChange}
                                >
                                {Array.isArray(resources) ? resources.map((resource) => {
                                    if (!resource.public) { return null }
                                    return (
                                    <MenuItem key={resource._id} value={resource._id}>
                                        <Typography variant="body2">{resource.title} </Typography>
                                    </MenuItem>
                                    )}) : null}
                                </Field>
                            </>
                            ) : null}
                            <InputLabel id="notes" textAlign="left">Additional notes</InputLabel>
                            <Field
                            as={TextField}
                            id="notes"
                            name="notes"
                            label="Notes"
                            placeholder="Additional notes"
                            error={touched.notes && !!errors.notes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            <ErrorMessage name="notes" component="div" />
                        </Stack>
                        </Form>
                        )}
                                </Formik>
                            </Box>
                        }
                        <Container sx={{ pt: 3}}>
                            <Button disabled={systemTypeSelected === null} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
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
            </Box>


        </>
    )
}