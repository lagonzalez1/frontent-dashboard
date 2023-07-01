import React, { useState, useEffect} from "react";
import {Fab, Dialog, DialogTitle, Button, IconButton, DialogContent, TextField, Box, Typography, Stack, Select, MenuItem, InputLabel, Alert, ListItemAvatar, ListItemButton, ListItemIcon} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { Transition, addCustomerWaitlist  } from "./Helper";
import { useSelector, useDispatch } from "react-redux";
import { getResourcesAvailable, getServicesAvailable } from "../../hooks/hooks";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setBuisness } from "../../reducers/buisness";




export default function FabButton () {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [errors, setError] = useState();

    
    const buisness = useSelector(state => state.buisness);
    const serviceList = getServicesAvailable();
    const resourceList = getResourcesAvailable();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

    }, [])

    const handleSubmit = (payload) => {
        addCustomerWaitlist(payload, dispatch)
        .then(data => {
            dispatch(setBuisness(data.buisness));
            handleClose();
        })
        .catch(error => {
            setError('Error found: ' + error);
            console.log(error);
        });
    }

    const initialValues = {
        fullname: '',
        phone: '',
        size: '',
        service_id: '',
        resource_id: '',
        notes: ''
      };
    
      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().required('Phone number is required'),
        size: Yup.number().default(1),
        service_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string()
      });

    return(
        <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
            <Fab onClick={ handleClickOpen} color="primary" aria-label="add">
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

                    <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    >
                    {({ errors, touched, handleChange, handleBlur }) => (
                        <Form>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={3}>
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
                            id="phone"
                            name="phone"
                            label="Phone"
                            placeholder="Mobile phone"
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

                            {buisness ? (
                            <>
                                <InputLabel id="services">Services</InputLabel>
                                <Field
                                as={Select}
                                id="services"
                                name="service_id"
                                label="Service"
                                onChange={handleChange}
                                >
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

                            {buisness ? (
                            <>
                                <InputLabel id="resources">Resources</InputLabel>
                                <Field
                                as={Select}
                                id="resources"
                                name="resource_id"
                                label="Resources"
                                onChange={handleChange}
                                >
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

            </Dialog>
        </Box>
    )
}