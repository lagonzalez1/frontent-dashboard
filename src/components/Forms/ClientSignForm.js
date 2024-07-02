import React, { useEffect, useState} from "react";
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, Switch, Button, FormLabel, Stack, Box, Typography} from "@mui/material";
import { validationSchema, LABELS, requestExtraChanges, TITLE } from "../FormHelpers/ExtraFormsHelper";
import { setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions";
import { useSubscription } from "../../auth/Subscription";
import { LoadingButton } from "@mui/lab";
import { payloadAuth } from "../../selectors/requestSelectors";


export default function ClientSignForm({reloadPage}) {

    const { checkPermission } = usePermission();
    const { cancelledSubscription } = useSubscription();
    const business = useSelector((state) => state.business);
    const settings = useSelector((state) => state.business.settings.present);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const {id, bid, email} = useSelector((state) => payloadAuth(state));

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
        const payload = { values, b_id: bid, email}
        requestExtraChanges(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.data.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
            reloadPage();
        })
    };
    return(
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange }) => (
                    <Form>
                    <Stack spacing={1}>
                        {Object.entries(values).map(([key, value]) => (
                            <Box key={key}>
                            <Typography fontWeight='bold' variant="subtitle2">{TITLE[key]}</Typography>
                            <Typography variant="body2">{LABELS[key]}</Typography>
                            <FormControlLabel
                                control={<Switch color="warning" checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                            />
                            </Box>
                        ))}
                        
                    </Stack>
                    <br/>
                    <LoadingButton loading={loading} disabled={!checkPermission('CLIENT_SIGNU') || cancelledSubscription()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="contained" type="submit">Save</LoadingButton>
                    </Form>
                )}
            </Formik>
        
        </>
    )
}