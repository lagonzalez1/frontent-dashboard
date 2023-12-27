import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from '../../reducers/user';
import { requestNotificationChange } from "../FormHelpers/NotificationFormHelper";
import { usePermission } from '../../auth/Permissions';


const NotificationForm = ({setLoading, loading}) => {
  
  const { checkPermission } = usePermission();
  const business = useSelector((state) => state.business);
  const dispatch = useDispatch();
  
  const handleSubmit = (values) => {    
    requestNotificationChange(values)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(true);
    })
  };

  const initialValue = {
        title: business ? business.notifications.title : '',
        message: business ? business.notifications.message : '',
        minBefore: business ? business.notifications.minBefore : '',
  }

    const validationSchema = Yup.object().shape({
        title: Yup.string(),
        message: Yup.string(),
        minBefore: Yup.number().min(1, 'Must be greater than 0').max(60, 'Must be less than 60 min.').required()
    });

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Field
                  name="title"
                  as={TextField}
                  label="Title"
                  variant="outlined"
                  fullWidth
                  defaultValue={initialValue.title}
                  error={touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
                <Field
                  name="message"
                  label="Message"
                  variant="outlined"
                  as={TextField}
                  multiline={true}
                  rows={2}
                  fullWidth
                  defaultValue={initialValue.message}
                  error={touched.message && !!errors.message}
                  helperText={touched.message && errors.message}
                />
                <Field
                  name="minBefore"
                  label="Send notification before (in min)"
                  variant="outlined"
                  as={TextField}
                  fullWidth
                  defaultValue={initialValue.minBefore}
                  error={touched.minBefore && !!errors.minBefore}
                  helperText={touched.minBefore && errors.minBefore}
                />
                
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button disabled={!checkPermission('NOTI_SETTINGS')} sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationForm;
