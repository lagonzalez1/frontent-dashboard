import React, { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button,
   Stack, Typography, Dialog, DialogTitle, DialogContent, IconButton, DialogActions, TextField, Divider, Box, Container, Table, TableHead, TableCell, TableBody, CircularProgress, TableRow, Switch, FormControlLabel, Grow, Collapse, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from 'yup';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { DatePicker } from '@mui/x-date-pickers';

import { useDispatch, useSelector } from 'react-redux';
import { TIMEZONES, validationSchemaSchedule, validationSchemaTimezone, 
  requestTimezoneChange, requestScheduleChange, requestClosedDate, requestRemoveCloseDate,validateTimerange, DAYOFWEEK } from "../FormHelpers/OpeningHoursHelper";
import { DateTime } from 'luxon';
import { setSnackbar } from '../../reducers/user';
import { getEmployeeList, reloadBusinessData } from '../../hooks/hooks';



const OpeningHoursForm = () => {

  const business = useSelector((state) => state.business);
  const schedule = useSelector((state) => state.business.schedule);
  const closedDays = useSelector((state) => state.business.closedDates);
  const [message, setMessage] = useState(null);
  const [timerange, setTimerange] = React.useState(() => [
    DateTime.local(),
    DateTime.local(),
  ]);
  const employeeList = getEmployeeList();

  const [employeeTag, setEmployeeTag] = useState();
  const [partialDay, setPartialDay] = useState(false);
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
      console.log("IsValidRange: ", isValidRange);
      if (!isValidRange) {
        setMessage('Invalid timerange, must be within business start and end time.');
        return;
      }
    }
    
    setLoading(true);
    requestClosedDate(selectedDate.toISO(), employeeTag, start, end)
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
      const selectedDayOfWeek = date.weekday;
      const key = DAYOFWEEK[selectedDayOfWeek];
      const scheduledStart = DateTime.fromFormat(schedule[key].start, 'HH:mm');
      const scheduledEnd = DateTime.fromFormat(schedule[key].end, 'HH:mm');
      setTimerange(() => ([scheduledStart, scheduledEnd]));
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
        id="scheduelDialog"
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
          {loading ? <DialogContent>
            <CircularProgress /> 
          </DialogContent>:
          <DialogContent>
            <Divider />
            <Box sx={{textAlign: 'left', pb: 1}}>
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
                  
                  <Button sx={{ borderRadius: 10}} type="submit" variant='contained' color="primary">
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
                  Closed dates
                </strong>

            </DialogTitle>
          {loading ? <DialogContent>
            <CircularProgress/>
          </DialogContent> :

          <DialogContent>
            {
              // Future update: Change this to be side by side.
              // Table next to the fields.
            }
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

              <Grid container spacing={1} rowSpacing={1} sx={{ pt: 1}}>
                  <Grid item xs>
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
                          Range
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
                                {
                                  item.range.start !== null ? (
                                    <>
                                      { DateTime.fromFormat(item.range.start,"HH:mm").toFormat('hh:mm').toString() - DateTime.fromFormat(item.range.end,"HH:mm").toFormat('hh:mm').toString() }
                                    </>
                                  ) : 'Fullday'
                                }
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
                  </Grid>


                  <Grid item xs>
                    <Stack spacing={1}> 
                      <FutureDatePicker label="Close on this date" value={selectedDate} onChange={handleDateChange} />
                      <InputLabel id="employeeTag">Attach employee?</InputLabel>
                      <Select 
                        sx={{ pt: 1}}
                        id="employeeTag"
                        size="small"
                        handleChange={(e) => setEmployeeTag(e.target.value)}
                        fullWidth={true}
                      >
                        {employeeList.map((employee) => (
                          <MenuItem key={employee._id} value={employee._id}>
                            {employee.fullname}
                          </MenuItem>
                        ))}
                      </Select>
                      {
                        selectedDate && <FormControlLabel 
                        control={<Switch
                          checked={partialDay}
                          onChange={(e) => setPartialDayPretense(e) }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label="Partial day?"
                      />
                      }
                      
                      {
                        partialDay ? (
                          <Grow in={partialDay}>
                            <Box>
                              <SingleInputTimeRangeField 
                                label="Start and end"
                                value={timerange}
                                fullWidth={true}
                                size={'small'}
                                onChange={(newValue) => setTimerange(newValue)}
                                />
                              <br/>
                            <Typography variant='caption' gutterBottom>Enter the time range you will NOT be available.</Typography> 
                            </Box>
                          </Grow>
                        ):
                        null
                      }
                      

                    </Stack>
                  </Grid>

              </Grid>

          </DialogContent>
          }
          <DialogActions>
            <Button sx={{ borderRadius: 10}} variant='contained' onClick={() => saveCloseDate()}>save</Button>
          </DialogActions>
        
      </Dialog>

    </>
  );
};

export default OpeningHoursForm;
