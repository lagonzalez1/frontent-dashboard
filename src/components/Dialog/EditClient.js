import React, { useState, useEffect} from "react";
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Slide, Typography, Stack, Select, MenuItem, InputLabel, Alert, 
     ListItemIcon, Box, Container, CircularProgress} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useSelector, useDispatch } from "react-redux";
import { getEmployeeList, getResourcesAvailable, getServicesAvailable, handleErrorCodes } from "../../hooks/hooks";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setReload, setSnackbar } from "../../reducers/user";
import { requestClientEdit } from "./EditClientHelper";


export default function EditClient({setEditClient, editClient}) {


    const business = useSelector((state) => state.business);
    const serviceList = getServicesAvailable();
    const resourceList = getResourcesAvailable();
    const employeeList = getEmployeeList();

    const dispatch = useDispatch();


    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPayload(editClient.payload);
        return () => {
            if (editClient.payload === null) {
                return <></>;
            }
            console.log("return payload empty");
        }
    }, [editClient]);

    const initialValues = {
        _id: payload ? payload._id : '',
        fullname: payload ? payload.fullname : '',
        email: payload ? payload.email: '',
        phone: payload ? payload.phone : '',
        size: payload ? payload.partySize: 1,
        service_id: payload ? payload.serviceTag : '',
        resource_id: payload ? payload.resourceTag: '',
        employee_id: payload ? payload.employeeTag: '',
        notes: payload ? payload.notes : ''
      };
      
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;    
      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().required('Phone').matches(phoneRegex, 'Phone number must be in the format xxx-xxx-xxxx')
        .required('Phone number is required'),
        email: Yup.string(),
        size: Yup.number(),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string()
      });

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    const handleSubmit = (data) => {
        console.log(data);
        setLoading(true);
        // To edit search by email or phone number
        // on complete close closeDrawer()
        requestClientEdit(data)
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

    const closeDialog = () => {
        setEditClient({payload: null, open: false});
    }

    return(
        <> 
            <Box>
            <Dialog
                open={editClient ? editClient.open : false}
                TransitionComponent={Transition}
                onClose={closeDialog}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle> <Typography variant="h6" fontWeight="bold">
                    {"Edit client"}
                </Typography> 
                <IconButton
                    aria-label="close"
                    onClick={closeDialog}
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
                    <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    >
                    {({ errors, touched, handleChange, handleBlur }) => (
                        <Form>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                            <Field
                            as={TextField}
                            id="fullname"
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
                            label="Party size"
                            placeholder="1"
                            error={touched.size && !!errors.size}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                            {business ? (
                            <>
                                <InputLabel id="services">Services</InputLabel>
                                <Field
                                as={Select}
                                id="services"
                                name="service_id"
                                label="Service"
                                onChange={handleChange}
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
                                </Field>
                            </>
                            ) : null}

                            {business ? (
                            <>
                                <InputLabel id="resources">Resources</InputLabel>
                                <Field
                                as={Select}
                                id="resources"
                                name="resource_id"
                                label="Resources"
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

                        {business ? (
                            <>
                                <InputLabel id="employees">Employee preference</InputLabel>
                                <Field
                                as={Select}
                                id="employee_id"
                                name="employee_id"
                                label="Employees"
                                onChange={handleChange}

                                >
                                <MenuItem key={'NONE'} value={''}>none</MenuItem>
                                {Array.isArray(employeeList) ? employeeList.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                            ) : null}

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

                            <Button variant="contained" type="submit">Submit</Button>
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
