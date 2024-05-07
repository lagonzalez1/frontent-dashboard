import React, { useState, useEffect} from "react";ListItemIcon
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Box, Typography, Stack, Select, MenuItem, InputLabel, Alert, Grid, 
    ListItemAvatar, ListItemButton, ListItemIcon, CardContent, Container, Card, CircularProgress, useForkRef, AlertTitle} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from "./FabHelper";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableAppointments, getEmployeeList, getServicesAvailable } from "../../hooks/hooks";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {createAppointmentPretense } from "./FabHelper";
import { setReload, setSnackbar } from "../../reducers/user";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useSubscription } from "../../auth/Subscription";
import { usePermission } from "../../auth/Permissions";
import LoadingButton from '@mui/lab/LoadingButton';



export default function FabAppointment () {

    const dispatch = useDispatch();
    const { cancelledSubscription } = useSubscription();
    const { checkPermission } = usePermission();
    const [open, setOpen] = useState(false);
    const [errors, setError] = useState();
    const [success, setSuccess] = useState();
    const [nextStep, setNextStep] = useState(false);


    const [loading, setLoading] = useState(false);
    const [app_loader, setApp_loader] = useState(false);
    const business = useSelector((state) => state.business);
    const [appointments, setAppointments] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);

    const serviceList = getServicesAvailable();
    const employeeList = getEmployeeList();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedAppointment(null);
        setAppointments(null);
        setPhoneNumber(null)
        setSelectedDate(null)
        setOpen(false);
        setError();
    };

    useEffect(() => {

    }, [])

    const searchAppointments = (employeeId, serviceId) => {
        if (!selectedDate || !serviceId || !employeeId) {
            setError('Missing date and service.');
            return;
        }
        setError(null);
        setNextStep(true);
        setLoading(true);
        const payload = { employeeId: employeeId, serviceId: serviceId, appointmentDate: selectedDate }
        getAvailableAppointments(payload)
        .then(response => {
            setAppointments(response.data)
            setSuccess(response.msg)
        })
        .catch(error => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const handleSubmit = (payload) => {
        if (!payload && !selectedAppointment && !selectedDate) {
            dispatch(setSnackbar({requestMessage: 'Missing values found', requestStatus: true}));
            return;
        }
        setApp_loader(true);
        const timestamp = DateTime.local().setZone(business.timezone).toUTC().toISO();
        const date = DateTime.fromISO(selectedDate, {zone: 'utc'}).toUTC().toISO();
        const data = { ...payload, appointmentDate: date, appointment: selectedAppointment, timestamp};
        createAppointmentPretense(data)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
        })
        .finally(() => {
            setApp_loader(false);
            dispatch(setReload(true));
            handleClose();
        })
    }

    const handleAppointmentClick = (app) => {
        setSelectedAppointment(app);
    }
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatPhoneNumber = (input) => {
        const digits = input.replace(/\D/g, '');
        if (digits.length <= 3) {
            return digits;
            } else if (digits.length <= 6) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    }
    const phoneNumberChange = (event) => {
        const input = event.target.value;
        // Apply formatting to the input and update the state
        const phoneNumber = formatPhoneNumber(input);
        if (phoneNumber.length === 12) {
            console.log("Completed", phoneNumber);
            formik.setFieldValue('phone', phoneNumber);
        }
        setPhoneNumber(phoneNumber);
    }

    const initialValues = {
        fullname: '',
        email: '',
        phone: '',
        size: '',
        service_id: '',
        resource_id: '',
        employee_id: '',
        notes: '',
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
      });

      const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
      })

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

    return(
        <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
            <Fab onClick={ () =>  handleClickOpen()} color="secondary" aria-label="add">
                <AddIcon />
            </Fab>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted={true}
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
                    { employeeList && employeeList.length === 0 ?  (<Alert severity="warning"><AlertTitle><strong>Appointments info</strong></AlertTitle>In order to use appointments, you must have employees with schedules ready to book. 
                    Check out settings page under <u> add employees!</u></Alert>): null}

                    { serviceList && serviceList
                                .filter((service) => service.employeeTags.includes(formik.values.employee_id)).length === 0 ?  (<Alert severity="warning"><AlertTitle><strong>Appointments info</strong></AlertTitle>In order for your customers to book appointments you need to attach your employees to your services! Check out the side bar <u>Services</u></Alert>): null}
                    { errors ? <Alert severity="error">{errors}</Alert>: null }
                    <form onSubmit={formik.handleSubmit}>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                            {nextStep ? null : 
                            <TextField
                            id="fullname"
                            name="fullname"
                            size="small"
                            label="Customer name"
                            placeholder="Customer name"
                            error={formik.touched.fullname && !!errors.fullname}
                            onChange={formik.handleChange}
                            value={formik.values.fullname}

                            />
                            }
                            {nextStep ? null : 
                            <TextField
                            id="email"
                            size="small"
                            name="email"
                            label="Customer email"
                            placeholder="Email"
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            />
                            }
                            {nextStep ? null : 
                            <TextField
                            id="phone"
                            name="phone"
                            size="small"
                            label="Phone"
                            placeholder="xxx-xxx-xxxx"
                            error={formik.touched.phone && !!errors.phone}
                            onChange={(event) => phoneNumberChange(event)}
                            value={phoneNumber}
                            />
                            }
                            {nextStep ? null : 

                            <TextField
                            id="size"
                            size="small"
                            name="size"
                            label="Party size"
                            placeholder="1"
                            type="number"
                            error={formik.touched.size && !!errors.size}
                            onChange={formik.handleChange}
                            value={formik.values.size}
                            />
                            }
                            <FutureDatePicker label="Date" value={selectedDate} onChange={handleDateChange} />

                            {business ? (
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Employee preference</Typography>
                                <Select
                                id="employee_id"
                                name="employee_id"
                                size="small"
                                value={formik.values.employee_id}
                                onChange={formik.handleChange}
                                >
                                {Array.isArray(employeeList) ? employeeList.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Select>
                            </>
                            ) : null}

                            {formik.values.employee_id ? (
                                
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Services available</Typography>
                                <Select
                                id="services"
                                name="service_id"
                                size="small"
                                value={formik.values.service_id}
                                onChange={formik.handleChange}
                                >
                                { Array.isArray(serviceList) ?
                                
                                serviceList
                                .filter((service) => service.employeeTags.includes(formik.values.employee_id))
                                .map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        <Stack>
                                            <Typography variant="body2">{service.title}</Typography>
                                            <Typography variant="caption">{'Duration: ' + service.duration + ", Cost: " + service.cost }</Typography>
                                        </Stack>
                            
                                    </MenuItem>
                                )):null }
                                </Select>
                            </>
                            ) : null}


                            <TextField
                                id="notes"
                                size="small"
                                name="notes"
                                label="Notes"
                                placeholder="Additional notes"
                                onChange={formik.handleChange}
                                value={formik.values.notes}
                            />

                            { loading ? <CircularProgress size={15}/> : null} 
                            
                            
                            {nextStep ? 
                                    (
                                    <>
                                    <Typography fontWeight={'bold'} variant="subtitle2">Available appointments</Typography>
                                    { success ? <Alert severity="success">{success}</Alert>: null}
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
                                                        <Button 
                                                            sx={{borderRadius: 10}}
                                                            variant={selectedAppointment === appointment ? "contained": "outlined"}
                                                            size="sm"
                                                            onClick={() => handleAppointmentClick(appointment)} 
                                                            color={selectedAppointment === appointment ? 'primary': 'secondary'}
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
                                    </>
                            )
                            :
                            null}

                            {nextStep ? 
                            (
                            <>
                            <Button variant="outlined" sx={{ borderRadius: 10}} onClick={() => setNextStep(false)}> back</Button>
                            <LoadingButton loading={app_loader} disabled={cancelledSubscription()} variant="contained" sx={{ borderRadius: 10}} type="submit">Submit</LoadingButton>
                            </>
                            ): 
                            <Button disabled={cancelledSubscription()} variant="contained" sx={{ borderRadius: 15}} onClick={() => searchAppointments(formik.values.employee_id, formik.values.service_id)}> search</Button>
                            }
                        </Stack>
                    </form>
                </DialogContent>        
            </Dialog>
        </Box>
    )
}