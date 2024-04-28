import React, { useEffect, useState } from 'react';
import { Fab, Dialog, TextField, Button, Grid,FormHelperText,DialogContent, DialogActions, DialogTitle, Box, InputLabel, Select, MenuItem, IconButton, Stack, Divider, Typography, Checkbox, FormLabel   } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from 'react-redux';
import { addResource, Transition } from "./Helper";
import { getServicesAvailable, reloadBusinessData } from "../../hooks/hooks";
import Success from '../Snackbar/Success';
import { setReload, setSnackbar } from '../../reducers/user';
import CloseIcon from "@mui/icons-material/Close"
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import LoadingButton from '@mui/lab/LoadingButton';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(20),
  service_id: Yup.string(),
  description: Yup.string().max(110).required(),
  serveSize: Yup.number().required('Serve size is required').min(0).max(50),
  active: Yup.boolean(),
  publicValue:  Yup.boolean(),
});


export default function AddResource({reloadParent}) {
  const { checkPermission } = usePermission();
  const { cancelledSubscription } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const business = useSelector((state) => state.business);
  const serviceList = getServicesAvailable();
  const dispatch = useDispatch();


  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (values) => {
    try {
      console.log(values)
      setLoading(true);
      addResource(values)
      .then(data => {
        dispatch(setSnackbar({requestMessage: data.msg, requestStatus: true}));
        handleClose();
      })
      .catch(error => {
        dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
      })
      .finally(() => {
        setLoading(false);
        handleClose();
        reloadParent(); // Reload parent page
      })
    }
    catch(error) {
      console.log(error);
    }
    
  };


  
  const TextFieldEdit = () => { return <TextField multiline={true} rows={3} label="Description" />}

  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
      <Fab color="secondary" onClick={handleOpen}>
        <AddIcon/>
      </Fab>
      <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth="xs" TransitionComponent={Transition}>
        <DialogTitle>
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
                <Typography variant='h5' fontWeight={'bold'}>Add a resource</Typography>

        </DialogTitle>
        <Divider />
        <DialogContent>
          <Formik
            initialValues={{
              title: '',
              service_id: '',
              description: '',
              serveSize: 1,
              active: false,
              publicValue: false
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({errors, touched, handleBlur, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={1.5}>
                    <Field
                      name="title"
                      as={TextField}
                      label="Title"
                      size="small"
                      variant="outlined"
                      onChange={handleChange}
                      fullWidth={true}
                      error={touched.title && !!errors.title}
                    />           
                  {business ? (
                      <>
                          <InputLabel id="services" sx={{fontWeight: 'bold'}}>Attach service? </InputLabel>
                          <Field
                          as={Select}
                          id="services"
                          name="service_id"
                          label="services"
                          size="small"
                          fullWidth={true}
                          error={touched.service_id && !!errors.service_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          >
                          <MenuItem key={'NONE'} value={''}>None</MenuItem>
                          {Array.isArray(serviceList) ? serviceList.map((service) => (
                              <MenuItem key={service._id} value={service._id}>
                              {service.title}
                              </MenuItem>
                          )):console.log("Service list empty.")}
                          </Field>
                      </>
                      ) : null}
                
                    <Field
                      name="description"
                      label="Description"
                      as={TextField}
                      multiline={true}
                      rows={3}
                      fullWidth={true}
                      size="small"  
                      onChange={handleChange}
                      variant="outlined"
                      error={touched.description && !!errors.description}
                    />
                    <Field
                      name="serveSize"
                      size="small"
                      as={TextField}
                      fullWidth={true}
                      label="Serve size"
                      type="number"
                      onChange={handleChange}
                      variant="outlined"
                      error={touched.serveSize && !!errors.serveSize}
                    />
                    <Grid container>
                      <Grid item>
                    <FormLabel id="active">Set active ?</FormLabel>
                    <Field
                      id="active"
                      name="active"
                      type="checkbox"
                      as={Checkbox}
                      fullWidth={true}
                      onChange={handleChange}
                      label="Set active"
                      error={touched.active && !!errors.active}
                    />
                    </Grid>
                    <Grid item>
                    <FormLabel id="publicValue">Set public ?</FormLabel>
                    <Field
                      id="publicValue"
                      name="publicValue"
                      type="checkbox"
                      as={Checkbox}
                      fullWidth={true}
                      onChange={handleChange}
                      label="Set public"
                      error={touched.publicValue && !!errors.publicValue}
                    /> 
                    </Grid>
                    </Grid>
                    <LoadingButton loading={loading} disabled={!checkPermission('RESO_ADD') || cancelledSubscription() } sx={{ borderRadius: 10}} variant="contained" type="submit">submit</LoadingButton>

                  </Stack>
                <DialogActions>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>


      
    </Box>
  );
};


