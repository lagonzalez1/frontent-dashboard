import React, { useEffect, useState} from 'react';
import { TextField, Button, Grid, Stack, Select, Typography, FormControl, Container, Box, CircularProgress,
     InputLabel, MenuItem, Alert, Collapse, IconButton, Accordion, AccordionSummary, AccordionDetails, 
     Divider} from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { validateBreak, requestScheduleChange } from "../FormHelpers/EmployeeScheduleHelper";
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setReload, setSnackbar } from '../../reducers/user';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTime } from 'luxon';
import { usePermission } from '../../auth/Permissions';
import { TimeField } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { ArrowUp } from 'phosphor-react';




/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function EmployeeScheduleForm({employee, reloadPage}) {

    const business = useSelector((state) => state.business);
    const schedule = useSelector((state) => state.business.schedule);
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(false);


    useEffect(() => {
        if (employee && Object.keys(employee).length > 0){
            return () => {
                setLoading(false);
            }
        }
    }, [employee])

    let initialValues = { 
        Sunday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Sunday.start,'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Sunday.end,'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? employee.schedule_alternative.Sunday.break : '',
            duration: employee ? employee.schedule_alternative.Sunday.duration : 0,
        },
        Monday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Monday.start, 'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Monday.end, 'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Monday.break, 'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Monday.duration : 0,
        },
        Tuesday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Tuesday.start, 'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Tuesday.end, 'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Tuesday.break, 'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Tuesday.duration : 0,
        },
        Wednesday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Wednesday.start,'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Wednesday.end,'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Wednesday.break,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Wednesday.duration : 0,
        },
        Thursday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Thursday.start,'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Thursday.end,'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Thursday.break,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Thursday.duration : 0,
        },
        Friday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Friday.start,'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Friday.end,'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Friday.break,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Friday.duration : 0,
        },
        Saturday: {
            start: employee ? DateTime.fromFormat(employee.schedule_alternative.Saturday.start,'HH:mm').toFormat('hh:mm a') : '',
            end: employee ? DateTime.fromFormat(employee.schedule_alternative.Saturday.end,'HH:mm').toFormat('hh:mm a') : '',
            break: employee ? DateTime.fromFormat(employee.schedule_alternative.Saturday.break,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.schedule_alternative.Saturday.duration : 0,
        }
    }
    const daySchema = Yup.object().shape({
        start: Yup.string().notRequired(),
        end: Yup.string().notRequired(),
        break: Yup.string().notRequired(),
        duration: Yup.number().notRequired()
            .integer('Duration must be an integer')
    });
      
    const validationSchema = Yup.object().shape({
        Sunday: daySchema,
        Monday: daySchema,
        Tuesday: daySchema,
        Wednesday: daySchema,
        Thursday: daySchema,
        Friday: daySchema,
        Saturday: daySchema,
    });


    const handleSubmit = (values) => {
        setLoading(true);
        const businessSchedule = schedule; // No loger will need this if start and end time are inputed.
        const {validated, employeeSchedule, reason} = validateBreak(values, businessSchedule);

        if (!validated) { 
            setAlert(true);
            setErrors(reason);
            setLoading(false);
            return;
        }
        const payload = {schedule_alternative: {...employeeSchedule},  originalUsername: employee.employeeUsername , b_id: business._id, email: user.email}
        requestScheduleChange(payload)
        .then(res => {
            dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
            closeEditSchedule();
            reloadPage();
        })  
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
      })

    const handleScheduleChangeStart = (e, day) => {
        const newValue = e;
        formik.setFieldValue(`${day}.start`, newValue);
    };
    const handleScheduleChangeEnd = (e, day) => {
        const newValue = e;
        formik.setFieldValue(`${day}.end`, newValue);
    };
    const handleScheduleChangeBreak = (e, day) => {
        const newValue = e;
        formik.setFieldValue(`${day}.break`, newValue);
    };
    
    return (
    <Box sx={{ pt: 2}}>
        <Typography variant='subtitle1'>Please fill <strong>ALL</strong> business workdays, otherwise empty start/end times will be considered <strong>OFF</strong>.</Typography> 
        <Accordion variant='outlined'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant='subtitle1' fontWeight={'bold'}>Your current schedule</Typography>
                </AccordionSummary>
                <AccordionDetails>
                   <Grid container spacing={1}>
                    <Grid item xs>
                    <Typography variant='subtitle1' fontWeight={'bold'} sx={{color: 'text.primary'}}>Your schedule</Typography>
                        <Stack>
                        <Typography variant='caption' fontWeight={'bold'}>Sunday </Typography><Typography variant='body2'>{ employee && employee.schedule_alternative.Sunday.start ? DateTime.fromFormat(employee.schedule_alternative.Sunday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.schedule_alternative.Sunday.end,'HH:mm').toFormat('h:mm a'): 'OFF' }</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Sunday.break ? "Break: " + DateTime.fromFormat(employee.schedule_alternative.Sunday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Sunday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Sunday.duration}).toFormat("hh:mm a"): null} </Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Monday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Monday.start ? DateTime.fromFormat(employee.schedule_alternative.Monday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.schedule_alternative.Monday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Monday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Monday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Monday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Monday.duration}).toFormat("hh:mm a"): null} </Typography>

                        <Typography variant='caption' fontWeight={'bold'}>Tuesday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Tuesday.start ? DateTime.fromFormat(employee.schedule_alternative.Tuesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.schedule_alternative.Tuesday.end,'HH:mm').toFormat('h:mm a') : 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Tuesday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Tuesday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Tuesday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Tuesday.duration}).toFormat("hh:mm a"): null}</Typography>

                        <Typography variant='caption' fontWeight={'bold'}>Wednesday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Wednesday.start ? DateTime.fromFormat(employee.schedule_alternative.Wednesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.schedule_alternative.Wednesday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Wednesday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Wednesday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Wednesday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Wednesday.duration}).toFormat("hh:mm a"): null} </Typography>

                        <Typography variant='caption' fontWeight={'bold'}>Thursday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Thursday.start ? DateTime.fromFormat(employee.schedule_alternative.Thursday.start,'HH:mm').toFormat('h:mm a')  + "-" +DateTime.fromFormat(employee.schedule_alternative.Thursday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Thursday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Thursday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Thursday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Thursday.duration}).toFormat("hh:mm a"): null} </Typography>

                        <Typography variant='caption' fontWeight={'bold'}>Friday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Friday.start ? DateTime.fromFormat(employee.schedule_alternative.Friday.start,'HH:mm').toFormat('h:mm a') + "-" + DateTime.fromFormat(employee.schedule_alternative.Friday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Friday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Friday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Friday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Friday.duration}).toFormat("hh:mm a"): null} </Typography>

                        <Typography variant='caption' fontWeight={'bold'}>Saturday </Typography> <Typography variant='body2'>{ employee && employee.schedule_alternative.Saturday.start ? DateTime.fromFormat(employee.schedule_alternative.Saturday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.schedule_alternative.Saturday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='body2'>{employee && employee.schedule_alternative.Saturday.break ?  "Break: " +DateTime.fromFormat(employee.schedule_alternative.Saturday.break, "HH:mm").toFormat("hh:mm a") + " - " + DateTime.fromFormat(employee.schedule_alternative.Saturday.break, "HH:mm").plus({'minutes':  employee.schedule_alternative.Saturday.duration}).toFormat("hh:mm a"): null} </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs>
                        <Typography variant='subtitle1' fontWeight={'bold'} sx={{color: 'text.primary'}}>Business schedule</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Sunday </Typography><Typography variant='body2'>{ schedule && schedule.Sunday.start ? DateTime.fromFormat(schedule.Sunday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(schedule.Sunday.end,'HH:mm').toFormat('h:mm a'): 'OFF' }</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Monday </Typography> <Typography variant='body2'>{ schedule && schedule.Monday.start ? DateTime.fromFormat(schedule.Monday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(schedule.Monday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Tuesday </Typography> <Typography variant='body2'>{ schedule && schedule.Tuesday.start ? DateTime.fromFormat(schedule.Tuesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(schedule.Tuesday.end,'HH:mm').toFormat('h:mm a') : 'OFF'}</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Wednesday </Typography> <Typography variant='body2'>{ schedule && schedule.Wednesday.start ? DateTime.fromFormat(schedule.Wednesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(schedule.Wednesday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Thursday </Typography> <Typography variant='body2'>{ schedule && schedule.Thursday.start ? DateTime.fromFormat(schedule.Thursday.start,'HH:mm').toFormat('h:mm a')  + "-" +DateTime.fromFormat(schedule.Thursday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Friday </Typography> <Typography variant='body2'>{ schedule && schedule.Friday.start ? DateTime.fromFormat(schedule.Friday.start,'HH:mm').toFormat('h:mm a') + "-" + DateTime.fromFormat(schedule.Friday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                        <Typography variant='caption' fontWeight={'bold'}>Saturday </Typography> <Typography variant='body2'>{ schedule && schedule.Saturday.start ? DateTime.fromFormat(schedule.Saturday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(schedule.Saturday.end,'HH:mm').toFormat('h:mm a'): 'OFF'}</Typography>
                    </Grid>
                   </Grid>
                </AccordionDetails>
            </Accordion>
        <br />
        <Typography variant='caption'>Non workdays are blocked off by default.</Typography>

        { errors ? (
            <Collapse in={alert}>
            <Alert
            severity="error"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setAlert(false);
                    setErrors(null);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
                sx={{ mb: 2 }}
            >
            {errors}
            </Alert>
        </Collapse>
        ): null}

                <form onSubmit={formik.handleSubmit}>
                {Object.keys(initialValues).map((day) => (
                    <div key={day}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TimeField
                                    fullWidth
                                    label={`${day} start-shift`}
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    color={'secondary'}
                                    onChange={(e) => handleScheduleChangeStart(e, day)}
                                    disabled={employee && !employee.schedule[day]}
                                    error={formik.touched[day]?.start && Boolean(formik.errors[day]?.start)}
                                />
                                <Typography variant='caption' color={'primary'} fontWeight={'bold'}>{schedule[day].start ?  `${day} start time - `+ DateTime.fromFormat(schedule[day].start, 'HH:mm').toFormat('hh:mm a') : ''}</Typography>                            
                                <ArrowUp size={12} />
                            </Grid>
                            <Grid item xs={3}>
                                <TimeField
                                    fullWidth
                                    label={`${day} break start`}
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    color={'secondary'}
                                    onChange={(e) => handleScheduleChangeBreak(e, day)}
                                    disabled={employee && !employee.schedule[day]}
                                    error={formik.touched[day]?.break && Boolean(formik.errors[day]?.break)}
                                />
                            </Grid>
                            <Grid item xs={3}>
                            <FormControl fullWidth variant="standard" margin="dense">
                            <InputLabel>Duration ({day})</InputLabel>
                                <Select
                                    color={'secondary'}
                                    name={`${day}.duration`}
                                    variant="outlined"
                                    value={formik.values[day]?.duration} 
                                    onChange={formik.handleChange}
                                    error={formik.touched[day]?.duration && Boolean(formik.errors[day]?.duration)}
                                    disabled={employee && !employee.schedule[day]}
                                >
                                <MenuItem value={0}>None</MenuItem>
                                <MenuItem value={15}>15 minutes</MenuItem>
                                <MenuItem value={30}>30 minutes</MenuItem>
                                <MenuItem value={45}>45 minutes</MenuItem>
                                <MenuItem value={60}>60 minutes</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <TimeField
                                    fullWidth
                                    label={`${day} end-shift`}
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    color={'secondary'}
                                    onChange={(e) => handleScheduleChangeEnd(e, day)}
                                    disabled={employee && !employee.schedule[day]}
                                    error={formik.touched[day]?.end && Boolean(formik.errors[day]?.end)}
                                />
                                <Typography color={'primary'} fontWeight={'bold'} variant='caption'>{schedule[day].end ? `${day} end time - `+ DateTime.fromFormat(schedule[day].end, 'HH:mm').toFormat('hh:mm a') : ''}</Typography>                            
                                <ArrowUp size={12} />
                            </Grid>
                        </Grid>              
                    </div>
                ))}
                <br />
                <LoadingButton loading={loading} sx={{ borderRadius: 7}} variant="contained" color="primary" type="submit">
                    submit
                </LoadingButton>
                </form>  
    </Box>
    
    )
}