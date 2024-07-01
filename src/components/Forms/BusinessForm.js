import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken } from '../../auth/Auth';
import { setSnackbar } from '../../reducers/user';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { LoadingButton } from '@mui/lab';
import { payloadAuth } from '../../selectors/requestSelectors';

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required(),
  businessWebsite: Yup.string(),
  businessAddress: Yup.string(),
  businessPhone: Yup.string(),
  instagram: Yup.string(),
  twitter: Yup.string(),
  facebook: Yup.string(),
});

const BusinessForm = ({reloadPage}) => {
  
  const { checkPermission } = usePermission();
  const { cancelledSubscription } = useSubscription();

  
  const [loading, setLoading] = useState(false);
  const business = useSelector((state) => state.business);
  const user = useSelector((state) => state.user);
  const {id, bid, email} = useSelector((state) => payloadAuth(state));

  const dispatch = useDispatch();
  const [permissionMessage, setPermissionMessage] = useState(null);

  
  const handleSubmit = (values) => {
    setLoading(true);
    const payload = { ...values, b_id: bid, email}
    axios.put('/api/internal/update_business', payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      reloadPage();
    })
  };

  useEffect(() => {
    if (checkPermission('BUSI_FIELDS') === false) {
      setPermissionMessage('User does not have permissions to edit.');
      return;
    }
  }, [])

  const initialValue = {
    businessName: business ? business.businessName : "",
    businessWebsite: business ? business.businessWebsite: "",
    businessAddress: business ? business.businessAddress: "",
    businessPhone: business ? business.businessPhone: "",
    instagram: business ? business.social.instagram: "",
    twitter: business ? business.social.twitter: "",
    facebook: business ? business.social.facebook: ""
  }

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
                  name="businessName"
                  label="Business Name"
                  variant="outlined"
                  as={TextField}
                  defaultValue={initialValue.businessName}
                  fullWidth
                  error={touched.businessName && !!errors.businessName}
                  helperText={touched.businessName && errors.businessName}
                />
                <Field
                  name="businessWebsite"
                  label="Business Website"
                  variant="outlined"
                  as={TextField}
                  fullWidth
                  defaultValue={initialValue.businessWebsite}
                  error={touched.businessWebsite && !!errors.businessWebsite}
                  helperText={touched.businessWebsite && errors.businessWebsite}
                />
                <Field
                  name="businessAddress"
                  label="Business Address"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                  defaultValue={initialValue.businessAddress}
                  error={touched.businessAddress && !!errors.businessAddress}
                  helperText={touched.businessAddress && errors.businessAddress}
                />
                <Field
                  name="businessPhone"
                  label="Business Phone"
                  variant="outlined"
                  as={TextField}
                  fullWidth
                  defaultValue={initialValue.businessPhone}
                  error={touched.businessPhone && !!errors.businessPhone}
                  helperText={touched.businessPhone && errors.businessPhone}
                />
                <Field
                  name="twitter"
                  label="Twitter link"
                  variant="outlined"
                  as={TextField}
                  defaultValue={initialValue.twitter}
                  fullWidth
                  error={touched.twitter && !!errors.twitter}
                  helperText={touched.twitter && errors.twitter}
                  validate={(value) => {
                    if (!value) {
                      return;
                    }
                    const urlRegex = /^(https?:\/\/)?([\w-]+\.)*([\w-]+)\.[a-zA-Z]{2,}(\/[\w-]*)*(\/?|\/\w+\.[a-zA-Z]{2,})(\?\S*)?$/;
                    if (!urlRegex.test(value)) {
                      return 'Invalid URL';
                    }
                  }}
                />
                <Field
                  name="facebook"
                  label="Facebook link"
                  variant="outlined"
                  as={TextField}
                  defaultValue={initialValue.facebook}
                  fullWidth
                  error={touched.facebook && !!errors.facebook}
                  helperText={touched.facebook && errors.facebook}
                  validate={(value) => {
                    if (!value) {
                      return;
                    }
                    const urlRegex = /^(https?:\/\/)?([\w-]+\.)*([\w-]+)\.[a-zA-Z]{2,}(\/[\w-]*)*(\/?|\/\w+\.[a-zA-Z]{2,})(\?\S*)?$/;
                    if (!urlRegex.test(value)) {
                      return 'Invalid URL';
                    }
                  }}
                />
                <Field
                  name="instagram"
                  label="Instagram link"
                  variant="outlined"
                  as={TextField}
                  defaultValue={initialValue.instagram}
                  fullWidth
                  error={touched.instagram && !!errors.instagram}
                  helperText={touched.instagram && errors.instagram}
                  validate={(value) => {
                    if (!value) {
                      return;
                    }
                    const urlRegex = /^(https?:\/\/)?([\w-]+\.)*([\w-]+)\.[a-zA-Z]{2,}(\/[\w-]*)*(\/?|\/\w+\.[a-zA-Z]{2,})(\?\S*)?$/;
                    if (!urlRegex.test(value)) {
                      return 'Invalid URL';
                    }
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton loading={loading} disabled={!checkPermission('BUSI_INFO') || cancelledSubscription()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} type="submit" variant="contained" color="primary">
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BusinessForm;
