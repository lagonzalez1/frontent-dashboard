import React, { useState } from 'react';
import { Fab, Dialog, TextField, Button, Grid,FormHelperText,DialogContent, DialogActions, DialogTitle, Box, InputLabel, Select, MenuItem   } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import AddIcon from "@mui/icons-material/Add";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getServicesAvailable, addResource } from "./Helper";
import Success from '../Snackbar/Success';
import { setSnackbar } from '../../reducers/user';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  service_id: Yup.string(),
  description: Yup.string(),
  serveSize: Yup.number().required('Serve size is required'),
  active: Yup.boolean()
});

const initialValues = {
  title: '',
  service_id: '',
  description: '',
  serveSize: 1,
  active: false,
};

export default function AddResource() {
  const [isOpen, setIsOpen] = useState(false);
  const buisness = useSelector((state) => state.buisness);
  const dispatch = useDispatch();
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (values) => {
    addResource(values)
    .then(data => {
      dispatch(setSnackbar({requestMessage: data.msg, requestStatus: true}));
      handleClose();
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error, requestStatus: true}));
      console.log(error);
    })
    
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
      <Fab color="primary" onClick={handleOpen}>
        <AddIcon/>
      </Fab>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add a resource</DialogTitle>
        <DialogContent >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleBlur, handleChange }) => (
              <Form>
                <Grid sx={{ pt: 2}} container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      name="title"
                      as={TextField}
                      label="Title"
                      fullWidth
                      variant="outlined"
                      onChange={handleChange}
                      error={touched.title && !!errors.title}
                    />
                  </Grid>

                  <Grid item xs={12}>
                  {buisness ? (
                      <>
                          <InputLabel id="services">Services</InputLabel>
                          <Field
                          as={Select}
                          id="services"
                          name="service_id"
                          label="Service"
                          fullWidth
                          error={touched.service_id && !!errors.service_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          >
                          {getServicesAvailable().map((service) => (
                              <MenuItem key={service._id} value={service._id}>
                              {service.title}
                              </MenuItem>
                          ))}
                          </Field>
                      </>
                      ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="description"
                      as={TextField}
                      label="Description"
                      fullWidth
                      onChange={handleChange}
                      variant="outlined"
                      error={touched.description && !!errors.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="serveSize"
                      as={TextField}
                      label="Serve size"
                      type="number"
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      error={touched.serveSize && !!errors.serveSize}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="active"
                      type="checkbox"
                      as={TextField}
                      onChange={handleChange}
                      label="Set active"
                      fullWidth
                      error={touched.active && !!errors.active}
                    />
                  </Grid>
                  
                </Grid>
                <DialogActions>

                  <Button variant="contained" type="submit">Save</Button>

                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>


      
    </Box>
  );
};


