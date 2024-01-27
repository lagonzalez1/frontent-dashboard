import React, { memo, useState} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, 
  DialogContent, DialogTitle, Select, Menu, MenuItem, Grid, TextField, Stack, Checkbox, FormControl, FormControlLabel, Box} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { getEmployeeList, moveClientServing } from "../../hooks/hooks";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getCountries } from "../../pages/Register/RegisterHelper.js";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


const DAYOFWEEK = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}

const NewRegister = ({open, onClose}) => {

    const dispatch = useDispatch();
    const employeeList = getEmployeeList();
    const [employeeId, setEmployeeId] = useState('');

    const [user, setUser] = useState({country: ''})
    const [timeRange, setTimeRange] = useState({start: new Date(), end: new Date() })
    const [schedule, setSchedule] = useState({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    })

    const registerNewBusiness = () => {
        console.log("REgister")
    }

  
    const country_list = getCountries();

    const validationSchema = Yup.object().shape({
      businessName: Yup.string().required(),
      businessWebsite: Yup.string(),
      businessAddress: Yup.string(),
      businessPhone: Yup.string(),
      publicLink: Yup.string(),
      country: Yup.string(),
      timezone: Yup.string(),
      currentPlan: Yup.number(),
      schedule: Yup.object()
    });

    const initialValue = {
        businessName: '',
        businessWebsite: '',
        businessAddress: '',
        businessPhone: '',
        publicLink: '',
        country: '',
        schedule: {
          Monday: '',
          Tuesday: '',
          Wednesday: '',
          Thursday: '',
          Friday: '',
          Saturday: '',
          Sunday: '',
        },
        timezone: '',
        currentPlan: 0
    }

    const handleCheckboxChange = (day) => {
      console.log(day);
      const date = day[1];
      console.log(date);
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
          date: !prevSchedule[day] ,
      }));
    };


    const handleSubmit = (values) => {
      console.log(values);
    }


    {
      /**
       * 
       * Make this not closeable.
       */
    }
    return (
        <Dialog
        keepMounted
        id="servingClient"
        open={open}
        onClose={onClose}
        maxWidth={'md'}
        fullWidth={true}
        
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <Typography variant="h5" fontWeight={'bold'}>New Business </Typography>
            </DialogTitle>
                
            <DialogContent>
            <Typography variant="caption" fontWeight={'bold'}>Applying for a new business. </Typography>
            <Typography variant="caption" gutterBottom ><strong>Note: </strong> For a new business, you will recive a 15% discount that will be applied to each month. </Typography>

            <Formik
              initialValues={initialValue}
              validationShema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({errors, touched}) => (
                <Form>
                  <Grid container spacing={1}>
                        <Grid item xs>
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
                          <Typography variant="caption">Country</Typography>
                          <Select
                            labelId="Country-simple-select-label"
                            id="Country-simple-select"
                            label="Country"
                            variant="outlined"
                            fullWidth
                            name="country"
                            sx={{backgroundColor: '#F1f1f1'}}
                            onChange={e => setUser((prev) => ({...prev, country: e.target.value }))}
                        >
                            { country_list && Object.entries(country_list).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                        </Stack>
                        </Grid>
                        <Grid item xs>
                        <Typography variant="caption" fontWeight={'bold'}>Business type </Typography>
                        <Typography variant="caption">Dont worry, you can always update this once completed </Typography>
                        <Select
                            labelId="businessType"
                            id="businessType"
                            label="businessType"
                            variant="outlined"
                            fullWidth
                            name="country"
                            sx={{backgroundColor: '#F1f1f1'}}
                            onChange={e => setUser((prev) => ({...prev, country: e.target.value }))}
                        >
                            <MenuItem key={'key1'} value={0}>
                                {'Waitlist'}
                            </MenuItem>
                            <MenuItem key={'key2'} value={1}>
                                {'Waitlist + Appointment'}
                            </MenuItem>
                            <MenuItem key={'key3'} value={2}>
                                {'Appointment + Analytics'}
                            </MenuItem>
                        </Select>
                        <Typography variant="caption" fontWeight={'bold'}>Hours of operation </Typography>
                        <Typography variant="caption">Dont worry, on this step is completed you can specify start and close dates. </Typography>

                        <Stack sx={{pt: 1}} spacing={1} direction={'row'}>
                            <TimePicker label="start" />
                            <TimePicker label="end" />
                        </Stack>
                        <Typography variant="caption" fontWeight={'bold'}>Work days </Typography>
                        <Typography variant="caption"> days your business is available to the public. </Typography>
                        <Stack spacing={1} sx={{pt: 1}}>
                        { Object.entries(DAYOFWEEK).map((item, index) => {
                          return (
                            <Box>
                            <FormControlLabel
                            key={index}
                            label={DAYOFWEEK[++index]}
                            control={
                              <Checkbox
                                checked={schedule[DAYOFWEEK[++index]]}
                                onChange={() => handleCheckboxChange(item)}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />}
                            />
                            </Box> 
                          )
                        })}
                        </Stack>
                        </Grid>                        
                  </Grid>
                  </Form>
              )}
              </Formik>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
              <Button onClick={() => registerNewBusiness() } sx={{borderRadius: 10}} variant='contained' color='success'>Register</Button>
            </DialogActions>
        </Dialog>      
    )


}

export default memo(NewRegister);