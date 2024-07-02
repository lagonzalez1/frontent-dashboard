import React, { memo, useState} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, 
  DialogContent, DialogTitle, Select, Menu, MenuItem, Grid, TextField, Stack, Checkbox, FormControl, FormControlLabel, Box, InputLabel} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { getEmployeeList, moveClientServing } from "../../hooks/hooks";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getCountries } from "../../pages/Register/RegisterHelper.js";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from "formik";
import { HOURS_LIST } from "../../pages/Testing/RegisterTest.js";
import { payloadAuth } from "../../selectors/requestSelectors.js";

const DAYOFWEEK = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}

const NewRegister = ({open, onClose}) => {

    const dispatch = useDispatch();
    const employeeList = getEmployeeList();
    const [employeeId, setEmployeeId] = useState('');
    const [phoneNumber,setPhoneNumber] = useState(null);

    const [user, setUser] = useState({country: ''})
    const [timeRange, setTimeRange] = useState({start:'', end: '' })
    const hours = HOURS_LIST()
    
    const handleSubmit = (values) => {
      console.log(values);
      console.log(timeRange);
      // Check if timerange is correct and implement trial

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

    const initialValues = {
        businessName: '',
        businessWebsite: '',
        businessAddress: '',
        businessPhone: '',
        publicLink: '',
        country: '',
        schedule: {
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
        },
        timezone: '',
        currentPlan: 0
    }
    const handleCheckboxChange = (day) => {
      formik.setFieldValue(`schedule.${day}`, !formik.values.schedule[day]);
    };

    const handleChangeCountry = (value) => {
      formik.setFieldValue(`country`, value)
    }
    const handlePlanChange = (event) => {
      formik.setFieldValue(`currentPlan`, event.target.value);
    }

    const formatPhoneNumber = (input) => {
      const digits = input.replace(/\D/g, '');
      if (digits.length <= 3) {
          return digits;
          } else if (digits.length <= 6) {
          return `${digits.slice(0, 3)}-${digits.slice(3)}`;
          } else {
          return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
  }
  const phoneNumberChange = (event) => {
      const input = event.target.value;
      // Apply formatting to the input and update the state
      const phoneNumber = formatPhoneNumber(input);
      if (phoneNumber.length === 12) {
          formik.setFieldValue('businessPhone', phoneNumber);
      }
      setPhoneNumber(phoneNumber);
  }
    
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: handleSubmit
    })
  

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
          <form onSubmit={formik.handleSubmit}>

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

            
                  <Grid sx={{ pt: 1}} container spacing={1}>
                      <Grid item xs>
                      <Stack spacing={2}>
                        <TextField
                          name="businessName"
                          label="Business Name"
                          variant="outlined"
                          defaultValue={formik.values.businessName}
                          value={formik.values.businessName}
                          onChange={formik.handleChange}
                          fullWidth
                          error={formik.touched.businessName && !!formik.errors.businessName}
                        />
                        <TextField
                          name="businessWebsite"
                          label="Business Website"
                          variant="outlined"
                          fullWidth
                          onChange={formik.handleChange}
                          value={formik.values.businessWebsite}
                          defaultValue={formik.values.businessWebsite}
                          error={formik.touched.businessWebsite && !!formik.errors.businessWebsite}
                        />
                        <TextField
                          name="businessAddress"
                          label="Business Address"
                          variant="outlined"
                          fullWidth
                          onChange={formik.handleChange}
                          value={formik.values.businessAddress}
                          defaultValue={formik.values.businessAddress}
                          error={formik.touched.businessAddress && !!formik.errors.businessAddress}
                        />
                        <TextField
                          name="businessPhone"
                          label="Business Phone"
                          variant="outlined"
                          fullWidth
                          onChange={(event) => phoneNumberChange(event)}
                          value={phoneNumber}
                          defaultValue={formik.values.businessPhone}
                          error={formik.touched.businessPhone && !!formik.errors.businessPhone}
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
                              <MenuItem onChange={() => handleChangeCountry(value)}  key={key} value={key}>
                                  {value}
                              </MenuItem>
                          ))}
                      </Select>
                      <Typography variant="caption" gutterBottom><strong>Public link</strong> Enter a unique link.</Typography>

                      <TextField
                          name="publicLink"
                          label="Public link"
                          variant="outlined"
                          fullWidth
                          onChange={formik.handleChange}
                          value={formik.values.publicLink}
                          defaultValue={formik.values.publicLink}
                          error={formik.touched.publicLink && !!formik.errors.publicLink}
                        />

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
                          onChange={(e) => handlePlanChange(e)}
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
                      <FormControl fullWidth>
                          <InputLabel id="start_time_label">start</InputLabel>
                          <Select
                          labelId="start_time_label"
                          id="start_time"
                          variant="filled"
                          label="Start"
                          onChange={e => setTimeRange((prev) => ({...prev, start: e.target.value}))}
                          value={timeRange.start}
                          >
                          { hours && hours.map((item, index) =>(
                              <MenuItem key={index} value={item}>
                                  {DateTime.fromFormat(item,'hh:mm').setZone('local').toFormat('hh:mm a')}
                              </MenuItem>
                              ) )}
                          
                          </Select>
                          </FormControl>                          

                          <FormControl fullWidth>
                            <InputLabel id="end_time_label">end</InputLabel>
                            <Select
                                labelId="end_time_label"
                                id="end_time"
                                label="End"
                                variant="filled"
                                onChange={e => setTimeRange((prev) => ({...prev, end: e.target.value}))}
                                value={timeRange.end}

                            >
                            { hours && hours.map((item, index) =>(
                                <MenuItem key={index} value={item}>{DateTime.fromFormat(item,'hh:mm').setZone('local').toFormat('hh:mm a')}</MenuItem>
                            ) )}
                            </Select>
                        </FormControl>
                                                                                              
                      </Stack>
                      <Typography variant="caption" fontWeight={'bold'}>Work days </Typography>
                      <Typography variant="caption"> days your business is available to the public. </Typography>
                      <Stack spacing={1} sx={{pt: 1}}>
                      {Object.keys(formik.values.schedule).map((day, index) => (
                        <Box>
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                            checked={formik.values.schedule[day]}
                            onChange={() => handleCheckboxChange(day)}
                            name={`schedule.${day}`}
                            />
                          }
                          label={day}
                        />
                        </Box>
                      ))}
                      </Stack>
                      </Grid>                        
                  </Grid>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
              <Button type="submit" sx={{borderRadius: 10}} variant='contained' color='success'>Register</Button>
            </DialogActions>
            </form>

        </Dialog>      
    )


}

export default memo(NewRegister);