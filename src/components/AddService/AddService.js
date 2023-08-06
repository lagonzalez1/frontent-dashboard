import React, { useState } from 'react';
import {
  Fab,
  TextField,
  Button, Checkbox, 
  Dialog, Box, IconButton, DialogTitle, DialogContent, DialogActions, Select, InputLabel, MenuItem, Stack, FormLabel, Grid
} from '@mui/material';

import makeStyles from "@emotion/styled"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { submitService } from './Helper';
import { setReload, setSnackbar } from '../../reducers/user';

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
  description: Yup.string().required('Description is required'),
  duration: Yup.number().required('Duration is required'),
  cost: Yup.number(),
  public: Yup.boolean(),
  active: Yup.boolean(),
  employeeTag: Yup.string()
});

const AddService = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const employees = useSelector((state) => state.business.employees);
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    submitService(values)
    .then(response => {
        dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))

    })
    .finally(() => {
      dispatch(setReload(true))
    })
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
      <Fab color="primary" className={classes.fab} onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.modal}
        maxWidth={'xs'}
        fullWidth={true}
      >
        <DialogTitle>
            Add a service
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
              <Stack spacing={1}>
              <Field
                as={TextField}
                name="title"
                label="Title"
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
                fullWidth={true}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                error={touched.description && !!errors.description}
                helperText={<ErrorMessage name="description" />}
              />
              <Field
                as={TextField}
                name="duration"
                label="Duration"
                fullWidth={true}
                margin="normal"
                error={touched.duration && !!errors.duration}
                variant="outlined"
                helperText={<ErrorMessage name="duration" />}
              />
              <Field
                as={TextField}
                name="cost"
                label="Cost"
                fullWidth={true}
                error={touched.cost && !!errors.cost}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText={<ErrorMessage name="cost" />}
              />
              <InputLabel id="employeeTag">Attach employee?</InputLabel>
              <Field 
                as={Select} 
                id="employeeTag"
                name="employeeTag"
                handleChange={handleChange}
                fullWidth={true}
              >
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
            
              <Button fullWidth={true} variant="contained" type="submit">Submit</Button>
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
