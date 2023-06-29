import React from 'react';
import { TextField, Button, Grid, Stack } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object().shape({
  buisnessName: Yup.string(),
  buisnessWebsite: Yup.string(),
  buisnessAddress: Yup.string(),
  buisnessPhone: Yup.string()
});

const BusinessForm = () => {
  
  const buisness = useSelector((state) => state.buisness);

  const handleSubmit = (values) => {
    console.log(values);
    // Perform further actions with the form values
  };

  const initialValue = {
        buisnessName: buisness.buisnessName,
        buisnessWebsite: buisness.buisnessWebsite,
        buisnessAddress: buisness.buisnessAddress,
        buisnessPhone: buisness.buisnessPhone,
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
                  name="buisnessName"
                  as={TextField}
                  label="Business Name"
                  variant="outlined"
                  fullWidth
                  error={touched.buisnessName && !!errors.buisnessName}
                  helperText={touched.buisnessName && errors.buisnessName}
                />
                <Field
                  name="buisnessWebsite"
                  as={TextField}
                  label="Business Website"
                  variant="outlined"
                  fullWidth
                  error={touched.buisnessWebsite && !!errors.buisnessWebsite}
                  helperText={touched.buisnessWebsite && errors.buisnessWebsite}
                />
                <Field
                  name="buisnessAddress"
                  as={TextField}
                  label="Business Address"
                  variant="outlined"
                  fullWidth
                  error={touched.buisnessAddress && !!errors.buisnessAddress}
                  helperText={touched.buisnessAddress && errors.buisnessAddress}
                />
                <Field
                  name="buisnessPhone"
                  as={TextField}
                  label="Business Phone"
                  variant="outlined"
                  fullWidth
                  error={touched.buisnessPhone && !!errors.buisnessPhone}
                  helperText={touched.buisnessPhone && errors.buisnessPhone}
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
