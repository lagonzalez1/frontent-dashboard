import React, {useState , useEffect} from "react";
import { Formik, Form, Field } from 'formik';

import { Typography, ListItem, ListItemText, List, ListItemButton, Dialog, DialogTitle, Checkbox,
    DialogContent, Stack, TextField, Button ,IconButton, DialogActions, Divider, Box, CircularProgress, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { validationSchemaService, validationSchemaResource, updateResource, updateService, requestRemoveService, requestRemoveResource } from "../FormHelpers/ResourceServiceFormHelper";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions";
import { LoadingButton } from "@mui/lab";
import { payloadAuth } from "../../selectors/requestSelectors";


export default function ResourceServiceForm ({ reloadPage }) {

    const { checkPermission } = usePermission();
    const [resourceDialog, setResourceDialog] = useState(false)
    const [servicesDialog, setServiceDialog] = useState(false);

    const [resourceId, setResourceId] = useState(null)
    const [serviceId, setServiceId] = useState(null)
    const [disable, disableDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const {id, bid, email} = useSelector((state) => payloadAuth(state));

    const dispatch = useDispatch();
    
    const resources = useSelector((state) => state.business.resources);
    const services = useSelector((state) => state.business.services);
    const [userSelected, setUserSelected] = useState(null);


    const closeResourceDialog = () => {
        setResourceDialog(false);
        setResourceId(null);
        setUserSelected(null);
    }
    const closeServiceDialog = () => {
        setServiceDialog(false);
        setServiceId(null);
        disableDelete(false);
        setUserSelected(null)
    }

    const openResourceDialog = (item) => {
        setResourceDialog(true);
        setResourceId(item._id);
        setUserSelected(item);
    }

    const openServiceDialog = (item) => {
        if(item.title === "default"){
            disableDelete(true);
        }
        setUserSelected(item)
        setServiceDialog(true);
        setServiceId(item._id)
    }

    const serviceSubmit = (value) => {
        if (value.delete === true) {
            setLoading(true)
            console.log(serviceId);
            const payload = { ...value, serviceId}
            requestRemoveService(payload, bid, email)
            .then(response => {
                dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
            })
            .catch(error => {
                dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
            })
            .finally(() => {
                closeServiceDialog();
                setLoading(false);
                reloadPage();
            })
            return;
        }
        setLoading(true)
        const payload = { ...value, serviceId}
        updateService(payload, bid, email )
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            closeServiceDialog();
            setLoading(false);
                reloadPage();
        })

    }
    const resourceSubmit = (value) => {
        if (value.delete === true) {
            const payload = { ...value, resourceId }
            setLoading(true);
            requestRemoveResource(payload, bid, email )
            .then(response => {
                dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
            })
            .catch(error => {
                dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
            })
            .finally(() => {
                closeResourceDialog();
                setLoading(false);
                reloadPage();
            })
            return;
        }
        const payload = { ...value, resourceId }
        setLoading(true);
        updateResource(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            closeResourceDialog();
            setLoading(false);
            reloadPage();
        })
    }

    const initialValuesServices = { 
        title: userSelected ? userSelected.title : '',
        duration: userSelected ? userSelected.duration: '',
        description: userSelected ? userSelected.description: '',
        cost: userSelected ? userSelected.cost: '',
        delete: false,
    }

    const initialValuesResources = { 
        title: userSelected ? userSelected.title : '',
        description: userSelected ? userSelected.description : '',
        duration: userSelected ? userSelected.duration : 0,
        size: userSelected ? userSelected.size: 0,
        delete: false
    }


    return (
        <>
            <Typography fontWeight='bold' variant="body2">
                    Resources
            </Typography>
            <List>
            {
                resources ? resources.map((item, index) => (
                    <ListItem disablePadding key={index}>
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
                services ? services.map((item, index) => (
                    <ListItem disablePadding key={index}>
                        <ListItemButton onClick={() => openServiceDialog(item) }>
                            <ListItemText primary={item.title} secondary={item.description} />
                        </ListItemButton>
                    </ListItem>
                    ))
            : null}
            </List>

            <Dialog
                id="resourceDialog"
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
                        <Stack sx={{pt: 1}} spacing={2}>
                            {disable ? (
                                <>
                                <TextField disabled={disable} label={'default'} variant="outlined" >
                                    <Typography>{'Default'}</Typography>
                                </TextField>
                                </>
                            ):
                            <Field
                                name="title"
                                as={TextField}
                                label="Title"
                                variant="outlined"
                                fullWidth
                                error={touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                            />
                            }
                            <Field
                                name="duration"
                                as={TextField}
                                label="Duration (in min)"
                                variant="outlined"
                                fullWidth
                                error={touched.duration && !!errors.duration}
                                helperText={touched.duration && errors.duration}
                            />
                            <Field
                                name="cost"
                                as={TextField}
                                label="Cost (USD)"
                                variant="outlined"
                                fullWidth
                                error={touched.cost && !!errors.cost}
                                helperText={touched.cost && errors.cost}
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
                            <Box sx={{ textAlign: 'left'}}>
                            <Stack direction="row" alignContent={'center'} alignItems={'center'}>

                                {
                                    disable ? (
                                    <>
                                    </>
                                    ):
                                        <>
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
                                        </>
                                        
                                }
                            </Stack>
                            
                            </Box>
                                
                        <Button disabled={!checkPermission('RESO_DEL', 'SERV_DEL')} variant='contained' type="submit" sx={{borderRadius: 5}}>
                            submit
                        </Button>
                        </Stack>
                        

                    </Form>
                    )}
                    </Formik>
                    </Box>
                        </DialogContent>
                        
                <DialogActions>
                    
                </DialogActions>
            </Dialog>


            <Dialog
                id="resourceDialog"
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
                    <Stack sx={{pt: 1}} spacing={2}>
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
                            name="size"
                            as={TextField}
                            label="Size"
                            variant="outlined"
                            fullWidth
                            error={touched.size && !!errors.size}
                            helperText={touched.size && errors.size}
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
                        
                    <LoadingButton loading={loading} disabled={!checkPermission('RESO_DEL', 'SERV_DEL')} variant='contained' type="submit" sx={{borderRadius: 5}}>
                        submit
                    </LoadingButton>
                    </Stack>
                    

                </Form>
                )}
                </Formik>
                    
                    </DialogContent>
                    

            </Dialog>
        
        </>
    )
}
