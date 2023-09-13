import React, { useEffect, useState} from 'react';
import { TextField, Button, Grid, Stack, Select, Typography, FormControl, Container, Box, CircularProgress,
     InputLabel, MenuItem, Alert, Collapse, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validateBreak, requestScheduleChange } from "../FormHelpers/EmployeeScheduleHelper";
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setReload, setSnackbar } from '../../reducers/user';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';




/* AUG 5 8:54
 handleCheckBoxChange This function will not trigger casuing the WEEK days to update.
*/

export default function EmployeeScheduleForm({employee}) {

    const business = useSelector((state) => state.business);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null);
    const [alert, setAlert] = useState(false);
    const [username, setUsername] = useState(null);


    useEffect(() => {
        if (employee && Object.keys(employee).length > 0){
            console.log(employee);
            return () => {
                setLoading(false);
            }
        }
    }, [employee])

    let initialValues = { 
        Sunday: {
            start: employee ? employee.breaks.Sunday.start : '',
            duration: employee ? employee.breaks.Sunday.duration : 0,
        },
        Monday: {
            start: employee ? employee.breaks.Monday.start : '',
            duration: employee ? employee.breaks.Monday.duration : 0,
        },
        Tuesday: {
            start: employee ? employee.breaks.Tuesday.start : '',
            duration: employee ? employee.breaks.Tuesday.duration : 0,
        },
        Wednesday: {
            start: employee ? employee.breaks.Wednesday.start : '',
            duration: employee ? employee.breaks.Wednesday.duration : 0,
        },
        Thursday: {
            start: employee ? employee.breaks.Thursday.start : '',
            duration: employee ? employee.breaks.Thursday.duration : 0,
        },
        Friday: {
            start: employee ? employee.breaks.Friday.start : '',
            duration: employee ? employee.breaks.Friday.duration : 0,
        },
        Saturday: {
            start: employee ? employee.breaks.Saturday.start : '',
            duration: employee ? employee.breaks.Saturday.duration : 0,

        },
    }
    const daySchema = Yup.object().shape({
        start: Yup.string()
          .matches(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
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
        const businessSchedule = business.schedule;
        const validate = validateBreak(values, businessSchedule);
        if (!validate) { 
            console.log("Error");
            setAlert(true);
            setErrors('Business might not be open on a break request or a start time is not within start and end time.');
            return;
        }
        const payload = {breaks: {...values},  originalUsername: employee.employeeUsername , b_id: business._id}
        requestScheduleChange(payload)
        .then(res => {
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
        <Container sx={{p: 3}}>
          <Box>
            <CircularProgress />
          </Box>
        </Container>
    ) :  
    <Box>
        <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Business schedule</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    Sunday: { business ? business.schedule.Sunday.start + "-" + business.schedule.Sunday.end : ''}
                    <br />
                    Monday: { business ? business.schedule.Monday.start + "-" + business.schedule.Monday.end : ''}
                    <br />
                    Tuesday: { business ? business.schedule.Tuesday.start + "-" + business.schedule.Tuesday.end : ''}
                    <br />
                    Wednesday: { business ? business.schedule.Wednesday.start + "-" + business.schedule.Wednesday.end: ''}
                    <br />
                    Thursday: { business ? business.schedule.Thursday.start + "-" + business.schedule.Thursday.end: ''}
                    <br />
                    Friday: { business ? business.schedule.Friday.start + "-" + business.schedule.Friday.end: ''}
                    <br />
                    Saturday: { business ? business.schedule.Saturday.start + "-" + business.schedule.Saturday.end : ''}
                </Typography>
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
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            >
            {(formikProps) => (
                <Form>
                {Object.keys(initialValues).map((day) => (
                    <div key={day}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <Field
                                fullWidth
                                label={`${day} break start`}
                                variant="standard"
                                margin="normal"
                                name={`${day}.start`}
                                type="text"
                                as={TextField}
                                disabled={business ? (!business.schedule[day]) :null}
                                error={formikProps.touched[day]?.start && Boolean(formikProps.errors[day]?.start)}
                            />
                            </Grid>
                            <Grid item xs={6}>
                            <FormControl fullWidth variant="standard" margin="normal">
                            <InputLabel>Duration ({day})</InputLabel>
                            <Field
                            name={`${day}.duration`}
                            as={Select}
                            error={formikProps.touched[day]?.duration && Boolean(formikProps.errors[day]?.duration)}
                            >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>60 minutes</MenuItem>
                            </Field>
                            <ErrorMessage name={`${day}.duration`} />
                        </FormControl>
                            </Grid>
                        </Grid>              
                    </div>
                ))}
                <Button sx={{ borderRadius: 15}} variant="contained" color="primary" type="submit">
                    Save
                </Button>
                </Form>
            )}
            </Formik>
    </Box>
    
    }
    </Box>
    
    )
}