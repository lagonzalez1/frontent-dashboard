import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Select, ButtonGroup, InputLabel, MenuItem, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { requestBusinessArguments, getExtras, getEmployeeList} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSize.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '@mui/icons-material/Close';


import * as Yup from 'yup';

export default function WelcomeSelector() {

    const { link } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [args, setArguments] = useState(null);
    const [openEmployees, setOpenEmployees] = useState(false);
    const [systemTypeSelected, setSystem] = useState(null);
    const currentDate = DateTime.now();

    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [present, setPresent] = useState(null);
    const [services, serServices] = useState(null);
    const [resources, setResouces] = useState(null);

    const initialValues = {
        employee_id: '',
        service_id: '',
        resource_id: '',
        notes: ''
    };
    
    const validationSchema = Yup.object({
        employee_id: Yup.string(),
        service_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string()
    });

    const [appointmentEmployees, setAppEmployees] = useState([]);
    const [service, setAppServices] = useState(null);
    const [appointmentData, setAppointmentData] = useState({
        date: null,
        start: null,
        end: null
    })

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
            serServices(data.services);
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

    const handleDateChange = (date) => {
        setAppointmentData((prev) => ({...prev, date: date}));
        getAvailableEmployees(date);
    }

    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate,link)
        .then(response => {
            setAppEmployees(response)
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
                            {error}
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
                                    <StaticDatePicker
                                        orientation="portrait"
                                        onChange={(newDate) => handleDateChange(newDate) }
                                        defaultValue={currentDate} />

                                        <Box sx={{display: 'flex'}}>
                                            <Fade in={openEmployees}>
                                                <Grid
                                                    container 
                                                    direction={'row'}
                                                    rowSpacing={1}
                                                    columnSpacing={0}
                                                >
                                                    
                                                    {   appointmentEmployees ? 
                                                        appointmentEmployees.map((item) => {
                                                            return (
                                                                <Grid item>
                                                                    <Button variant="outlined">
                                                                        { item.fullname}
                                                                    </Button>
                                                                </Grid>
                                                            )
                                                        })
                                                    : null}
                                                </Grid>
                                            </Fade>
                                        </Box>
                            </Box>
                            ||
                            systemTypeSelected === WAITLIST 
                            && 
                            <Box id="waitlistSection"  sx={{pt: 1}}>
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