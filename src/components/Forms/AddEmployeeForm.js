import React, { useEffect, useState} from 'react';
import { TextField, Button, Grid, Stack, Checkbox, Typography, Card, Container, Box, CircularProgress, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, InputLabel, Tooltip, Alert, AlertTitle, Avatar } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import {permissionLevel, requestEmployeeAdd, Transition, requestEmployeeEdit } from "../FormHelpers/AddNewEmployeeFormHelper";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setReload, setSnackbar } from '../../reducers/user';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { reloadBusinessData } from '../../hooks/hooks';
import { LoadingButton } from '@mui/lab';
import { getAccessToken, getStateData } from '../../auth/Auth';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';



/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function AddEmployeeForm ({ employee, closeModal, reload }) {

    const { checkPermission } = usePermission();
    const { checkSubscription } = useSubscription();
    const [permissionMessage, setPermissionMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);


    const dispatch = useDispatch();

    const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
      if (checkPermission('EMPL_ADD') === false) {
        setPermissionMessage('User does not have permissions to add new employees.');
        return;
      }
      setProfileImage(employee ? employee.image : null )
    }, []);


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
        // Handle new employee request.
        if (employee === null || employee === undefined) {
          const { user, business } = getStateData();
          const token = getAccessToken();
          const config = {
              headers : {
                  'X-Access-token': token,
                  'Content-type': 'multipart/form-data'
              }
          }
          const formData = new FormData();
          const flattenedJSON = JSON.stringify({...values});
          if (image !== null) {
            const file = dataURLtoBlob(image.image);
            formData.append('employee_image', file, image.name);
          }
          formData.append('b_id', business._id);
          formData.append('payload', flattenedJSON);
          formData.append('email', user.email);
          requestEmployeeAdd(formData, config)
          .then(res => {
              dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
              setLoading(false);
            })
          .catch(error => {
              dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
              setLoading(false);
            })
          .finally(() => {
              closeModal();
              reload();
          })
        } else { 
          // Handle the edit request.
          const { user, business } = getStateData();
          const token = getAccessToken();
          const config = {
              headers : {
                  'X-Access-token': token,
                  'Content-type': 'multipart/form-data'
              }
          }
          const formData = new FormData();
          // Get copy of original username
          const flattenedJSON = JSON.stringify({...values, originalUsername: employee.employeeUsername});
          if (image !== null) {
            const file = dataURLtoBlob(image.image);
            formData.append('employee_image_edit', file, image.name);
            formData.append('image_path', employee.image_path); // GET_REQUEST returns this image
          }
          formData.append('b_id', business._id);
          formData.append('payload', flattenedJSON);
          formData.append('email', user.email);
          requestEmployeeEdit(formData, config)
          .then(res => {
              dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
              setLoading(false);
            })
          .catch(error => {
              dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
              setLoading(false);
            })
          .finally(() => {
              closeModal();
              reload();
          })
        }
    }

    const onImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
          let reader = new FileReader();
          reader.onload = (e) => {
              setImage((prev) => ({
                  ...prev,
                  image: e.target.result,
                  name: event.target.files[0].name
              }))
          };
          reader.readAsDataURL(event.target.files[0]);
      }
  }
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
                <Box sx={{width: '100%', display: 'flex', justifyItems:'center', justifyContent: 'center'}}>
                 { image ? <Avatar variant="rounded" alt="Remy Sharp" src={image.image} sx={{ width: 75, height: 75 }} /> : 
                 <Avatar src={profileImage} variant="rounded" alt="Remy Sharp" sx={{ width: 75, height: 75 }} />}
                      
                </Box>
                <input
                    accept="image/*"
                    id="image-input-employee"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={onImageChange}
                />
                <label htmlFor="image-input-employee">
                  <Button
                  sx={{display: 'flex', justifyContent: 'center'}} 
                  component="span"
                  variant='text' color='secondary'>
                    Upload
                  </Button>
                </label>

                <Field
                  name="fullname"
                  as={TextField}
                  label="Employee Name"
                  variant="outlined"
                  color={'secondary'}
                  error={touched.fullname && !!errors.fullname}
                  helperText={touched.fullname && errors.fullname}
                />
                <Field
                  name="employeeUsername"
                  label="Username"
                  as={TextField}
                  variant="outlined"
                  color={'secondary'}
                  error={touched.employeeUsername && !!errors.employeeUsername}
                  helperText={touched.employeeUsername && errors.employeeUsername}
                />
                <Field
                  name="employeePassword"
                  label="Password"
                  as={TextField}
                  variant="outlined"
                  color={'secondary'}
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
                <Typography variant='subtitle1' fontWeight={'bold'}><VpnKeyRoundedIcon fontSize='small' /> Permission levels</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack>
                    <Typography variant='subtitle2'><strong>Level 0: </strong> Root user, complete access to make changes.</Typography>
                    <Typography variant='subtitle2'><strong>Level 1: </strong> Allow user to edit, resources, services and all below.</Typography>
                    <Typography variant='subtitle2'><strong>Level 2: </strong> Allow user to create appointments and serve clients and all below.</Typography>
                    <Typography variant='subtitle2'><strong>Level 3: </strong> Allow user to serve clients.</Typography>
                  </Stack>
                </AccordionDetails>
            </Accordion>
            <Typography variant='body1' fontWeight={'bold'}>Permission level</Typography>
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
                            <MenuItem key={index} value={item.value} color={'secondary'}
                            >
                              <Typography variant='body1' fontWeight={'bold'}>{item.title}</Typography>
                              <Typography variant='body1' fontWeight={'bold'}> - </Typography>
                              <Typography variant='body2'>{item.desc}</Typography>
                            </MenuItem>
                      )
                    })
                  }
                  
              </Field>

                <Typography variant='body1' fontWeight={'bold'}>Select your availability</Typography>
                <Grid container
                    sx={{ pt: 0}}
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
                                            color={'secondary'}
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
              <LoadingButton loading={loading} disabled={!checkPermission('EMPL_ADD')} sx={{ borderRadius: 7}} type="submit" variant="contained" color="primary">
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
    </Box>
    
    )
}