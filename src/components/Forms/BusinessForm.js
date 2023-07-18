import React from 'react';
import { TextField, Button, Grid, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object().shape({
  businessName: Yup.string(),
  businessWebsite: Yup.string(),
  businessAddress: Yup.string(),
  businessPhone: Yup.string()
});

const BusinessForm = () => {
  
  const business = useSelector((state) => state.business);

  const handleSubmit = (values) => {
    console.log(values);
    // Perform further actions with the form values
  };

  const initialValue = {
        businessName: business.businessName,
        businessWebsite: business.businessWebsite,
        businessAddress: business.businessAddress,
        businessPhone: business.businessPhone,
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
                  as={TextField}
                  label="Business Name"
                  variant="outlined"
                  fullWidth
                  error={touched.businessName && !!errors.businessName}
                  helperText={touched.businessName && errors.businessName}
                />
                <Field
                  name="businessWebsite"
                  as={TextField}
                  label="Business Website"
                  variant="outlined"
                  fullWidth
                  error={touched.businessWebsite && !!errors.businessWebsite}
                  helperText={touched.businessWebsite && errors.businessWebsite}
                />
                <Field
                  name="businessAddress"
                  as={TextField}
                  label="Business Address"
                  variant="outlined"
                  fullWidth
                  error={touched.businessAddress && !!errors.businessAddress}
                  helperText={touched.businessAddress && errors.businessAddress}
                />
                <Field
                  name="businessPhone"
                  as={TextField}
                  label="Business Phone"
                  variant="outlined"
                  fullWidth
                  error={touched.businessPhone && !!errors.businessPhone}
                  helperText={touched.businessPhone && errors.businessPhone}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="outlined" color="primary">
                sync
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BusinessForm;
