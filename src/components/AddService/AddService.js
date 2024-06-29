import React, { useState, useEffect } from 'react';
import {
  Fab,
  TextField,
  Button, Checkbox, 
  Dialog, Box, IconButton, DialogTitle, DialogContent, DialogActions, Select, InputLabel, MenuItem, Stack, FormLabel, Grid, Typography, Divider
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import makeStyles from "@emotion/styled"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { submitService, Transition } from './Helper';
import { setReload, setSnackbar } from '../../reducers/user';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().max(110).required('Description is required'),
  duration: Yup.number().required('Duration is required in minutes'),
  cost: Yup.number(),
  public: Yup.boolean(),
  active: Yup.boolean(),
  employeeTag: Yup.string()
});

const AddService = ({reloadParent}) => {
  const { checkPermission } = usePermission();
  const { cancelledSubscription } = useSubscription();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const employees = useSelector((state) => state.business.employees);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    setLoading(true)
    submitService(values)
    .then(response => {
        dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))

    })
    .finally(() => {
      handleClose();
      setLoading(false);
      reloadParent()
    })
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: '10px', right :'10px' } }>
      <Fab variant='extended' color="secondary" sx={{ color: 'white'}} className={classes.fab} onClick={handleOpen}>
        <AddIcon htmlColor="#FFFFFF"/>
        to Service
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.modal}
        maxWidth={'xs'}
        TransitionComponent={Transition}
        fullWidth={true}
      >
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

                <Typography variant='h5' fontWeight={'bold'}>Add a service</Typography>
        </DialogTitle>
            <Divider/>
        <DialogContent>
          <Formik
            initialValues={{
              title: '',
              description: '',
              duration: '',
              cost: '',
              employeeTag: '',
              public: false,
              active: false
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({handleChange ,touched, errors}) => (
              <Form>
              <Stack spacing={1} sx={{mt: 0}}>
              <Field
                as={TextField}
                name="title"
                label="Title"
                size="small"
                fullWidth={true}
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                error={touched.title && !!errors.title}
                helperText={<ErrorMessage name="title" />}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                size="small"
                fullWidth={true}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
                error={touched.description && !!errors.description}
                helperText={<ErrorMessage name="description" />}
              />
              <Field
                as={TextField}
                name="duration"
                size="small"
                label="Duration in (min)"
                fullWidth={true}
                margin="normal"
                type="number"
                error={touched.duration && !!errors.duration}
                variant="outlined"
                helperText={<ErrorMessage name="duration" />}
              />
              <Field
                as={TextField}
                name="cost"
                label="Cost $"
                size="small"
                fullWidth={true}
                error={touched.cost && !!errors.cost}
                onChange={handleChange}
                margin="normal"
                type="number"
                variant="outlined"
                helperText={<ErrorMessage name="cost" />}
              />
              <InputLabel id="employeeTag">Attach employee?</InputLabel>
              <Field 
                as={Select} 
                id="employeeTag"
                name="employeeTag"
                size="small"
                handleChange={handleChange}
                fullWidth={true}
              >
              <MenuItem key={'NONE'} value={''}>None</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.fullname}
                  </MenuItem>
                ))}
              </Field>

              <Grid container>
                <Grid item>
                  <FormLabel id="active">Set active ?</FormLabel>
                  <Field
                      id="active"
                      name="active"
                      type="checkbox"
                      as={Checkbox}
                      onChange={handleChange}
                      label="Set active"                      
                    />
                </Grid>
                <Grid item>
                  <FormLabel id="public">Set public?</FormLabel>
                  <Field
                    id="public"
                    name="public"
                    type="checkbox"
                    as={Checkbox}
                    onChange={handleChange}
                    label="Set public"             
                  />
                </Grid>
              </Grid>
            
              <LoadingButton loading={loading} disabled={!checkPermission('SERV_ADD') || cancelledSubscription()} sx={{borderRadius: 10}}  fullWidth={true} variant="contained" type="submit">Submit</LoadingButton>
              </Stack>
            </Form>
            )}

          </Formik>
          <DialogActions>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddService;
