import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Alert, Box, CircularProgress, Select, Menu, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setSnackbar } from '../../reducers/user';
import { getAccessToken } from '../../auth/Auth';
import { useNavigate, useParams } from "react-router-dom";
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';


const validationSchema = Yup.object().shape({
  locationUrl: Yup.string(),
  companyLogo: Yup.mixed(),
});

const LocationForm = ({setLoading, loading}) => {

  const { checkPermission } = usePermission();
  const { cancelledSubscription } = useSubscription();
  const business = useSelector((state) => state.business);
  const settings = useSelector((state) => state.business.settings);
  const options = useSelector((state) => state.user.options);
  const permissionLevel = useSelector((state) => state.user.permissions);
  const [businessSelect, setBusiness] = useState(business._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [errors, setErrors] = useState(null);
  
  const handleSubmit = (values) => {
    if (!checkValidString(values.locationUrl)){
      setErrors('Public link cannot include special or spaces.');
      return;
    }
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
        setLoading(true);
      })
  };

  

  const checkValidString = (input) => {
    const pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(input);
  }

  const openWaitList = () => {
    const url = `https://waitonline.us/welcome/${business.publicLink}/waitlist`
    window.open(url, '_blank');
    return;
  };

  const navigateToWaitlist = () => {
    
    if (settings.present.waitlist === true) {
      openWaitList();
    }else {
      setErrors('Waitlist is not enabled.');
      return;
    }
}

  const initialValue = {
    locationUrl : business.publicLink,
    companyLogo: business.img
  }

  // Need to handle this change on the backend.
  // This will call refresh_index ...
  const handleBusinessChange = (e) => {
    setBusiness(e.target.value)
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
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
                { options ? (
                  <>
                  <FormControl fullWidth>
                    <InputLabel id="all-business">All business</InputLabel>
                    <Select
                      labelId="all-business"
                      id="all-business"
                      value={businessSelect}
                      label="Age"
                      onChange={handleBusinessChange}
                    >
                      {
                        options.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item._id}>
                              { item.businessName}
                            </MenuItem>
                          )
                        })
                      }
                    </Select>
                    </FormControl>
                  </>
                ): null}
                
            </Grid>
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
            <Button variant='outlined' size={'small'} onClick={() => navigateToWaitlist()} sx={{borderRadius: 10}}>
                Show waitlist
            </Button>
            </Grid>

            <Grid item xs={12}>              
            <Button disabled={ !checkPermission('LOC_URL') || cancelledSubscription()} variant='contained' size={'small'}  type="submit" sx={{borderRadius: 10}}>
                {loading ? <CircularProgress /> : 'Save'}
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
