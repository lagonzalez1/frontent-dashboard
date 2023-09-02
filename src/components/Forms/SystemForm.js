import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Switch, FormControlLabel, Grid, Button, Container, Typography, TextField, InputLabel  } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken } from '../../auth/Auth';
import { setSnackbar } from '../../reducers/user';
import { reloadBusinessData } from '../../hooks/hooks';

export default function SystemForm() {

    const settings = useSelector((state) => state.business.system);
    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const initialValues = {
        equalDate: settings.equalDate,
        autoDelete: settings.autoDelete,
        serveMax: business.serveMax,
      };
      
      const validationSchema = Yup.object().shape({
        equalDate: Yup.boolean(),
        serveMax: Yup.number().max(100)

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
            dispatch(setReload(true));
            setLoading(false);
        })

    };
    const LABELS = {
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
                            <Typography variant="body2">{LABELS[key]}</Typography>
                            <FormControlLabel
                                control={<Switch checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                        </Grid>
                        );
                    }
                    return null; // Skip non-boolean options
                })}

                <Grid item xs={12}>
                    <Typography variant='body2'>Blocks any external waitlist request from clients after {business && business.serveMax}. </Typography>
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
            </Grid>
            <br/>
            <Button variant='contained' type="submit" sx={{borderRadius: 15}}>Save</Button>
            </Form>
        )}
        </Formik>
        <Container>
            <Typography></Typography>
        </Container>
        
        </>
    );
};


