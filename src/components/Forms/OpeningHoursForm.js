import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Stack, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object().shape({
  timezone: Yup.string().required('Timezone is required'),
});

const OpeningHoursForm = () => {

  const buisness = useSelector((state) => state.buisness);

  const handleSubmit = (values) => {
    console.log(values);

  };

  return (


    
    <Formik
      initialValues={{ timezone: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, handleChange}) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth error={touched.timezone && !!errors.timezone}>
                <InputLabel id="timezone-label">Timezone</InputLabel>
                <Select
                  labelId="timezone-label"
                  name="timezone"
                  label="Timezone"
                  value={values.timezone}
                  onChange={handleChange}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="PST">PST</MenuItem>
                  <MenuItem value="EST">EST</MenuItem>
                </Select>
              </FormControl>
              {touched.timezone && errors.timezone && (
                <div style={{ color: 'red' }}>{errors.timezone}</div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack direction="column">
                {buisness.schedule &&
                    Object.entries(buisness.schedule).map(([key, value]) => {
                      if(key === '_id') { return; }
                      if (!value.start || !value.end) {
                        return (
                          <Typography key={key}>
                            <strong>{key}</strong>: {'Off'}
                          </Typography>
                        );
                      }
                      return (
                        <Typography key={key}>
                          <strong>{key}</strong>: {value.start + ' - ' + value.end}
                        </Typography>
                      );
                    })}
              </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={1}>
                    <Button type="submit" fullWidth={false} variant="outlined" color="primary">
                    Set Opening Hours
                    </Button>
                    <Button variant="outlined" fullWidth={false}  color="primary">
                    Closed on Days
                    </Button>
                </Stack>
              
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default OpeningHoursForm;
