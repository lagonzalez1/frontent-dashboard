import React, { useState } from 'react';
import { Fab, Dialog, TextField, Button, Grid,FormHelperText,DialogContent, DialogActions, DialogTitle, Box, InputLabel, Select, MenuItem, IconButton   } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import AddIcon from "@mui/icons-material/Add";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addResource } from "./Helper";
import { getServicesAvailable } from "../../hooks/hooks";
import Success from '../Snackbar/Success';
import { setSnackbar } from '../../reducers/user';
import { setBusiness} from "../../reducers/business";
import CloseIcon from "@mui/icons-material/Close"

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  service_id: Yup.string(),
  description: Yup.string(),
  serveSize: Yup.number().required('Serve size is required'),
  active: Yup.boolean(),
});

const initialValues = {
  title: '',
  service_id: '',
  description: '',
  serveSize: 1,
  active: false,
  public: false
};

export default function AddResource() {
  const [isOpen, setIsOpen] = useState(false);
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
    addResource(values)
    .then(data => {
      dispatch(setSnackbar({requestMessage: data.msg, requestStatus: true}));
      dispatch(setBusiness(data.business))
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
      <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>
          Add a resource
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
                      variant="outlined"
                      onChange={handleChange}
                      fullWidth={true}
                      error={touched.title && !!errors.title}
                    />
                  </Grid>

                  <Grid item xs={12}>
                  {business ? (
                      <>
                          <InputLabel id="services">Services</InputLabel>
                          <Field
                          as={Select}
                          id="services"
                          name="service_id"
                          label="Service"
                          fullWidth={true}
                          error={touched.service_id && !!errors.service_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          >
                          {Array.isArray(serviceList) ? serviceList.map((service) => (
                              <MenuItem key={service._id} value={service._id}>
                              {service.title}
                              </MenuItem>
                          )):console.log("Service list empty.")}
                          </Field>
                      </>
                      ) : null}
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="description"
                      as={TextField}
                      fullWidth={true}
                      label="Description"
                      onChange={handleChange}
                      variant="outlined"
                      error={touched.description && !!errors.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="serveSize"
                      as={TextField}
                      fullWidth={true}
                      label="Serve size"
                      type="number"
                      onChange={handleChange}
                      variant="outlined"
                      error={touched.serveSize && !!errors.serveSize}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="active"
                      type="checkbox"
                      as={TextField}
                      fullWidth={true}
                      onChange={handleChange}
                      label="Set active"
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


