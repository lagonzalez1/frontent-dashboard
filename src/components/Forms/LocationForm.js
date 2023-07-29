import React, { useState } from 'react';
import { TextField, Button, Grid, Alert, Box, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setSnackbar } from '../../reducers/user';
import { getAccessToken } from '../../auth/Auth';


const validationSchema = Yup.object().shape({
  locationUrl: Yup.string(),
  companyLogo: Yup.mixed(),
});

const LocationForm = () => {

  const business = useSelector((state) => state.business);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (values) => {
    setLoading(true);
    axios.get('/api/internal/unique_link/'+ values.locationUrl )
      .then((response) => {
        if(response.status === 200){
          const accessToken = getAccessToken();
          const headers = { headers: { 'x-access-token': accessToken } };
          axios.put('/api/internal/update_location',{url: values.locationUrl, b_id: business._id}, headers)
          .then(response => {
            dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}))
          })
          .then(error => {
            setErrors(error);
          })
        }else {
          setErrors(response.data.msg);
        }
      })
      .catch((error) => {
          setErrors(error);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const initialValue = {
    locationUrl : business.publicLink,
    companyLogo: business.img
  }

  return (
    <>
    { errors ? (
      <Box>
        <Alert severity='error'>{errors}</Alert>
      </Box>
    ): null}

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
                disabled={true}
                onChange={(event) => {
                  setFieldValue('companyLogo', event.currentTarget.files[0]);
                }}
              />
              {touched.companyLogo && errors.companyLogo && (
                <div style={{ color: 'red' }}>{errors.companyLogo}</div>
              )}
            </Grid>
            <Grid item xs={12}>
              
            <Button variant='contained' type="submit" sx={{borderRadius: 15}}>
                {loading ? <CircularProgress color='white'/> : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
    </> 
  );
};

export default LocationForm;
