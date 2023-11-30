import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Switch, FormControlLabel, Grid, Button, Container, Typography, TextField, InputLabel  } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken } from '../../auth/Auth';
import { setSnackbar } from '../../reducers/user';
import { reloadBusinessData } from '../../hooks/hooks';
import { DateTime } from 'luxon';


export default function SystemForm() {

    const settings = useSelector((state) => state.business.system);
    const permissionLevel = useSelector((state) => state.user.permissions);
    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const initialValues = {
        equalDate: settings.equalDate,
        autoDelete: settings.autoDelete,
        serveMax: business.serveMax,
        appointments: business.system.appointments,
        waitlist: business.system.waitlist,
        maxAppointmentDate: settings.maxAppointmentDate,
      };
      
    const validationSchema = Yup.object().shape({
        equalDate: Yup.boolean(),
        serveMax: Yup.number().max(100),
        appointments: Yup.boolean(),
        waitlist: Yup.boolean(),
        maxAppointmentDate: Yup.number().min(20).max(360)
    });

    const handleSubmit = (values) => {
        setLoading(true);
        const accessToken = getAccessToken();
        const payload = { ...values, b_id: business._id}
        const headers = { headers: { 'x-access-token': accessToken } };
        axios.put('/api/internal/update_system', payload, headers)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}));
        })
        .finally(() => {
            setLoading(false);
        })

    };
    const TITLE = { 
        appointments: 'Appointments',
        waitlist: 'Waitlist',
        equalDate: 'Same day',
        autoDelete: 'Auto delete',
    }
    const LABELS = {
        appointments: 'Use appointments based on your services and duration let your clients schedule future appointments ',
        waitlist: 'User a queue based appointment system, allow clients to join a virtual',
        equalDate: 'Waitlist will only show current day appointments.',
        autoDelete: 'Automatically delete missed once a new day is present. Otherwise, all missed clients will be marked as no show.',
    }


    useEffect(() => {
        reloadBusinessData(dispatch);
    }, [loading])

    return (
        <>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, values, handleChange }) => (
            <Form>
            <Grid container spacing={2}>
                {
                Object.entries(values).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                        return (
                        <Grid item xs={12} key={key}>
                            <Typography variant='subtitle2' fontWeight={'bold'}>{TITLE[key]}</Typography>
                            <Typography variant="body2">{LABELS[key]}</Typography>
                            <FormControlLabel
                                control={<Switch color={"opposite"} checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                        </Grid>
                        );
                    }
                    return null; // Skip non-boolean options
                })
                }

                <Grid item xs={12}>
                    <Typography variant='subtitle2' fontWeight={'bold'}>Blocks any external waitlist request from clients after {business && business.serveMax}. </Typography>
                    <br/>
                    <Field
                        as={TextField}
                        name="serveMax"
                        label="Maximum waitlist size"
                        type="number"
                        error={touched.serveMax && Boolean(errors.serveMax)}
                        helperText={touched.serveMax && errors.serveMax}
                        fullWidth={false}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant='subtitle2' fontWeight={'bold'}>Maximum Open Dates Control </Typography>
                    <Typography variant='body2'>Configure the number of open dates in your Date Calendar with precision. For example, limit the availability to a maximum of {initialValues.maxAppointmentDate} days ~ untill {DateTime.local().plus({days: initialValues.maxAppointmentDate}).toFormat('LLL dd yyyy')}</Typography>
                    <br/>
                    <Field
                        as={TextField}
                        name="maxAppointmentDate"
                        label="Open dates control"
                        type="number"
                        error={touched.maxAppointmentDate && Boolean(errors.maxAppointmentDate)}
                        helperText={touched.maxAppointmentDate && errors.maxAppointmentDate}
                        fullWidth={false}
                    />
                </Grid>
            </Grid>
            <br/>
                <Button variant='contained' type="submit" sx={{borderRadius: 10}} disabled={(permissionLevel === 2|| permissionLevel === 3) ? true: false}>Save</Button>
            </Form>
        )}
        </Formik>
        <Container>
            <Typography></Typography>
        </Container>
        
        </>
    );
};


