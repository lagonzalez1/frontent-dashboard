import React from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';


const validationSchema = Yup.object().shape({
  locationUrl: Yup.string(),
  companyLogo: Yup.mixed(),
});

const LocationForm = () => {

  const buisness = useSelector((state) => state.buisness);

  const handleSubmit = (values) => {
    console.log(values);
    // Perform further actions with the form values
  };

  const initialValue = {
    locationUrl : buisness.publicLink,
    companyLogo: buisness.img
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                name="locationUrl"
                as={TextField}
                label="Location URL"
                variant="outlined"
                fullWidth
                error={touched.locationUrl && !!errors.locationUrl}
                helperText={touched.locationUrl && errors.locationUrl}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue('companyLogo', event.currentTarget.files[0]);
                }}
              />
              {touched.companyLogo && errors.companyLogo && (
                <div style={{ color: 'red' }}>{errors.companyLogo}</div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="outlined" color="primary">
                Sync
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LocationForm;
