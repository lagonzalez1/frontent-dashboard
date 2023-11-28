import React, { useEffect, useState} from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, Switch, Button, FormLabel, Stack, Box, Typography} from "@mui/material";
import { validationSchema, LABELS, requestExtraChanges, TITLE } from "../FormHelpers/ExtraFormsHelper";
import business from "../../reducers/business";
import { setSnackbar } from "../../reducers/user";
import { reloadBusinessData } from "../../hooks/hooks";


export default function ExtrasForm() {


    const [loading, setLoading] = useState(false);
    const business = useSelector((state) => state.business);
    const settings = useSelector((state) => state.business.settings.present);
    const permissionLevel = useSelector((state) => state.user.permissions);
    const dispatch = useDispatch();


    useEffect(() => {
        reloadBusinessData(dispatch);
      }, [loading])

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
        setLoading(true);
        const payload = { values, b_id: business._id}
        requestExtraChanges(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false)
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
                                control={<Switch color="opposite" checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                            </Box>
                        ))}
                        
                    </Stack>
                    <br/>
                    <Button disabled={(permissionLevel === 2|| permissionLevel === 3) ? true: false} sx={{borderRadius: 10}} variant="contained" type="submit">Save</Button>
                    </Form>
                )}
            </Formik>
        
        </>
    )
}