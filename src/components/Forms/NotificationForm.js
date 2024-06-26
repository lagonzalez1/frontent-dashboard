import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from '../../reducers/user';
import { requestNotificationChange } from "../FormHelpers/NotificationFormHelper";
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { LoadingButton } from '@mui/lab';
import { payloadAuth } from '../../selectors/requestSelectors';

 // Working on all forms.


const NotificationForm = ({reloadPage}) => {
  
  const { checkPermission } = usePermission();
  const { cancelledSubscription } = useSubscription();
  const business = useSelector((state) => state.business);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {id, bid, email} = useSelector((state) => payloadAuth(state));

  const handleSubmit = (values) => {    
    setLoading(true)
    requestNotificationChange(values, bid, email)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      reloadPage();
    })
  };

  const initialValue = {
        title: business ? business.notifications.title : '',
        message: business ? business.notifications.message : '',
  }

  const validationSchema = Yup.object().shape({
      title: Yup.string(),
      message: Yup.string(),
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
                  rows={3}
                  fullWidth
                  defaultValue={initialValue.message}
                  error={touched.message && !!errors.message}
                  helperText={touched.message && errors.message}
                />
                
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton loading={loading} disabled={!checkPermission('NOTI_SETTINGS') || cancelledSubscription()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} type="submit" variant="contained" color="primary">
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationForm;
