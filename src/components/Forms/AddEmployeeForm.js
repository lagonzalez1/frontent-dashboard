import React, { useEffect, useState} from 'react';
import { TextField, Button, Grid, Stack, Checkbox, Typography, Card, Container, Box, CircularProgress, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, InputLabel, Tooltip, Alert, AlertTitle } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import {permissionLevel, requestEmployeeAdd, requestEmployeeChange, requestEmployeeEdit } from "../FormHelpers/AddNewEmployeeFormHelper";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setReload, setSnackbar } from '../../reducers/user';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { reloadBusinessData } from '../../hooks/hooks';



/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function AddEmployeeForm ({ employee, closeModal }) {

    const { checkPermission } = usePermission();
    const { checkSubscription } = useSubscription();
    const [permissionMessage, setPermissionMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
      if (checkPermission('EMPL_ADD') === false) {
        setPermissionMessage('User does not have permissions to add new employees.');
      }
    }, [])

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
        employeePassword: Yup.string().min(6).matches(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase letter, one number, and one special character'
        ),
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
        // Employee edit
        if (employee === null || employee === undefined) {
          const payload = {...values }
          requestEmployeeAdd(payload)
          .then(res => {
              dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
          })
          .catch(error => {
              dispatch(setSnackbar({requestMessage: error.response, requestStatus: true}))
          })
          .finally(() => {
              setLoading(false);
              closeModal()
              dispatch(setReload(true))

          })
        } else { // New request.
          const payload = {...values, originalUsername: employee ? employee.employeeUsername : '' }
          requestEmployeeEdit(payload)
          .then(res => {
              dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
          })
          .catch(error => {
              dispatch(setSnackbar({requestMessage: error.response.msg, requestStatus: true}))
          })
          .finally(() => {
              setLoading(false);
              closeModal();
              dispatch(setReload(true))
          })
        }
    }

    return (
    <Box sx={{ pt: 2}}>

        { /** Display permissions limitations */}
        { permissionMessage ? (
          <Alert color='info'>
            <AlertTitle>
                Permissions message
            </AlertTitle>
        { permissionMessage && permissionMessage }
      </Alert>) : null }

    {loading ? (
        <Container sx={{p: 3}}>
          <Stack direction={'column'} alignContent={'center'}>
            <CircularProgress />
            <Typography variant='caption' textAlign={'center'}>Saving your information...</Typography>
            </Stack>
        </Container>
    ) :  
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack spacing={1.5}>
                <Field
                  name="fullname"
                  as={TextField}
                  label="Employee Name"
                  variant="outlined"
                  error={touched.fullname && !!errors.fullname}
                  helperText={touched.fullname && errors.fullname}
                />
                <Field
                  name="employeeUsername"
                  label="Username"
                  as={TextField}
                  variant="outlined"
                  error={touched.employeeUsername && !!errors.employeeUsername}
                  helperText={touched.employeeUsername && errors.employeeUsername}
                />
                <Field
                  name="employeePassword"
                  label="Password"
                  as={TextField}
                  variant="outlined"
                  type="password"
                  error={touched.employeePassword && !!errors.employeePassword}
                  helperText={touched.employeePassword && errors.employeePassword}
                />
                

                <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant='subtitle2'><LockIcon fontSize='small' /> Permission levels</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack>
                    <Typography variant='caption'>Level 0: Root user, complete access to make changes.</Typography>
                    <Typography variant='caption'>Level 1: Allow user to edit, resources, services and all below.</Typography>
                    <Typography variant='caption'>Level 2: Allow user to create appointments and serve clients and all below.</Typography>
                    <Typography variant='caption'>Level 3: Allow user to serve clients.</Typography>
                  </Stack>
                </AccordionDetails>
            </Accordion>
              <InputLabel id="permissionLevel">Permission level</InputLabel>
              <Field 
                id="permissionLevel"
                name="permissionLevel"
                as={Select}
                error={touched.permissionLevel && !!errors.permissionLevel}
                helperText={touched.permissionLevel && errors.permissionLevel}
              >
                  {
                    permissionLevel.map((item, index) => {
                      return (
                            <MenuItem key={index} value={item.value}>
                              <Typography variant='body1' fontWeight={'bold'}>{item.title}</Typography>
                              <Typography variant='body1' fontWeight={'bold'}> - </Typography>
                              <Typography variant='body2'>{item.desc}</Typography>
                            </MenuItem>
                      )
                    })
                  }
                  
              </Field>

                <Typography variant='caption'>Select your availability.</Typography>
                <Grid container
                    sx={{ pt: 2}}
                    direction="row"
                    justifyContent="center"
                    spacing={1}>
                    
                    { WEEK.map((day, index) => {
                        return(
                            <>
                            <Grid key={index} item xs={6} md={4} lg={2}>
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
                                <Typography variant="caption" fontWeight={'bold'}>{day}</Typography>
                                </Card>
                            </Grid>
                            </>
                        )
                    })}
                </Grid>


              </Stack>
            </Grid>
            <Grid item xs={12}>
              
              <Button disabled={!checkPermission('EMPL_ADD')} sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
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