import React, { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button,
   Stack, Typography, Dialog, DialogTitle, DialogContent, IconButton, DialogActions, TextField, Divider, Box, Container, Table, TableHead, TableCell, TableBody, CircularProgress, TableRow, Switch, FormControlLabel, Grow, Collapse, Alert, alertClasses, TableContainer } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from 'yup';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
//import { DatePicker } from '@mui/x-date-pickers';

import { useDispatch, useSelector } from 'react-redux';
import { TIMEZONES, validationSchemaSchedule, validationSchemaTimezone, 
  requestTimezoneChange, requestScheduleChange, requestClosedDate, requestRemoveCloseDate,validateTimerange, DAYOFWEEK, Transition } from "../FormHelpers/OpeningHoursHelper";
import { DateTime } from 'luxon';
import { setSnackbar } from '../../reducers/user';
import {  findEmployee, getEmployeeList } from '../../hooks/hooks';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { LoadingButton } from '@mui/lab';
import { BellZ, CheckSquare, ClockCounterClockwise } from 'phosphor-react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';




const OpeningHoursForm = ({reloadPage}) => {

  const { checkPermission, canEmployeeEdit } = usePermission();
  const { cancelledSubscription } = useSubscription();
  const business = useSelector((state) => state.business);
  const schedule = useSelector((state) => state.business.schedule);
  const closedDays = useSelector((state) => state.business.closedDates);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [timerange, setTimerange] = React.useState(() => [
    DateTime.local(),
    DateTime.local(),
  ]);
  const employeeList = getEmployeeList();

  const [scheduledDaysOff, setScheduledDaysOff] = useState(false);
  const [tableLoader, setScheduleTableLoader] = useState(false);
  const [employeeTag, setEmployeeTag] = useState('');
  const [partialDay, setPartialDay] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [closedDialog, setClosedDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [closeDateLoader,setCloseDateLoader] = useState(false);

  const dispatch = useDispatch();


  const timzoneSubmit = (timezone) => {
    setLoading(true);
    if(business.timezone === timezone.timezone){
      dispatch(setSnackbar({requestMessage: 'No changes made.', requestStatus: true}));
      setLoading(false);
      return;
    }
    requestTimezoneChange(timezone.timezone)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      reloadPage()
    })
  
  };

  const scheduleSubmit = (schedule) => {
    setLoading(true);
    requestScheduleChange(schedule)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      closeScheduleDialog();
      reloadPage()
    })

  }

  const closeScheduleTable = () => {
    setScheduledDaysOff(false);
  }

  const handleEmployeeChange = (event) => {
    setEmployeeTag(event.target.value)
  }

  const setPartialDayPretense = (e) => {
    setPartialDay(e.target.checked);
  }

  const saveCloseDate = () => {
    let start = null;
    let end = null;
    if(!selectedDate){
      dispatch(setSnackbar({requestMessage: 'No date provided.', requestStatus: true}));
      return;
    }
    if (partialDay) {
      start = timerange[0].toFormat("HH:mm");
      end = timerange[1].toFormat("HH:mm");
      const isValidRange = validateTimerange(selectedDate, start, end, schedule);
      if (!isValidRange) {
        setMessage('Invalid timerange, must be within business start and end time.');
        return;
      }
    }
    setCloseDateLoader(true);
    requestClosedDate(selectedDate.toISO(), employeeTag, start, end)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setCloseDateLoader(false);
      closeClosedDialog();
      reloadPage()
    })

  }

  const removeClosedDate = (dateId) => {
    setScheduleTableLoader(true);
    requestRemoveCloseDate(dateId)
    .then(response => {
      dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}));
    })
    .catch(error => {
      console.log("Error", error);
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setScheduleTableLoader(false);
      closeScheduleTable();
      reloadPage();
    })
  }

  const handleDateChange = (date) => {
      setSelectedDate(date);
      const selectedDayOfWeek = date.weekday;
      const key = DAYOFWEEK[selectedDayOfWeek];
      const scheduledStart = DateTime.fromFormat(schedule[key].start, 'HH:mm');
      const scheduledEnd = DateTime.fromFormat(schedule[key].end, 'HH:mm');
      setTimerange(() => ([schedule[key].start ? scheduledStart: null, schedule[key].end ? scheduledEnd: null]));
  };

  const closeScheduleDialog = () => {
    setScheduleDialog(false);
  }
  const closeClosedDialog = () => {
    setClosedDialog(false);
    setSelectedDate(null);
    setPartialDay(false);
    setMessage(null); 
  }

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
      <DesktopDatePicker
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


  const initialValuesSchedule = {
    ...schedule
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
                          <strong>{key}</strong>: {DateTime.fromFormat(value.start, 'HH:mm').toFormat('h:mm a') + ' - ' + DateTime.fromFormat(value.end, 'HH:mm').toFormat('h:mm a')}
                        </Typography>
                      );
                    })}
              </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={1}>
                    <Button endIcon={<ClockCounterClockwise size={17} />} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} onClick={() => setScheduleDialog(true)} fullWidth={false} variant="outlined" color="primary">
                      Set Opening Hours
                    </Button>
                    <Button endIcon={<BellZ size={17} />} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="outlined" onClick={() => setClosedDialog(true)} fullWidth={false} color="primary">
                      Call off
                    </Button>

                    <Button endIcon={<CheckSquare size={17}/>} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="outlined" onClick={() => setScheduledDaysOff(true)} color={'primary'}>
                      scheduled days off
                    </Button>
                  
                    <LoadingButton disabled={!checkPermission('HOUR_TZ')} loading={loading} type="submit" variant='contained' sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}}>
                      {'save timezone'}
                    </LoadingButton>

                </Stack>
              
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>


        <Dialog
          id="scheduelDialog"
          open={scheduleDialog}
          onClose={closeScheduleDialog}
          TransitionComponent={Transition}
          keepMounted={true}
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
                <Typography fontWeight={'bold'} variant='h6'>
                  Hours of operation
                </Typography>

            </DialogTitle>
            <DialogContent>
            <Divider />
            <Box sx={{textAlign: 'left'}}>
            <Typography variant='subtitle2' gutterBottom>Timerange will be used to open and close your external waitlist request.</Typography>
            <Typography variant='subtitle2'><u>important</u> submit your 
              time based on 24 hour time <strong> (Ex. 08:00~8AM, 18:00~6PM.)</strong></Typography>
            <br/>
              <Divider />
            </Box>

          <Formik initialValues={initialValuesSchedule} validationSchema={validationSchemaSchedule} onSubmit={scheduleSubmit}>
            {({ }) => (
              <Form>
                <Stack spacing={1} columnGap={1}>
                <Box display={'flex'}>
                  <TimeInput fullWidth label="Monday Start" name="Monday.start" />
                  <Divider orientation='vertical' flexItem>-</Divider>
                  <TimeInput fullWidth label="Monday End" name="Monday.end" />
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
                  
                  <LoadingButton disabled={!checkPermission('HOUR_OPEN_HR') || cancelledSubscription() } sx={{ borderRadius: 10}} type="submit" variant='contained' color="primary">
                    Submit
                  </LoadingButton>
                </DialogActions>
                </Stack>
              </Form>
            )}
          </Formik>
          </DialogContent>
      </Dialog>


      <Dialog
        id="closedOnDates"
        open={closedDialog}
        TransitionComponent={Transition}
        onClose={closeClosedDialog}
        maxWidth={'sm'}
        fullWidth={'sm'}
      
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
                  Call off
                </strong>

            </DialogTitle>
            <DialogContent>
              
            <Collapse in={message ? true: false}>
                <Alert
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setMessage(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                {message}
                </Alert>
            </Collapse>
                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs>
                    <Box>
                    <Typography variant='subtitle2' fontWeight={'bold'} gutterBottom>When will you be off?</Typography>
                    <FutureDatePicker label="Date" value={selectedDate} onChange={handleDateChange} />
                      {
                        selectedDate && <FormControlLabel 
                        control={<Switch
                          color="warning"
                          disabled={timerange[0] === null ? true: false}
                          checked={partialDay}
                          onChange={(e) => setPartialDayPretense(e) }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                            }
                        label="Partial day?"
                        />
                  }
                    </Box>
                  </Grid>

                  <Grid item xs>
                    <Box>
                    <Typography variant='subtitle2' fontWeight={'bold'}>Employee call off?</Typography>
                      <Select 
                        sx={{ pt: 1}}
                        id="employeeTag"
                        variant='standard'
                        size='medium'
                        value={employeeTag}
                        onChange={handleEmployeeChange}
                        fullWidth={true}
                      >
                        <MenuItem key={'None'} value={''}>
                            <Typography variant='body2'>None</Typography>
                          </MenuItem>
                        {employeeList && employeeList.map((employee, index) => (
                          <MenuItem key={index} disabled={!canEmployeeEdit(employee._id, 'HOUR_CLOSE_DEL')} value={employee._id}>
                            <Typography variant='body2'>{employee.fullname}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                        {
                        partialDay ? (
                          <Grow in={partialDay}>
                            <Box sx={{ pt: 1.5}}>
                              <SingleInputTimeRangeField 
                                label="Start and end"
                                value={timerange}
                                variant='standard'
                                fullWidth={true}
                                disabled={timerange[0] === null ? true: false}
                                onChange={(newValue) => setTimerange(newValue)}
                                />
                              <br/>
                            <Typography variant='caption' gutterBottom>Enter the time range you <strong>will</strong> be available.</Typography>

                            </Box>
                          </Grow>
                        ):
                        null
                      }
                    </Box>
                  </Grid>
                </Grid>

                
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={closeDateLoader} disabled={!canEmployeeEdit(employeeTag, 'EMPL_ATTACH')} sx={{ borderRadius: 5}} variant='contained' onClick={() => saveCloseDate()}>save</LoadingButton>
          </DialogActions>
        
      </Dialog>


      <Dialog
        open={scheduledDaysOff}
        onClose={closeScheduleTable}
        TransitionComponent={Transition}
        id="scheduledDaysOff"
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeScheduleTable}
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
                  Scheduled days off
                </strong>

            </DialogTitle>
        <DialogContent>
        <TableContainer style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <Table size='small'>
              { closedDays ?
              <TableHead>
                <TableRow>
                <TableCell>
                    #
                </TableCell>
                <TableCell>
                    Date
                </TableCell>
                <TableCell>
                  Employee
                </TableCell>
                <TableCell>
                    Action
                </TableCell>
                </TableRow>
              </TableHead>
              : null
              }

              <TableBody>
                {closedDays ? closedDays.map((item, index) => {
                  return(
                    <TableRow>
                    
                      <TableCell>
                          {index + 1}
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption'>
                          { DateTime.fromJSDate(new Date(item.date)).toLocaleString() }
                          <br/>
                          {
                          item.range.start ? (
                            <>
                              { DateTime.fromFormat(item.range.start, 'HH:mm').toFormat('hh:mm a') + " - " +  DateTime.fromFormat(item.range.end, 'HH:mm').toFormat('hh:mm a') }
                            </>
                          ) : 'Fullday'
                        }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption'>
                          { findEmployee(item.employeeTag).fullname }
                        </Typography>
                      </TableCell>
                      <TableCell>
                          <LoadingButton loading={tableLoader} disabled={ !canEmployeeEdit(item.employeeTag, 'HOUR_CLOSE_DEL')} size="small" onClick={() => removeClosedDate(item._id) }>
                            delete
                          </LoadingButton>
                      </TableCell>
                    </TableRow>
                  )
                }): null}
              </TableBody>
            </Table>
        </TableContainer>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default OpeningHoursForm;
