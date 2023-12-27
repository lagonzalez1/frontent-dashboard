import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, Select, MenuItem, IconButton, Menu, TextField, InputLabel,ListItemIcon} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { ThemeProvider } from "@emotion/react";
import { ClientWelcomeTheme } from "../../theme/theme";
import { useParams } from "react-router-dom";
import { allowClientJoin, getExtras } from "./WelcomeHelper";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSize.css";
import { DateTime } from "luxon";


export default function WelcomeExtras() {

    const { link } = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState(null);
    const [present, setPresent] = useState(null);
    const [services, serServices] = useState(null);
    const [resources, setResouces] = useState(null);

    const navigate = useNavigate();

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


    const getBuisnessExtras = () => {
        const currentDate = DateTime.local().toISO();
        getExtras(link, currentDate)
        .then(data => {
            setPresent(data.present);
            setEmployees(data.employees);
            setResouces(data.resources);
            serServices(data.services);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const setDataAndContinue = (payload) => {
        let object = sessionStorage.getItem('client');
        // If object is empty, missing size to initialize.
        if (!object){ navigate(`/welcome/${link}/size`)}

        let previousData = JSON.parse(object);
        const update = { ...previousData, ...payload}
        console.log(update);
        sessionStorage.setItem('client', JSON.stringify(update));
        navigate(`/welcome/${link}/details`);
    }
    
    useEffect(() => {
        redirectStatus();
        getBuisnessExtras();
    }, [loading]);


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
   

    const redirectBack = () => {
        navigate(`/welcome/${link}`)
    }
    return (
        <>  
            <ThemeProvider theme={ClientWelcomeTheme}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card className="custom-card" sx={{ maxWidth: '100vh', minWidth: '40%',  minHeight: '70vh', textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>

                    {loading ? <CircularProgress/> : (<>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    <CardContent>
                    
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            Extras
                        </Typography>

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
                                label="Employee preference"
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
                                label="Service"
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
                                label="Resources"
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
                            <InputLabel id="notes" textAlign="left">Anything we need to know before ?</InputLabel>

                            <Field
                            as={TextField}
                            id="notes"
                            name="notes"
                            label="Notes"
                            placeholder="notes"
                            error={touched.notes && !!errors.notes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                            <ErrorMessage name="notes" component="div" />

                            <Container sx={{ pt: 3}}>
                                <Button type="submit" fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary">
                                    <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                        Next
                                    </Typography>
                                </Button> 
                            </Container>

                        </Stack>
                        </Form>
                        )}
                        </Formik>


                        
                                    
                    </CardContent>
                    </>)}


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>
            </ThemeProvider>

        </>
    )
}