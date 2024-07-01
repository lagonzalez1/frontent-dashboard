import React, { useEffect, useState} from "react";
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, Switch, Button, FormLabel, Typography} from "@mui/material";
import { requestInputFieldChange, validationSchema, LABELS, TITLE } from "../FormHelpers/ClientFormHelpers";
import { setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions";
import { useSubscription } from "../../auth/Subscription";
import { LoadingButton } from "@mui/lab";
import { payloadAuth } from "../../selectors/requestSelectors";


export default function ClientForm({reloadPage}) {
    
    const { checkPermission } = usePermission();
    const { cancelledSubscription } = useSubscription();
    const settings = useSelector((state) => state.business.settings.inputFields);
    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();
    const [loading, setLoading ] = useState(false);
    const {id, bid, email} = useSelector((state) => payloadAuth(state));


    const initialValues = {
        email: settings.email,
        notes: settings.notes,
        service: settings.service,
    };

    const handleSubmit = (values) => {
        setLoading(true);
        const payload = { b_id: bid, values, email}
        requestInputFieldChange(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch (error => {
            dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
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
                        <Grid container spacing={2}>
                            {Object.entries(values).map(([key, value]) => (
                            <Grid item xs={12} key={key}>
                                <Typography fontWeight='bold' variant="subtitle2">{TITLE[key]}</Typography>
                                <Typography  variant="body2">{LABELS[key]}</Typography>
                                <FormControlLabel
                                control={<Switch color={'warning'} checked={value} onChange={handleChange} name={key} />}
                                label={value ? "On" : "Off"}
                                />
                            </Grid>
                            ))}
                        </Grid>
                        <br/>
                        <LoadingButton loading={loading} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} disabled={!checkPermission('CLIENT_FORM') || cancelledSubscription()} variant="contained" type="submit">Save</LoadingButton>
                    </Form>
                    )}
            </Formik>
        
        </>
    )
}