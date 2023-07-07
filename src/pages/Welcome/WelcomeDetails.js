import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, ToggleButtonGroup, ToggleButton, IconButton, Zoom, TextField, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useParams } from "react-router-dom";
import { allowClientJoin, getBuisnessForm, waitlistRequest,checkDuplicatesRequest } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTime } from "luxon";

export default function WelcomeDetails() {

    const validationSchema = Yup.object({
        fullname: Yup.string().required('Full Name is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        service: Yup.string()
    });

    const formik = useFormik({
        initialValues: {
          fullname: '',
          phoneNumber: '',
          email: '',
          service: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            checkAcceptingState(values);
        },
    });

    const { link } = useParams();
    const navigate = useNavigate();
    const [services, setServices] = useState();
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);


    const buisnessForm = () => {
        getBuisnessForm(link)
        .then(data => {
            setInputs(data.inputFields);
            setServices(data.services);
        })
        .catch(error => {
            setErrors(errors);
            console.log(error);
        })
    }

    useEffect(() => {
        buisnessForm();
        return() => {
            setLoading(false)
        }
    }, [])

    const checkAcceptingState = async (values) => {
        let timestamp = DateTime.local().toUTC();
        try {
            const response = await allowClientJoin(timestamp, link);
            const { isAccepting } = response.data;
            console.log(isAccepting);
            if (isAccepting){
                
                externalWaitlistRequest(values);
            }else{
                setLoading(false);
                redirectBack();
            }
            
        }catch(error) {
            setLoading(false);
            redirectBack();
            console.log('error');
        }
    }


    const externalWaitlistRequest = (values) => {

        const clientStorage = JSON.parse(localStorage.getItem('client'));
        let timestamp = DateTime.local().toUTC();
        let partySize = clientStorage.partySize;
        let payload = { ...values, link, timestamp, partySize}



        checkDuplicatesRequest(values.email, link)
        .then((responseDuplicates) => {
            if(responseDuplicates.duplicate) {
                setLoading(false);
                navigate(`/welcome/${link}/visits/${responseDuplicates.identifier}`);
            }else{
                return waitlistRequest(payload);
            }
        })
        .then(response => {
            setLoading(false);
            navigate(`/welcome/${link}/visits/${response.unid}`)
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            setErrors(error);
        })
    }

    

    const redirectBack = () => {
        navigate(`/welcome/${link}/size`)
    }
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 475, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    <CardContent>
                        { errors ? <Alert color="warning">{errors}</Alert>: null} 
                    
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Enter your details
                        </Typography>

                        
                        <form onSubmit={formik.handleSubmit}>
                        <Stack sx={{pt: 2}} spacing={1}>

                            { inputs.fullname ? (
                                <>
                                <InputLabel htmlFor="fullname" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Name *</InputLabel>
                                    <TextField
                                        id="fullname"
                                        name="fullname"
                                        label="Name"
                                        value={formik.values.fullname}
                                        onChange={formik.handleChange}
                                        error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                        helperText={formik.touched.fullname && formik.errors.fullname}
                                    /> 
                            </>
                            ): null}
                            
                            { inputs.phone ? (
                                <>
                                <InputLabel htmlFor="phoneNumber" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Phone *</InputLabel>
                                    <TextField
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="Phone Number"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                    />
                                </>
                            ) : null}
                            
                            
                            { inputs.email ? (
                                <>
                                    <InputLabel htmlFor="email" sx={{ textAlign: 'left', fontWeight: 'bold'}}>Email *</InputLabel>
                                    <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />    
                                
                                </>
                            ): null}
                            
                            {
                                inputs.services ? 
                                (
                                    <Box sx={{ height : inputs.service ? 'auto': 0}}>
                                    <InputLabel htmlFor="service"  sx={{ textAlign: 'left', fontWeight: 'bold'}}>
                                        Services</InputLabel>
                                    <Select
                                    id="service"
                                    name="service"
                                    sx={{ textAlign: 'left'}}
                                    fullWidth={true}
                                    value={formik.values.service}
                                    onChange={formik.handleChange}
                                    
                                    >
                                    <MenuItem disabled value="">Select </MenuItem>
                                    { services && 
                                        services.map((item,index) => {
                                            return(
                                                <MenuItem key={index} value={item._id}>{item.title}</MenuItem>

                                            )
                                        })
                                    }
                                    
                                    
                                    </Select>
                                </Box>
                                )
                                :null
                            }
                             
                             <Button sx={{ borderRadius: 10}} type="submit" variant="contained" color="primary">
                            { loading ? (<CircularProgress />) :
                             <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                Join waitlist
                                </Typography> }
                            </Button> 
                            </Stack>

                            </form>      

                                    
                        
                                          
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                    
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}