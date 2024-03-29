import React, { useEffect, useState} from "react";
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, Switch, Button, FormLabel, Stack, Box, Typography} from "@mui/material";
import { validationSchema, LABELS, requestExtraChanges, TITLE } from "../FormHelpers/ExtraFormsHelper";
import { setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions";


export default function ClientSignForm({setLoading, loading}) {

    const { checkPermission } = usePermission();
    const business = useSelector((state) => state.business);
    const settings = useSelector((state) => state.business.settings.present);
    const dispatch = useDispatch();


   

    const initialValues = {
        position: settings.position,
        waitlist: settings.waitlist,
        servicePrice: settings.servicePrice,
        employees: settings.employees,
        resources: settings.resources,
        services: settings.services,
        waittime: settings.waittime,
    };

    const handleSubmit = (values) => {
        const payload = { values, b_id: business._id}
        requestExtraChanges(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(true);
        })
    };
    return(
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange }) => (
                    <Form>
                    <Stack spacing={1}>
                        {Object.entries(values).map(([key, value]) => (
                            <Box>
                            <Typography fontWeight='bold' variant="subtitle2">{TITLE[key]}</Typography>
                            <Typography variant="body2">{LABELS[key]}</Typography>
                            <FormControlLabel
                                control={<Switch color="secondary" checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                            </Box>
                        ))}
                        
                    </Stack>
                    <br/>
                    <Button disabled={!checkPermission('CLIENT_SIGNU')} sx={{borderRadius: 10}} variant="contained" type="submit">Save</Button>
                    </Form>
                )}
            </Formik>
        
        </>
    )
}