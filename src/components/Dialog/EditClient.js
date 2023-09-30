import React, { useState, useEffect} from "react";
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Typography, Stack, Select, MenuItem, InputLabel, Alert, 
     ListItemIcon, Box, Container, CircularProgress, Grid} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useSelector, useDispatch } from "react-redux";
import { getEmployeeList, getResourcesAvailable, getServicesAvailable, handleErrorCodes, getAvailableAppointments } from "../../hooks/hooks";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DateTime } from "luxon";
import { setReload, setSnackbar } from "../../reducers/user";
import { DatePicker } from "@mui/x-date-pickers";
import { requestClientEditWait, requestClientEditApp, Transition, PHONE_REGEX } from "./EditClientHelper";
import { APPOINTMENT, WAITLIST } from "../../static/static";


export default function EditClient({setEditClient, editClient}) {


    const business = useSelector((state) => state.business);
    const serviceList = getServicesAvailable();
    const resourceList = getResourcesAvailable();
    const employeeList = getEmployeeList();

    const dispatch = useDispatch();

    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [errors, setErrors ] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [appointments, setAppointments] = useState(null);

    useEffect(() => {
        if (editClient) {
            setPayload(editClient.payload);
        }
    },[editClient]);

    let initialValues = {
        _id: editClient ? editClient.payload._id : '',
        fullname: editClient ? editClient.payload.fullname : '',
        email: editClient ? editClient.payload.email: '',
        phone: editClient ? editClient.payload.phone : '',
        size: editClient ? editClient.payload.partySize: 1,
        service_id: editClient ? editClient.payload.serviceTag : '',
        resource_id: editClient ? editClient.payload.resourceTag: '',
        employee_id: editClient ? editClient.payload.employeeTag: '',
        notes: editClient ? editClient.payload.notes : '',
      };
      
      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().matches(PHONE_REGEX, 'Phone number must be in the format xxx-xxx-xxxx')
        .required('Phone number is required'),
        email: Yup.string(),
        size: Yup.number(),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string(),
      });



    const handleSubmit = (data) => {
        if (editClient.fromComponent === APPOINTMENT){
            const payload = { ...data, appointment: selectedAppointment, appointmentDate: selectedDate}
            appointmentEdit(payload);
        }
        if (editClient.fromComponent === WAITLIST){
            const payload = { ...data}
            waitlistEdit(payload);
        }
    }

    const waitlistEdit = (payload) => {
        requestClientEditWait(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            console.log(error);
            dispatch(setSnackbar({ requestMessage: error.response.msg, requestStatus: true} ))
        })
        .finally(() => {
            setLoading(false);
            dispatch(setReload(true));
            closeDialog();
        })
    } 

    const appointmentEdit = (payload) => {
        requestClientEditApp(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            console.log(error);
            dispatch(setSnackbar({ requestMessage: error.response.msg, requestStatus: true} ))
        })
        .finally(() => {
            setLoading(false);
            dispatch(setReload(true));
            closeDialog();
        })
    }


    const handleAppointmentClick = (app) => {
        setSelectedAppointment(app);
    }

    const closeDialog = () => {
        setEditClient({payload: null, open: false});
    }

    const FutureDatePicker = ({ label, value, onChange }) => {
        const currentDate = DateTime.local().setZone(business.timezone);
    
        return (
          <Box>
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
          </Box>
        );
      };

      const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const searchAppointments = (employeeId, serviceId) => {
        if (!selectedDate || !serviceId || !employeeId) {
            setErrors('Missing date and service.');
            return;
        }
        setErrors(null);
        const payload = { employeeId: employeeId, serviceId: serviceId, appointmentDate: selectedDate }
        getAvailableAppointments(payload)
        .then(response => {
            setAppointments(response.data)
            setSuccess(response.msg)
        })
        .catch(error => {
            setErrors(error);
        })
        .finally(() => {
            //setLoading(false);
        })
    }

    return(
        <> 
            <Box>
            <Dialog
                open={editClient ? editClient.open : false}
                TransitionComponent={Transition}
                onClose={() => closeDialog()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle> 
                    <Typography variant="h6" fontWeight="bold">
                    {"Edit client"}
                </Typography> 
                <IconButton
                    aria-label="close"
                    onClick={() => closeDialog()}
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

                {loading ? (
                <Container sx={{ p: 2}}>
                    <CircularProgress />
                </Container>) : 
                <DialogContent>
                    { errors ? <Alert severity="error">{errors}</Alert>: null }
                    { success ? <Alert severity="success">{success}</Alert>: null }
                    <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                    
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

                            <Field
                            as={TextField}
                            id="phone"
                            size="small"
                            name="phone"
                            label="Phone"
                            placeholder="xxx-xxx-xxxx"
                            error={touched.phone && !!errors.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

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
                            <Grid container>
                                <Grid item xs={12} md={6} sm={6}>
                                {business ? (
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Resources</Typography>
                                <Field
                                as={Select}
                                labelId="resources"
                                size="small"
                                fullWidth={true}
                                name="resource_id"
                                onChange={handleChange}
                                >
                                <MenuItem key={'NONE'} value={''}>none</MenuItem>
                                {Array.isArray(resourceList) ? resourceList.map((resource) => (
                                    <MenuItem key={resource._id} value={resource._id}>
                                        <ListItemIcon>
                                            { resource.serving && resource.active ? <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> : <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> }
                                        </ListItemIcon>
                                        <Typography variant="body2">{resource.title} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                            ) : null}
                            </Grid>
                            <Grid item xs={12} md={6} sm={6}>
                            {business ? (
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Employee preference</Typography>
                                <Field
                                as={Select}
                                id="employee_id"
                                name="employee_id"
                                size="small"
                                fullWidth={true}
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
                                </Grid>
                            </Grid>
                            

                            {values.employee_id ? (
                                
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Services available</Typography>
                                <Field
                                as={Select}
                                labelId="services"
                                name="service_id"
                                size="small"
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

                            {
                                editClient.fromComponent === APPOINTMENT && 
                                (
                                    <>
                                        <Box>
                                            <FutureDatePicker label="Date" value={selectedDate} onChange={handleDateChange} />
                                        
                                        </Box>
                                        <Button sx={{ borderRadius: 10}} fullWidth={false} variant="outlined" onClick={() => searchAppointments(values.employee_id, values.service_id) }>Search</Button>
                                        <br/>
                                    </>
                                )
                            }
                            {
                                (editClient.fromComponent === APPOINTMENT && appointments !== null) ? 
                                (
                                    <div style={{ width: '100%', height: '100%',overflowX: 'auto'}}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
                                        <Stack direction={'row'}>
                                        
                                        { 
                                           Object.keys(appointments).map((key, index) => {
                                            const appointment = appointments[key];
                                            return (
                                                <Button 
                                                    sx={{ margin: 1, borderRadius: 10}}
                                                    variant={selectedAppointment === appointment ? "contained": "outlined"}
                                                    onClick={() => handleAppointmentClick(appointment)} 
                                                    color={selectedAppointment === appointment ? 'primary': 'secondary'}
                                                    id="appointmentButtons">
                                                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{"-"}</Typography>
                                                    <Typography sx={{ whiteSpace: 'nowrap' }}  variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                </Button>
                                            )
                                        })
                                        }
                                        </Stack>
                                        </Box>
                                    </div>
                                )
                                :null
                            }
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
                            <Button sx={{ borderRadius: 10}} variant="contained" type="submit">Submit</Button>
                        </Stack>
                        </Form>
                    )}
                    </Formik>
                </DialogContent>
                }

            </Dialog>
            </Box>

        
        </>
    )
}
