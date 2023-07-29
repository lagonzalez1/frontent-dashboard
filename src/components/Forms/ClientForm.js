import React, { useEffect, useState} from "react";
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, Switch, Button, FormLabel} from "@mui/material";
import { requestInputFieldChange, validationSchema, LABELS } from "../FormHelpers/ClientFormHelpers";
import { setSnackbar } from "../../reducers/user";


export default function ClientForm() {


    const [loading, setLoading] = useState(false);
    const settings = useSelector((state) => state.business.settings.inputFields);
    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();


    useEffect(() => {

    },[])

    const initialValues = {
        email: settings.email,
        phone: settings.phone,
        notes: settings.notes,
        service: settings.service,
    };
      
    



    const handleSubmit = (values) => {
        // Handle form submission (e.g., send data to backend)
        setLoading(true);
        console.log(values);
        const payload = { b_id: business._id, values}
        requestInputFieldChange(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch (error => {
            dispatch(setSnackbar({requestMessage: error, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
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
                                <FormLabel component="legend"><strong>{LABELS[key]}</strong></FormLabel>
                                <FormControlLabel
                                control={<Switch checked={value} onChange={handleChange} name={key} />}
                                label={key}
                                />
                            </Grid>
                            ))}
                        </Grid>
                        <br/>
                        <Button sx={{borderRadius: 15}} variant="contained" type="submit">Save</Button>
                    </Form>
                    )}
            </Formik>
        
        </>
    )
}