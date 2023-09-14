import React, { useState, useEffect} from "react";
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Box, Typography, Stack, Select, MenuItem, InputLabel, Alert, Grid, 
    ListItemAvatar, ListItemButton, ListItemIcon, CardContent, Container, Card, CircularProgress} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from "./FabHelper";
import { useSelector, useDispatch } from "react-redux";
import { getEmployeeList, getResourcesAvailable, getServicesAvailable, handleErrorCodes } from "../../hooks/hooks";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { StyledCard } from "../../pages/Register/CardStyle";
import ToggleButton from 'react-bootstrap/ToggleButton';

import { setBusiness } from "../../reducers/business";
import { setReload, setSnackbar } from "../../reducers/user";
import axios from "axios";
import { getHeaders } from "../../auth/Auth";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";




export default function FabAppointment () {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [errors, setError] = useState();
    const [nextStep, setNextStep] = useState(false);


    const [loading, setLoading] = useState(false);
    const business = useSelector((state) => state.business);
    const [appointments, setAppointments] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const serviceList = getServicesAvailable();
    const employeeList = getEmployeeList();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

    }, [])

    const searchAppointments = (employeeId, serviceId) => {
        setNextStep(true);
        setLoading(true);
        const header = getHeaders();
        axios.post('/api/internal/available_appointments', {bid: business._id, appointmentDate: selectedDate , serviceId: serviceId, employeeId: employeeId}, header )
        .then(response => {
            setAppointments(response.data.data);
        })
        .catch(error => {
            setError(error.response.data.msg);
            console.log(error);
        })
        .finally(() =>{
            setLoading(false);
        })
    }

    const handleSubmit = (payload) => {
        console.log(payload);
        console.log(selectedAppointment); // index
        /*
        addCustomerWaitlist(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
        })
        .finally(() => {
            dispatch(setReload(true));
            handleClose();
        })
        */
    }
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value; // Handle empty values
      
        // Remove any non-numeric characters (e.g., hyphens)
        const numericValue = value.replace(/\D/g, '');
      
        // Add hyphens after the first three and the next three characters
        if (numericValue.length > 3) {
          return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        } else {
          return numericValue;
        }
      };

    const initialValues = {
        fullname: '',
        email: '',
        phone: '',
        size: '',
        service_id: '',
        resource_id: '',
        employee_id: '',
        notes: '',
        start: '',
        end: '',
        date: '',
      };
      
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;    
      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().required('Phone').matches(phoneRegex, 'Phone number must be in the format XXX-XXX-XXXX')
        .required('Phone number is required'),
        email: Yup.string().required(),
        size: Yup.number().default(1),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string(),
        start: Yup.string(),
        end: Yup.string(),
        date: Yup.string()
      });

      const FutureDatePicker = ({ label, value, onChange }) => {
        const currentDate = DateTime.local().setZone(business.timezone);
    
        return (
          <Box>
          <DatePicker
            label={label}
            sx={{ width: '100%'}}
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} />}
            minDate={currentDate}
          />
          </Box>
        );
      };

    return(
        <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
            <Fab onClick={ () =>  handleClickOpen()} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="addClient"
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle> <Typography variant="h6" fontWeight="bold">{"Add customer to appointments"}
                
                </Typography> 
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

                    { errors ? <Alert severity="error">{errors}</Alert>: null }
                    

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                        <Form>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                            
                            
                            {nextStep ? null : 
                            <Field
                            as={TextField}
                            id="fullname"
                            name="fullname"
                            size="small"
                            label="Customer name"
                            placeholder="Customer name"
                            error={touched.fullname && !!errors.fullname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            }
                            {nextStep ? null : 
                            <Field
                            as={TextField}
                            id="email"
                            size="small"
                            name="email"
                            label="Customer email"
                            placeholder="Email"
                            error={touched.email && !!errors.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            }
                            {nextStep ? null : 
                            <Field
                            as={TextField}
                            id="phone"
                            name="phone"
                            size="small"
                            label="Phone"
                            placeholder="xxx-xxx-xxxx"
                            error={touched.phone && !!errors.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            }
                            {nextStep ? null : 

                            <Field
                            as={TextField}
                            id="size"
                            size="small"
                            name="size"
                            label="Party size"
                            placeholder="1"
                            error={touched.size && !!errors.size}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            }
                            <FutureDatePicker label="Date" value={selectedDate} onChange={handleDateChange} />

                            {business ? (
                            <>
                                <InputLabel id="employees">Employee preference</InputLabel>
                                <Field
                                as={Select}
                                id="employee_id"
                                name="employee_id"
                                size="small"
                                label="Employees"
                                onChange={handleChange}
                                >
                                {Array.isArray(employeeList) ? employeeList.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                            ) : null}

                            {values.employee_id ? (
                                
                            <>
                                <InputLabel id="services">Services</InputLabel>
                                <Field
                                as={Select}
                                id="services"
                                name="service_id"
                                size="small"
                                label="Service"
                                onChange={handleChange}
                                >
                                { Array.isArray(serviceList) ?
                                
                                serviceList
                                .filter((service) => service.employeeTags.includes(values.employee_id))
                                .map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        <Stack>
                                            <Typography variant="body2">{service.title}</Typography>
                                            <Typography variant="caption">{'Duration: ' + service.duration + ", Cost: " + service.cost }</Typography>
                                        </Stack>
                            
                                    </MenuItem>
                                )):null }
                                </Field>
                            </>
                            ) : null}


                            <Field
                            as={TextField}
                            id="notes"
                            size="small"
                            name="notes"
                            label="Notes"
                            placeholder="Additional notes"
                            error={touched.notes && !!errors.notes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                    { loading ? <CircularProgress/> : null} 
                    {nextStep ? 
                            (
                                    <Grid 
                                    container 
                                    direction={'row'}
                                    rowSpacing={1}
                                    columnSpacing={0}

                                    
                                    >
                                        {
                                            appointments ? (

                                                Object.keys(appointments).map((key, index) => {
                                                    const appointment = appointments[key];
                                                    return (
                                                        
                                                        <Grid item key={index}>
                                                        <ToggleButton 
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onChange={(e) => setSelectedAppointment(e.target.value)} 
                                                            checked={selectedAppointment} value={index} key={index} 
                                                            id="appointmentButtons">
                                                            <Typography variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                            <Typography variant="caption">{"-"}</Typography>
                                                            <Typography variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                        </ToggleButton>
                                                        </Grid>
                                                    )
                                                })
                                            
                                            ): null
                                            }
                                    </Grid>
                            
                            )
                            :
                            null}

                            <ErrorMessage name="notes" component="div" />
                            
                            {nextStep ? 
                            (
                            <>
                            <Button variant="outlined" sx={{ borderRadius: 15}} onClick={() => setNextStep(false)}> back</Button>
                            <Button variant="contained" sx={{ borderRadius: 15}} type="submit">Submit</Button>
                            </>
                            ): 
                            <Button variant="contained" sx={{ borderRadius: 15}} onClick={() => searchAppointments(values.employee_id, values.service_id)}> search</Button>
                            }
                        </Stack>
                        </Form>
                    )}
                    </Formik>

                </DialogContent>        
            </Dialog>
        </Box>
    )
}