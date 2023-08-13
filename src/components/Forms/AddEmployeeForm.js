import React, { useEffect, useState} from 'react';
import { TextField, Button, Grid, Stack, Checkbox, Typography, Card, Container, Box, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import {requestEmployeeChange } from "../FormHelpers/AddNewEmployeeFormHelper";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken } from '../../auth/Auth';
import { setReload, setSnackbar } from '../../reducers/user';
import { StyledCardService } from '../../pages/Register/CardStyle';

import { useFormikContext } from 'formik';



/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function AddEmployeeForm({employee}) {

    const business = useSelector((state) => state.business);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        if (employee) {
            console.log(employee);
            console.log(employee.schedule.Friday);
        }
    }, [employee])

    let initialValues = { 
        fullname: employee ? employee.fullname: '',
        employeePassword: '',
        employeeUsername : employee ? employee.employeeUsername: '',
        permissionLevel: employee ? employee.permissionLevel: '',
        resourceTag: '',
        serviceTag: '',
        schedule: {
            Sunday: employee ? employee.schedule.Sunday: false,
            Monday: employee ? employee.schedule.Monday: false,
            Tuesday: employee ? employee.schedule.Tuesday: false,
            Wednesday: employee ? employee.schedule.Wednesday: false,
            Thursday: employee ? employee.schedule.Thursday: false,
            Friday: employee ? employee.schedule.Friday: false,
            Saturday: employee ? employee.schedule.Saturday: false,
        }
    }
    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required("First last name required."),
        employeeUsername: Yup.string().required("Username is required to login.").min(6),
        employeePassword: Yup.string().min(6),
        permissionLevel: Yup.number().required().max(3).min(0),
        resourceTag: Yup.string(),
        serviceTag: Yup.string(),
        schedule: Yup.object().shape({
          Sunday: Yup.boolean(),
          Monday: Yup.boolean(),
          Tuesday: Yup.boolean(),
          Wednesday: Yup.boolean(),
          Thursday: Yup.boolean(),
          Friday: Yup.boolean(),
          Saturday: Yup.boolean()
        })
      });



    // Two potential submits, EDIT and NEW
    const handleSubmit = (values) => {
        setLoading(true);
        const payload = {...values, originalUsername: employee.employeeUsername}
        requestEmployeeChange(payload)
        .then(res => {
            console.log(res);
            dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
            dispatch(setReload(true))
        })
    }
    
    return (
    <Box sx={{ pt: 2}}>
    {loading ? (
        <Container sx={{p: 2}}>
            <CircularProgress />
        </Container>
    ) :  
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Field
                  name="fullname"
                  as={TextField}
                  label="Employee Name"
                  variant="outlined"
                  fullWidth
                  error={touched.fullname && !!errors.fullname}
                  helperText={touched.fullname && errors.fullname}
                />
                <Field
                  name="employeeUsername"
                  as={TextField}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  error={touched.employeeUsername && !!errors.employeeUsername}
                  helperText={touched.employeeUsername && errors.employeeUsername}
                />
                <Field
                  name="employeePassword"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  error={touched.employeePassword && !!errors.employeePassword}
                  helperText={touched.employeePassword && errors.employeePassword}
                />
                <Box>
                <Stack>    
                <Typography variant='caption'>Level 0: Root user, complete access to make changes.</Typography>
                <Typography variant='caption'>Level 1: Allow user to edit, resources, services and all below.</Typography>
                <Typography variant='caption'>Level 2: Allow user to create appointments and serve clients and all below.</Typography>
                <Typography variant='caption'>Level 3: Allow user to serve clients.</Typography>
                </Stack>
                </Box>
                <Field
                  name="permissionLevel"
                  as={TextField}
                  label="Permission Level"
                  variant="outlined"
                  fullWidth
                  error={touched.permissionLevel && !!errors.permissionLevel}
                  helperText={touched.permissionLevel && errors.permissionLevel}
                />
                <Typography variant='caption'>Select your availability.</Typography>
                <Grid container
                    sx={{ pt: 2}}
                    direction="row"
                    justifyContent="center"
                    spacing={1}>
                    
                    { WEEK.map((day, index) => {
                        return(
                            <>
                            <Grid item xs={6} md={4} lg={2}>
                                <Card sx={{ p: 1, textAlign: 'center'}}>
                                <Field
                                    key={day}
                                    type="checkbox"
                                    as={Checkbox}
                                    name={`schedule.${day}`}
                                    checked={values.schedule[day]}
                                    onChange={(event) => {
                                        setFieldValue(`schedule.${day}`, event.target.checked)
                                    }}                                    
                                    control={
                                        <Checkbox
                                            color="primary"
                                        />
                                    }
                                    label={day}
                                    />
                                <Typography variant="caption" color="gray">{day}</Typography>
                                </Card>
                            </Grid>
                            </>
                        )
                    })}
                </Grid>


              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button sx={{ borderRadius: 15}} type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
    }
    </Box>
    
    )
}