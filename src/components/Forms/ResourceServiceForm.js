import React, {useState , useEffect} from "react";
import { Formik, Form, Field } from 'formik';

import { Typography, ListItem, ListItemText, List, ListItemButton, Dialog, DialogTitle, Checkbox,
    DialogContent, Stack, TextField, Button ,IconButton, DialogActions, Divider, Box, CircularProgress, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { validationSchemaService, validationSchemaResource, updateResource, updateService, requestRemoveService, requestRemoveResource } from "../FormHelpers/ResourceServiceFormHelper";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";


export default function ResourceServiceForm () {

    const [resourceDialog, setResourceDialog] = useState(false)
    const [servicesDialog, setServiceDialog] = useState(false)
    const [loading, setLoading] = useState(false);

    const [resourceId, setResourceId] = useState(null)
    const [serviceId, setServiceId] = useState(null)

    const dispatch = useDispatch();
    
    const resources = useSelector((state) => state.business.resources);
    const services = useSelector((state) => state.business.services);


    const closeResourceDialog = () => {
        setResourceDialog(false);
        setResourceId(null)

    }
    const closeServiceDialog = () => {
        setServiceDialog(false);
        setServiceId(null);
    }

    const openResourceDialog = (item) => {
        setResourceDialog(true);
        setResourceId(item._id)
    }

    const openServiceDialog = (item) => {
        setServiceDialog(true);
        setServiceId(item._id)
    }

    const serviceSubmit = (value) => {
        setLoading(true);
        if (value.delete === true) {
            console.log(serviceId);
            const payload = { ...value, serviceId }

            requestRemoveService(payload)
            .then(response => {
                dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
            })
            .catch(error => {
                dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
            })
            .finally(() => {
                dispatch(setReload(true))
                setLoading(false);
            })
            return;
        }
        const payload = { ...value, serviceId }
        updateService(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true))
            setLoading(false);

        })

    }
    const resourceSubmit = (value) => {
        setLoading(true);
        if (value.delete === true) {
            console.log(resourceId);
            const payload = { ...value, resourceId }
            requestRemoveResource(payload)
            .then(response => {
                dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
            })
            .catch(error => {
                dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
            })
            .finally(() => {
                dispatch(setReload(true))
                setLoading(false);
            })
            return;
        }
        const payload = { ...value, resourceId }

        updateResource(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true))
            setLoading(false);

        })
    }

    

    const initialValuesServices = { 
        title: '',
        size: 0,
        delete: false,
    }


    const initialValuesResources = { 
        title: '',
        description: '',
        duration: 0,
        delete: false
    }

    

    return (
        <>
            <Typography fontWeight='bold' variant="body2">
                    Resources
            </Typography>
            <List>
            {
                resources ? resources.map((item) => (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => openResourceDialog(item) }>
                            <ListItemText primary={item.title} secondary={item.description} />
                        </ListItemButton>
                    </ListItem>
                    ))
            : null }

            
            </List>
                <Typography fontWeight='bold' variant="body2">
                    Services
                </Typography>
            <List>
            {
                services ? services.map((item) => (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => openServiceDialog(item) }>
                            <ListItemText primary={item.title} secondary={item.description} />
                        </ListItemButton>
                    </ListItem>
                    ))
            : null}
            </List>

            <Dialog
                open={servicesDialog}
                onClose={closeServiceDialog}
                maxWidth={'xs'}
                fullWidth={'xs'}

            >
                <DialogTitle>
                        <IconButton
                                aria-label="close"
                                onClick={closeServiceDialog}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                                >
                                <CloseIcon />
                            </IconButton> 
                            <strong>
                            Services
                            </strong>

                        </DialogTitle>
                         {loading ? (
                            <Container sx={{p: 2}}>
                                <CircularProgress />
                            </Container>
                         ) : 
                        <DialogContent>
                            <Box>
                        <Typography variant="caption"></Typography>
                        <Divider/>
                    <Formik
                        initialValues={initialValuesServices}
                        validationSchema={validationSchemaService}
                        onSubmit={serviceSubmit}
                        >
                    {({errors, touched, values, setFieldValue}) => (
                        <Form>
                        <Stack spacing={2}>
                            <Field
                                name="title"
                                as={TextField}
                                label="Title"
                                variant="outlined"
                                fullWidth
                                error={touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                            />

                            <Field
                                name="size"
                                as={TextField}
                                label="Party size"
                                variant="outlined"
                                fullWidth
                                error={touched.size && !!errors.size}
                                helperText={touched.size && errors.size}
                            />
                            <Box sx={{ textAlign: 'left'}}>
                            <Stack direction="row" alignContent={'center'} alignItems={'center'}>

                                <Typography variant="body2">Delete service ?</Typography>
                                <Field
                                    key={'deleteService'}
                                    type="checkbox"
                                    as={Checkbox}
                                    name={'delete'}
                                    checked={values.delete}   
                                    onChange={(event) => {
                                        setFieldValue(`delete`, event.target.checked)
                                    }}                             
                                    control={
                                        <Checkbox
                                            color="primary"
                                        />
                                    }
                                    />
                            </Stack>
                            
                            </Box>
                                
                        <Button variant='contained' type="submit"  sx={{borderRadius: 15}}>
                            Save
                        </Button>
                        </Stack>
                        

                    </Form>
                    )}
                    </Formik>
                    </Box>
                        </DialogContent>
                        }
                


                <DialogActions>
                    
                </DialogActions>
            </Dialog>


            <Dialog
                open={resourceDialog}
                onClose={closeResourceDialog}
                maxWidth={'xs'}
                fullWidth={'xs'}

            >
                <DialogTitle>
                    <IconButton
                            aria-label="close"
                            onClick={closeResourceDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                            >
                            <CloseIcon />
                        </IconButton> 
                        <strong>
                        Resources
                        </strong>

                    </DialogTitle>
                    
                    { loading ? (
                    <Container sx={{p: 2}}>
                        <CircularProgress />
                    </Container>
                    ) : 
                    <DialogContent>
                    <Typography variant="caption"></Typography>
                    <Divider/>
                <Formik
                    initialValues={initialValuesResources}
                    validationSchema={validationSchemaResource}
                    onSubmit={resourceSubmit}

                    >
                {({errors, touched, values, setFieldValue}) => (
                    <Form>
                    <Stack spacing={2}>
                        <Field
                            name="title"
                            as={TextField}
                            label="Title"
                            variant="outlined"
                            fullWidth
                            error={touched.title && !!errors.title}
                            helperText={touched.title && errors.title}
                        />

                        <Field
                            name="description"
                            as={TextField}
                            label="Description"
                            variant="outlined"
                            fullWidth
                            error={touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                        />

                        <Field
                            name="duration"
                            as={TextField}
                            label="Duration"
                            variant="outlined"
                            fullWidth
                            error={touched.duration && !!errors.duration}
                            helperText={touched.duration && errors.duration}
                        />
                        <Box sx={{ textAlign: 'left'}}>
                            <Stack direction="row" alignContent={'center'} alignItems={'center'}>
                            <Typography variant="body2">Delete resource ?</Typography>
                                <Field
                                    key={'deleteResource'}
                                    type="checkbox"
                                    as={Checkbox}
                                    name={'delete'}
                                    checked={values.delete}    
                                    onChange={(event) => {
                                        setFieldValue(`delete`, event.target.checked)
                                    }}                            
                                    control={
                                        <Checkbox
                                            color="primary"
                                        
                                        />
                                    }
                                    />
                            </Stack>
                        </Box>
                        
                    <Button variant='contained' type="submit"  sx={{borderRadius: 15}}>
                        Save
                    </Button>
                    </Stack>
                    

                </Form>
                )}
                </Formik>
                    
                    </DialogContent>
                    }

            </Dialog>
        
        </>
    )
}