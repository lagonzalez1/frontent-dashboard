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




/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function EmployeeScheduleForm({employee}) {

    const business = useSelector((state) => state.business);
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
            start: employee ? DateTime.fromFormat(employee.breaks.Sunday.start,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Sunday.duration : 0,
        },
        Monday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Monday.start, 'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Monday.duration : 0,
        },
        Tuesday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Tuesday.start, 'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Tuesday.duration : 0,
        },
        Wednesday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Wednesday.start,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Wednesday.duration : 0,
        },
        Thursday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Thursday.start,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Thursday.duration : 0,
        },
        Friday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Friday.start,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Friday.duration : 0,
        },
        Saturday: {
            start: employee ? DateTime.fromFormat(employee.breaks.Saturday.start,'HH:mm').toFormat('hh:mm a') : '',
            duration: employee ? employee.breaks.Saturday.duration : 0,

        },
    }
    const daySchema = Yup.object().shape({
        start: Yup.string().notRequired(),
        duration: Yup.number()
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


    // Two potential submits, EDIT and NEW
    const handleSubmit = (values) => {
        setLoading(true);
        const businessSchedule = business.schedule;
        const {validated, employeeSchedule} = validateBreak(values, businessSchedule);
        if (!validated) { 
            console.log("Error");
            setAlert(true);
            setErrors('Business might not be open on a break request or a start time is not within start and end time.');
            setLoading(false);
            return;
        }
        const payload = {breaks: {...employeeSchedule},  originalUsername: employee.employeeUsername , b_id: business._id}
        requestScheduleChange(payload)
        .then(res => {
            dispatch(setSnackbar({requestMessage: res, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
            dispatch(setReload(true))
        })
        
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
      })

    const handleScheduleChange = (e, day) => {
        const newValue = e;
        formik.setFieldValue(`${day}.start`, newValue);
      };
    
    return (
    <Box sx={{ pt: 2}}>
        <Box>
        <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant='subtitle1' fontWeight={'bold'}>Your <u>current</u> break schedule</Typography>
                </AccordionSummary>
                <AccordionDetails>
                
                    <Typography variant='body1' fontWeight={'bold'}>Sunday </Typography><Typography variant='body2'>{ employee && employee.breaks.Sunday.start ? DateTime.fromFormat(employee.breaks.Sunday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.breaks.Sunday.start,'HH:mm').plus({minutes: employee.breaks.Sunday.duration}).toFormat('h:mm a'): 'None' }</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Monday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Monday.start ? DateTime.fromFormat(employee.breaks.Monday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.breaks.Monday.start,'HH:mm').plus({minutes: employee.breaks.Monday.duration}).toFormat('h:mm a'): 'None'}</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Tuesday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Tuesday.start ? DateTime.fromFormat(employee.breaks.Tuesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.breaks.Tuesday.start,'HH:mm').plus({minutes: employee.breaks.Tuesday.duration}).toFormat('h:mm a') : 'None'}</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Wednesday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Wednesday.start ? DateTime.fromFormat(employee.breaks.Wednesday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.breaks.Wednesday.start,'HH:mm').plus({minutes: employee.breaks.Wednesday.duration}).toFormat('h:mm a'): 'None'}</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Thursday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Thursday.start ? DateTime.fromFormat(employee.breaks.Thursday.start,'HH:mm').toFormat('h:mm a')  + "-" +DateTime.fromFormat(employee.breaks.Thursday.start,'HH:mm').plus({minutes: employee.breaks.Thursday.duration}).toFormat('h:mm a'): 'None'}</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Friday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Friday.start ? DateTime.fromFormat(employee.breaks.Friday.start,'HH:mm').toFormat('h:mm a') + "-" + DateTime.fromFormat(employee.breaks.Friday.start,'HH:mm').plus({minutes: employee.breaks.Friday.duration}).toFormat('h:mm a'): 'None'}</Typography>
                    <Typography variant='body1' fontWeight={'bold'}>Saturday </Typography> <Typography variant='body2'>{ employee && employee.breaks.Saturday.start ? DateTime.fromFormat(employee.breaks.Saturday.start,'HH:mm').toFormat('h:mm a')  + "-" + DateTime.fromFormat(employee.breaks.Saturday.start,'HH:mm').plus({minutes: employee.breaks.Saturday.duration}).toFormat('h:mm a'): 'None'}</Typography>
                </AccordionDetails>
            </Accordion>
        <Typography variant='caption'>Ex. Monday break starts at 12:00 and 60 min break.</Typography>
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
                            <Grid item xs={6}>
                                <TimeField
                                    fullWidth
                                    label={`${day} break start`}
                                    variant="standard"
                                    margin="dense"
                                    type="text"
                                    onChange={(e) => handleScheduleChange(e, day)}
                                    disabled={business ? (!business.schedule[day]) :null}
                                    error={formik.touched[day]?.start && Boolean(formik.errors[day]?.start)}
                                />
                            
                            </Grid>
                            <Grid item xs={6}>
                            <FormControl fullWidth variant="standard" margin="dense">
                            <InputLabel>Duration ({day})</InputLabel>
                                <Select
                                    name={`${day}.duration`}
                                    value={formik.values[day]?.duration} 
                                    onChange={formik.handleChange}
                                    error={formik.touched[day]?.duration && Boolean(formik.errors[day]?.duration)}
                                >
                                <MenuItem value={0}>None</MenuItem>
                                <MenuItem value={15}>15 minutes</MenuItem>
                                <MenuItem value={30}>30 minutes</MenuItem>
                                <MenuItem value={45}>45 minutes</MenuItem>
                                <MenuItem value={60}>60 minutes</MenuItem>
                                </Select>
                            </FormControl>
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
    </Box>
    
    )
}