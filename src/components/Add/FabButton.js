import React, { useState, useEffect} from "react";
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Box, Typography, Stack, Select, MenuItem, InputLabel, Alert, 
    ListItemAvatar, ListItemButton, ListItemIcon} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { Transition, addCustomerWaitlist  } from "./Helper";
import { useSelector, useDispatch } from "react-redux";
import { getEmployeeList, getResourcesAvailable, getServicesAvailable, handleErrorCodes } from "../../hooks/hooks";
import { Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { setBusiness } from "../../reducers/business";

import { setReload, setSnackbar } from "../../reducers/user";




export default function FabButton () {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [errors, setError] = useState();

    
    const business = useSelector((state) => state.business);
    const serviceList = getServicesAvailable();
    const [phoneNumber, setPhoneNumber] = useState(null);
    const resourceList = getResourcesAvailable();
    const employeeList = getEmployeeList();
    const permissionLevel = useSelector((state) => state.user.permissions);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

    }, [])

    const handleSubmit = (payload) => {
        console.log("Called")
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
    }

    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    const initialValues = {
        fullname: '',
        email: '',
        phone: '',
        size: '',
        service_id: '',
        resource_id: '',
        employee_id: '',
        notes: ''
      };

      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().matches(phoneRegex, 'Phone number must be in the format xxx-xx-xxxx').required('Req'),
        email: Yup.string().required(),
        size: Yup.number().default(1),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string()
      });

      const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit

    })
    
      // Need to implement this later on
    // Stops cursor at 12 long and inputs dashes for US numbers
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
                <DialogTitle> <Typography variant="h6" fontWeight="bold">{"Add Customer to waitlist"}
                
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

                    <form onSubmit={formik.handleSubmit}>
                    
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                            <TextField
                            id="fullname"
                            name="fullname"
                            size="small"
                            label="Customer name"
                            placeholder="Customer name"
                            value={formik.values.fullname}
                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                            onChange={formik.handleChange}
                            />
                            <TextField
                            id="email"
                            name="email"
                            size="small"
                            label="Customer email"
                            placeholder="Email"
                            value={formik.values.email}

                            error={formik.touched.email && Boolean(formik.errors.email)}
                            onChange={formik.handleChange}
                            />

                            <TextField
                            id="phone"
                            name="phone"
                            label="Phone"
                            size="small"
                            value={phoneNumber}
                            onChange={(event) => phoneNumberChange(event)}
                            placeholder="xxx-xxx-xxxx"
                            
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            />

                            <TextField
                            id="size"
                            name="size"
                            size="small"
                            label="Party size"
                            value={formik.values.size}

                            placeholder="1"
                            error={formik.touched.size && Boolean(formik.errors.size)}
                            onChange={formik.handleChange}
                            />

                            {business ? (
                            <>
                                <InputLabel id="services">Services</InputLabel>
                                <Select
                                labelId="services"
                                name="service_id"
                                size="small"
                                value={formik.values.service_id}
                                onChange={formik.handleChange}
                                >
                                <MenuItem key={'NONE'} value={''}>none</MenuItem>
                                { Array.isArray(serviceList) ? serviceList.map((service) => (
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

                            {business ? (
                            <>
                                <InputLabel id="resources">Resources</InputLabel>
                                <Select
                                id="resources"
                                name="resource_id"
                                size="small"
                                value={formik.values.resource_id}

                                onChange={formik.handleChange}
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
                                </Select>
                            </>
                            ) : null}

                        {business ? (
                            <>
                                <InputLabel id="employees">Employee preference</InputLabel>
                                <Select
                                id="employee_id"
                                name="employee_id"
                                value={formik.values.employee_id}

                                size="small"
                                onChange={formik.handleChange}
                                >
                                <MenuItem key={'NONE'} value={''}>none</MenuItem>
                                {Array.isArray(employeeList) ? employeeList.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Select>
                            </>
                            ) : null}

                            <TextField
                            id="notes"
                            name="notes"
                            size="small"
                            placeholder="Additional notes"
                            value={formik.values.notes}

                            error={formik.touched.notes && !!formik.errors.notes}
                            onChange={formik.handleChange}
                            />
                            <Button disabled={(permissionLevel === 3) ? true: false} sx={{borderRadius: 10}} variant="contained" type="submit">Submit</Button>
                        </Stack>
                    
                    </form>

                </DialogContent>

            </Dialog>
        </Box>
    )
}