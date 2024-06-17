import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Switch, FormControlLabel, Grid, Button, Container, Typography, TextField, InputLabel, Tooltip  } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken, getStateData } from '../../auth/Auth';
import { setSnackbar } from '../../reducers/user';
import { DateTime } from 'luxon';
import { usePermission } from '../../auth/Permissions';
import { useSubscription } from '../../auth/Subscription';
import { LoadingButton } from '@mui/lab';

export default function SystemForm({reloadPage}) {


    const { checkPermission } = usePermission();
    const { checkSubscription, cancelledSubscription } = useSubscription();

    const settings = useSelector((state) => state.business.system);
    const business = useSelector((state) => state.business);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const initialValues = {
        equalDate: settings.equalDate,
        autoDelete: settings.autoDelete,
        serveMax: business.serveMax,
        appointments: business.system.appointments,
        waitlist: business.system.waitlist,
        maxAppointmentDate: settings.maxAppointmentDate,
        partySize: business.partySize,

      };
      
    const validationSchema = Yup.object().shape({
        equalDate: Yup.boolean(),
        serveMax: Yup.number().max(100),
        appointments: Yup.boolean(),
        partySize: Yup.number().max(20),
        waitlist: Yup.boolean(),
        maxAppointmentDate: Yup.number().min(20).max(360)
    });

    const handleSubmit = (values) => {
        const accessToken = getAccessToken();
        const { user, business } = getStateData();
        const payload = { ...values, b_id: business._id, email: user.email}
        const headers = { headers: { 'x-access-token': accessToken } };
        setLoading(true);
        axios.put('/api/internal/update_system', payload, headers)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}));
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                dispatch(setSnackbar({msg: 'Response error', error: error.response}));
            }
            else if (error.request){
                dispatch(setSnackbar({msg: 'No response from server', error: error.request}));
            }
            else {
                dispatch(setSnackbar({msg: 'Request setup error', error: error.message}));
            }
        })
        .finally(() => {
            setLoading(false);
            reloadPage();
        })

    };
    const TITLE = { 
        appointments: 'Appointments',
        waitlist: 'Waitlist',
        equalDate: 'Same day',
        autoDelete: 'Auto delete',
        partySize: 'Party size'
    }
    const LABELS = {
        appointments: 'Use a appointment system to schedule future appointments using your business employees.',
        waitlist: 'Use a queue based waitlist system, allow clients to join a virtual.',
        equalDate: 'Waitlist will only accept same day request.',
        autoDelete: 'Automatically delete clients left unattended, otherwise will be marked as no-shows.',
        partySize: 'Maximum party size per appointment/waitlist request.'
    }

    return (
        <>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, values, handleChange }) => (
            <Form>
            <Grid container spacing={2}>
                {
                Object.entries(values).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                        if (!checkSubscription('APPOINTMENTS') && key === "appointments") {
                            return (
                                <Grid item xs={12} key={key}>
                                    <Typography variant='subtitle2' fontWeight={'bold'}>{TITLE[key]}</Typography>
                                    <Typography variant="body2">{LABELS[key]}</Typography>
                                    <Tooltip title="Please upgrade plan to access this field.">
                                    <FormControlLabel
                                        control={<Switch color={"warning"} disabled={true} checked={value} onChange={handleChange} name={key} />}
                                        label={value ? "On" : "Off"}
                                    />
                                    </Tooltip>
                                </Grid>
                                );
                        }
                        return (
                        <Grid item xs={12} key={key}>
                            <Typography variant='subtitle2' fontWeight={'bold'}>{TITLE[key]}</Typography>
                            <Typography variant="body2">{LABELS[key]}</Typography>
                            <FormControlLabel
                                control={<Switch color={"warning"} checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                        </Grid>
                        );
                    }
                    return null; // Skip non-boolean options
                })
                }

                <Grid item xs={12}>
                    <Typography variant='subtitle2' fontWeight={'bold'}>Blocks any external waitlist request from clients after {business && business.serveMax}+ clients. </Typography>
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
                    <Typography variant='subtitle2' fontWeight={'bold'}>Maximum guest per appointment/waitlist request, currently {business && business.partySize} guest . </Typography>
                    <br/>
                    <Field
                        as={TextField}
                        name="partySize"
                        label="Maximum party size"
                        type="number"
                        error={touched.partySize  && Boolean(errors.partySize)}
                        helperText={touched.partySize && errors.partySize}
                        fullWidth={false}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant='subtitle2' fontWeight={'bold'}>Maximum Open Dates Control - Appointments </Typography>
                    <Typography variant='body2'>Configure the number of open dates in your Date Calendar with precision. 
                    For example, limit the availability to a maximum of {initialValues.maxAppointmentDate} days ~ untill {DateTime.local().plus({days: initialValues.maxAppointmentDate}).toFormat('LLL dd yyyy')}</Typography>
                    <br/>
                    {
                        checkSubscription('APPOINTMENTS') ? (
                            <Field
                                as={TextField}
                                name="maxAppointmentDate"
                                label="Open dates control"
                                type="number"
                                error={touched.maxAppointmentDate && Boolean(errors.maxAppointmentDate)}
                                helperText={touched.maxAppointmentDate && errors.maxAppointmentDate}
                                fullWidth={false}
                            />
                        ):
                        (
                            <Tooltip title="Please upgrade plan to access this field.">
                                <Field
                                as={TextField}
                                name="maxAppointmentDate"
                                label="Open dates control"
                                type="number"
                                disabled={!checkSubscription('APPOINTMENTS')}
                                error={touched.maxAppointmentDate && Boolean(errors.maxAppointmentDate)}
                                helperText={touched.maxAppointmentDate && errors.maxAppointmentDate}
                                fullWidth={false}
                                    />
                            </Tooltip>
                        )
                    }
                    
                </Grid>
            </Grid>
            <br/>
                <LoadingButton loading={loading} variant='contained' type="submit" sx={{borderRadius: 5, textTransform: 'lowercase' } } disabled={!checkPermission('SYSTEM') || cancelledSubscription()}>Save</LoadingButton>
            </Form>
        )}
        </Formik>
    
        </>
    );
};


