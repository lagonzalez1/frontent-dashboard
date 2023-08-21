import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Switch, FormControlLabel, Grid, Button, FormLabel, Typography  } from '@mui/material';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAccessToken } from '../../auth/Auth';
import { setSnackbar } from '../../reducers/user';
import { reloadBusinessData } from '../../hooks/hooks';

export default function TableForm() {

    const settings = useSelector((state) => state.business.system);
    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const initialValues = {
        equalDate: settings.equalDate,
      };
      
      const validationSchema = Yup.object().shape({
        equalDate: Yup.boolean(),

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
    const LABELS = {
        equalDate: 'Waitlist will only show current day appointments.'
    }


    useEffect(() => {
        reloadBusinessData(dispatch);
    }, [loading])

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange }) => (
            <Form>
            <Grid container spacing={2}>
                {Object.entries(values).map(([key, value]) => (
                <Grid item xs={12} key={key}>
                    <Typography fontWeight='bold' variant="body2">{LABELS[key]}</Typography>
                    <FormControlLabel
                        control={<Switch checked={value} onChange={handleChange} name={key}  />}
                        label={value ? "On": "Off"}
                    />
                </Grid>
                ))}
            </Grid>
            <br/>
            <Button variant='contained' type="submit" sx={{borderRadius: 15}}>Save</Button>
            </Form>
        )}
        </Formik>
    );
};


