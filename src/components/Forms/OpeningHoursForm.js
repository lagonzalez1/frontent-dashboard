import React, { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button,
   Stack, Typography, Dialog, DialogTitle, DialogContent, IconButton, DialogActions, TextField, Divider, Box, Container, Table, TableHead, TableCell, TableBody, CircularProgress, TableRow } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { TIMEZONES, validationSchemaSchedule, initialValuesSchedule, validationSchemaTimezone, requestTimezoneChange, requestScheduleChange, requestClosedDate, requestRemoveCloseDate } from "../FormHelpers/OpeningHoursHelper";
import { DateTime } from 'luxon';
import { setSnackbar } from '../../reducers/user';
import { getEmployeeList, reloadBusinessData } from '../../hooks/hooks';



const OpeningHoursForm = () => {

  const business = useSelector((state) => state.business);
  const closedDays = useSelector((state) => state.business.closedDates);
  const employeeList = getEmployeeList();

  const [employeeTag, setEmployeeTag] = useState();
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [closedDialog, setClosedDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const timzoneSubmit = (timezone) => {
    setLoading(true);
    console.log(timezone);
    if(business.timezone === timezone.timezone){
      dispatch(setSnackbar({requestMessage: 'No changes made.', requestStatus: true}));
      return;
    }
    requestTimezoneChange(timezone.timezone)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
    })
  
  };

  const scheduleSubmit = (schedule) => {
    setLoading(true);
    requestScheduleChange(schedule)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      closeScheduleDialog();
    })

  }

  const saveCloseDate = () => {
    if(!selectedDate){
      dispatch(setSnackbar({requestMessage: 'No date provided.', requestStatus: true}));
      return;
    }
    setLoading(true);
    requestClosedDate(selectedDate.toISO(), employeeTag)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
    })

  }

  const removeClosedDate = (dateId) => {
    setLoading(true);
    requestRemoveCloseDate(dateId)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      console.log("Error", error);
      dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
    })
  }

  const handleDateChange = (date) => {
      setSelectedDate(date);
  };

  const closeScheduleDialog = () => {
    setScheduleDialog(false);
  }
  const closeClosedDialog = () => {
    setClosedDialog(false);
    setSelectedDate(null);
  }

  useEffect(() => {
    reloadBusinessData(dispatch);
  }, [loading])
  

  const TimeInput = ({ label, name }) => {
    return (
      <>
        <Field
          name={name}
          render={({ field, meta }) => (
            <TextField
              {...field}
              label={label}
              variant="outlined"
              size="small"
              error={meta.touched && meta.error}
              helperText={meta.touched && meta.error}
            />
          )}
        />

      </>
    );
  };

  

  const FutureDatePicker = ({ label, value, onChange }) => {
    const currentDate = DateTime.local().setZone(business.timezone);

    return (
      <Box>
      <DatePicker
        label={label}
        value={value}
        sx={{ width: '100%'}}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
        minDate={currentDate}
      />
      </Box>
    );
  };

  return (
    <>
    <Formik
      initialValues={{ timezone: business.timezone }}
      validationSchema={validationSchemaTimezone}
      onSubmit={timzoneSubmit}
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
                  {
                    TIMEZONES.map((item) => {
                      return(
                        <MenuItem value={item}>{item}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              {touched.timezone && errors.timezone && (
                <div style={{ color: 'red' }}>{errors.timezone}</div>
              )}
                
            </Grid>
            <Grid item xs={12}>
              <Stack direction="column">
                {business.schedule &&
                    Object.entries(business.schedule).map(([key, value]) => {
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
                    <Button sx={{ borderRadius: 15}} onClick={() => setScheduleDialog(true)} fullWidth={false} variant="outlined" color="primary">
                      Set Opening Hours
                    </Button>
                    <Button sx={{ borderRadius: 15}} variant="outlined" onClick={() => setClosedDialog(true)} fullWidth={false}  color="primary">
                      Closed on Days
                    </Button>
                  
                    <Button type="submit" variant='contained' sx={{borderRadius: 15}}>
                      {loading ? <CircularProgress/> : 'save timezone'}
                    </Button>

                </Stack>
              
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>


      <Dialog
        open={scheduleDialog}
        onClose={closeScheduleDialog}
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeScheduleDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <strong>
                  Hours of operation
                </strong>

            </DialogTitle>
          {loading ? <CircularProgress /> :
          <DialogContent>
            <Divider />
            <Box sx={{textAlign: 'left'}}>
            <Typography variant='caption'>Any changes will reflect immediately.</Typography>
            <br/>
            <Typography variant='caption'>Submit your 
              time based on 24 hour time (Ex. 08:00~8AM, 18:00~6PM.)</Typography>

            <br/>
            <Divider />
            </Box>

          <Formik initialValues={initialValuesSchedule} validationSchema={validationSchemaSchedule} onSubmit={scheduleSubmit}>
            {({ }) => (
              <Form>
                <Stack spacing={1} columnGap={1}>
                <Box display={'flex'}>
                  <TimeInput label="Monday Start" name="Monday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>
                  <TimeInput label="Monday End" name="Monday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Tuesday Start" name="Tuesday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>
                  <TimeInput label="Tuesday End" name="Tuesday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Wednesday Start" name="Wednesday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>

                  <TimeInput label="Wednesday End" name="Wednesday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Thursday Start" name="Thursday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>

                  <TimeInput label="Thursday End" name="Thursday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Friday Start" name="Friday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>

                  <TimeInput label="Friday End" name="Friday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Saturday Start" name="Saturday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>

                  <TimeInput label="Saturday End" name="Saturday.end" />
                </Box>
                <Box display={'flex'}>
                  <TimeInput label="Sunday Start" name="Sunday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>

                  <TimeInput label="Sunday End" name="Sunday.end" />
                </Box>
                <DialogActions>
                  
                  <Button sx={{ borderRadius: 15}} type="submit" variant='contained' color="primary">
                    Save
                  </Button>
                </DialogActions>
                </Stack>
              </Form>
            )}
          </Formik>
          </DialogContent>
          }
      </Dialog>


      <Dialog
        open={closedDialog}
        onClose={closeClosedDialog}
        maxWidth={'xs'}
        fullWidth={'xs'}
      
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeClosedDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <strong>
                  Closed dates
                </strong>

            </DialogTitle>
          {loading ? <CircularProgress/> :

          <DialogContent>

              <Stack>
                  <Table size='small'>
                    { closedDays ? null : 
                    <TableHead>
                      <TableRow>
                      <TableCell>
                          #
                      </TableCell>
                      <TableCell>
                          Date off
                      </TableCell>
                      <TableCell>
                          Action
                      </TableCell>
                      </TableRow>
                    </TableHead>
                    }

                    <TableBody>
                      {closedDays ? closedDays.map((item, index) => {
                        return(
                          <TableRow>
                          
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                { DateTime.fromJSDate(new Date(item.date)).toLocaleString() }
                            </TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => removeClosedDate(item._id) }>
                                  delete
                                </Button>
                            </TableCell>
                          </TableRow>
                        )
                      }): null}
                    </TableBody>
                  </Table>
                  
                  <br/>
                  <FutureDatePicker label="Select a date you wish to be closed" value={selectedDate} onChange={handleDateChange} />
                  <InputLabel id="employeeTag">Attach employee?</InputLabel>
                  <Select 
                    id="employeeTag"
                    handleChange={(e) => setEmployeeTag(e.target.value)}
                    fullWidth={true}
                    size='small'
                  >
                    {employeeList.map((employee) => (
                      <MenuItem key={employee._id} value={employee._id}>
                        {employee.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                  

              </Stack>

          </DialogContent>
          }
          <DialogActions>
            <Button variant='contained' onClick={() => saveCloseDate()}>save</Button>
          </DialogActions>
        
      </Dialog>

    </>
  );
};

export default OpeningHoursForm;
