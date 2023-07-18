import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, LinearProgress, TextField, Box, Button, FormHelperText,
Tooltip, IconButton, Stack, Alert, CardContent, CardMedia, Checkbox , FormControl, Select,
InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, 
InputAdornment, Backdrop, CircularProgress, Chip, Paper  } from "@mui/material";
import axios, { AxiosError } from 'axios';
import {  Navbar as N} from 'react-bootstrap';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { StyledCard, StyledCardService } from "./CardStyle";
import { checkObjectData, checkPublicLink, getCountries, getTimeZone, getTimestamp} from "./RegisterHelper";
import {  HOURS_LIST, WEEK_LIST, WEEK_OBJ } from "../Testing/RegisterTest.js";
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import {setUser as SETUSER} from "../../reducers/user";
import { setAccessToken } from "../../auth/Auth";

import LIST_IMG from "../../assets/images/listhd.png";
import CAL_IMG from "../../assets/images/calendarsd.png";
import BOTH_IMG from  "../../assets/images/bothsd.png";
import "./Register.css";
import ServicesGrid from "../../components/Service/ServicesGrid";
import { useSignIn } from "react-auth-kit";


/** 
 * Option 2: 
 * COMPLETED: Here have the user choose between basic or medium with analytics, Promotions
 * TODO: Make sure to reset certain sections if back button is pressed.
 * 
 * 
 * 
*/



export default function Register(props){

    const navigate = useNavigate();
    const signIn = useSignIn();
    const dispatch = useDispatch();

    let HOURS = HOURS_LIST();
    let WEEK = WEEK_LIST();
    let WEEK_OBJECT = WEEK_OBJ();
    let timezone = getTimeZone();
    let timestamp = getTimestamp();

    const country_list = getCountries();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(10);
    const [mode, setMode] = useState(0);
    const [error, setErrors] = useState();
    const [passwordError, setPasswordError] = useState(false);

    
    const [operationsObject, setOperations] = useState({ start: '', end: ''});
    const [servicesObject, setServices] = useState({ title: '', minutes: 0});
    const [servicesModal, setServicesModal] = useState(false);
    const [user,setUser] = useState({
        fullName: '',
        email: '',
        password: '',
        businessWebsite: '',
        businessName: '',
        publicLink: '',
        role: 'Admin',
        businessAddress: '',
        country: '',
        mode: 0,
        services: [],
        schedule: {},
        timezone: timezone,
        timestamp: timestamp,
        settings: {}
    })

    const [userErrors, setUserErrors] = useState({
        fullName: false,
        email: false,
        password: false,
        businessWebsite: false,
        businessName: false,
        publicLink: false,
        role: false,
        businessAddress: false,
        country: false,
        mode: false,
        services: false,
        schedule: false,
        timezone: false
    })
    
    function closeServicesModal () { setServicesModal(false); }

    useEffect(() => {

    }, [])

   

    /**
     * Increment loader
     * Save user appointment type.
     */
    const durationInfo = () => {
        setStep((prev) => prev += 22.5);
        setUser((prev) => ({...prev, mode: mode}))
    }

    /**
     * Increment loadbar.
     * Save user business data.
     */
    const businessInfo = () => {
        if (!user.publicLink) {
          setErrors('Missing your public link.');
          return;
        }
        setLoading(true);
        checkPublicLink(user.publicLink)
          .then((response) => {
            switch (response.status){
                case 200:
                    setStep((prev) => prev + 22.5);
                    setErrors();
                    setLoading(false);
                    return;
                case 201:
                    setErrors(response.data.msg);
                    setLoading(false);
                    return;
                default:
                    setErrors(response.status);
                    setLoading(false);
                    return;
            }
          })
          .catch((error) => {
            setLoading(false)
            setErrors(error);
            return;
          })
      };
      
    /**
     * Decrement loadbar.
     * Go to previous screen.
     */
    const previous = () => {
        setStep((prev) => prev -= 22.5)
    }
    
    /**
     * Increment loader
     * Save durations 
     */
    const operationHoursInfo = () => {
        setStep((prev) => prev+=22.5);
    
        for (let day in WEEK_OBJECT) {
            if (WEEK_OBJECT[day].status === true){
                WEEK_OBJECT[day].start = operationsObject.start;
                WEEK_OBJECT[day].end = operationsObject.end;
            }
        }
        console.log(WEEK_OBJECT);
        setUser((prev) => ({...prev, schedule: WEEK_OBJECT }));
    }

    const handleCheckedEvent = (item) => {
        WEEK_OBJECT[item].status = !WEEK_OBJECT[item].status;
    }

    /**
     * 
     * @param {*} digit     0..2 corresponding to level of service.  
     */
    const handleCardClick = (digit) => {
        setMode(digit);
    }


    /**
     * Add a new service to array.
     * Clears services values.
     * RemoveModal.
     */
    const handleNewService = () => {
        setUser((prev) => ({
            ...prev, 
            services: [ ...prev.services, servicesObject ]
        }));
        setServices({ title: '', minutes: 0})
        setServicesModal(false);
    }

    /**
     * 
     * @param {*} event     Handle password change and check for any errors.
     */
    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setUser((prev) => ({...prev, password: event.target.value}))
        setPasswordError(!validatePassword(newPassword));
    };

    /**
     * 
     * @param {String} password   Regex testing. 
     * @returns 
     */
    const validatePassword = (password) => {
        // Regex pattern for password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;
        return passwordRegex.test(password);
    };

    


    /**
     * 
     * @param {Object} missing       Missing key values as key strings.
     *                              Display Error count and setBack to step zero. 
     */
    const displayErrors = (missing) => {
        setUserErrors(missing);
        setErrors(`Errors found!`);
    }


    async function registerBusiness(data) {
        const config = {
            headers: {
                'Content-type': 'application/json' 
            }
        }         
        const response = await axios.post('/api/external/register_business', data, config)
        return response;
    } 



    /**
     * Submit to backend.
     */
    const submitBusinessInfo = () => {
        setLoading(true);
        const {status, missing} = checkObjectData(user);
        if (!status){
            const data = JSON.stringify(user);
            const formData = new FormData();
            formData.append('RegisterData',data);
            registerBusiness(formData)
            .then(response => {
                console.log(response.status);
                if (response.status === 200){
                    signIn({
                        token: response.data.token,
                        expiresIn: 3600,
                        tokenType: "Bearer",
                        authState: { id: response.data.id },
                    })
                    setAccessToken(response.data.accessToken);
                    dispatch(SETUSER({ id: response.data.id, email: response.data.email}));
                    setLoading(false);
                    navigate('/Dashboard');
                    return;
                }else {
                    setLoading(false);
                    setErrors('Status: ' + response.status + 'Unable to proccess request at the moment.');
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                setErrors('Axios: ' + error.response.data.msg);
                setLoading(false);
                return;
            })
        }else {
            displayErrors(missing);
            setLoading(false);
            setStep(10);
            return;
        }
    }


    return(
        <>  
            
            <Container className="container" sx={{ pt: 5, pb: 5}}>       
                { step === 10 ?(
                        <Container className="content_container" sx={{ p: 3}}>
                        <Box sx={{ flexGrow: 1, p: 1}}>
                            <Typography variant="h3">Tell us about your business.</Typography>
                            {error ? (<Alert severity="error">{error}</Alert>): null}         

                            <Grid
                                sx={{ pt: 2, p: 2}}
                                spacing={2}
                                columnSpacing={5}
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                fullWidth
                            >
                                <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Business name *</strong></Typography>
                                </FormHelperText>
                                    <TextField 
                                    name="businessName" error={userErrors.businessName}  id="business-name" variant="filled" value={user.businessName} onChange={e => setUser((prev) => ({ ...prev, businessName: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>Company website (optional)</strong></Typography>
                                    </FormHelperText>
                                    <TextField error={userErrors.businessWebsite}  name="businessWebsite" variant="filled" value={user.businessWebsite} onChange={e => setUser((prev) => ({ ...prev, businessWebsite: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>Choose public link*</strong>
                                        <Tooltip title="Here is the link where your customers will be able to join.">
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        </Typography>
                                    </FormHelperText>
                                    <TextField error={userErrors.publicLink} InputProps={{
                                            startAdornment: <InputAdornment position="start">/welcome/</InputAdornment>,
                                        }} name="publicLink" variant="filled" value={user.publicLink} onChange={e => setUser((prev) => ({ ...prev, publicLink: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Country*</strong></Typography>

                                    <Select
                                        labelId="Country-simple-select-label"
                                        id="Country-simple-select"
                                        label="Country"
                                        variant="filled"
                                        fullWidth
                                        name="country"
                                        onChange={e => setUser((prev) => ({...prev, country: e.target.value }))}
                                        error={userErrors.country}
                                    >
                                        {country_list && Object.entries(country_list).map(([key, value]) => (
                                            <MenuItem key={key} value={key}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    </FormHelperText>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>Your role</strong></Typography>
                                    </FormHelperText>
                                    <TextField disabled={true} name="role" variant="filled" value={user.role} onChange={e => setUser((prev) => ({ ...prev, role: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>business address (optional)</strong></Typography>
                                    </FormHelperText>
                                    <TextField name="businessAddress" value={user.businessAddress} onChange={e => setUser((prev) => ({ ...prev, businessAddress: e.target.value}))}  variant="filled" fullWidth/>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button sx={{ mt: 3, width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => businessInfo() }>Next</Button>
                        { loading ? (
                            <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                            
                          >
                            <CircularProgress color="inherit" />
                            <Typography variant="body2" sx={{ color: 'white'}}>Checking public link...</Typography>
                          </Backdrop>
                        ) : null}
                        </Container>
                    ): null
                }
                {
                    step === 32.5 ?
                    (
                        <Container className="content_container" sx={{ p: 3}}>
                            <Box sx={{ flexGrow: 1, p: 1}}>
                                <Typography variant="h3">How would you like to use "{user.businessName}"?</Typography>
                            </Box>

                            <Container sx={{ pt: 5}}>
                                <Grid 
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="stretch"
                                    spacing={2}
                                >
                                    <Grid item xs={12} sm={6} md={4}>
                                        <StyledCard sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }}  onClick={() => handleCardClick(0) } id="selection_card">
                                                <CardContent>
                                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Set up waitlist</strong></Typography>
                                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Let my clients wait from anywhere.</Typography>
                                                    <Typography sx={{ textAlign: 'left', pt: 0}} variant="body2" color="dark">Free.</Typography>

                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: '100%', height: '100%'}}
                                                        image={LIST_IMG}
                                                        alt="Live from space album cover"
                                                    />
                                                </CardContent>
                                                
                                        </StyledCard>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                    <StyledCard sx={{ backgroundColor: mode === 1 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }} id="selection_card" onClick={() => handleCardClick(1) } >
                                            <CardContent>
                                                <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Analytics</strong></Typography>
                                                <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">View business trends.</Typography>
                                                <Typography sx={{ textAlign: 'left', pt: 0}} variant="body2" color="dark">$</Typography>
                                                <CardMedia
                                                component="img"
                                                sx={{ width: '100%', height: '100%'}}
                                                image={CAL_IMG}
                                                alt="Live from space album cover"
                                                />
                                            </CardContent>
                                            
                                        </StyledCard>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <StyledCard sx={{ backgroundColor: mode === 2 ? '#ffc34d': '',boxShadow: mode === 2 ? 3: 0 }} id="selection_card" onClick={() => handleCardClick(2) }>
                                            <CardContent>
                                                <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Analytics + Advertisments</strong></Typography>
                                                <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">View business trends and advertise.</Typography>
                                                <Typography sx={{ textAlign: 'left', pt: 0}} variant="body2" color="dark">$$</Typography>
                                                <CardMedia
                                                component="img"
                                                sx={{ width: '100%', height: '100%'}}
                                                image={BOTH_IMG}
                                                alt="Live from space album cover"
                                                />
                                            </CardContent>
                                            
                                        </StyledCard>
                                    </Grid>

                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                                <Stack sx={{ pt: 3}} direction="row" spacing={2}>
                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => durationInfo() }>Next</Button>
                                </Stack>
                                </Box>
                                
                            </Container>
                            
                            
                        </Container>
                    ):null
                }
                {
                    step === 55 ?
                    (
                        <Container className="content_container" sx={{ p: 3}}>
                            <Box sx={{ flexGrow: 1, p: 1}}>
                                <Typography variant="h3">Let users choose the service they want.</Typography>
                                <Typography variant="h6">Use our examples below or add your own.</Typography>

                                <Container sx={{ pt: 5}}>
                                    <Button onClick={() => setServicesModal(true)} endIcon={ <ControlPointRoundedIcon fontSize="large" /> } size="large" variant="outlined" color="primary">
                                        Add a service
                                    </Button>
                                        <ServicesGrid services={user.services} setServices={setUser}/>
                                    <Dialog
                                        open={servicesModal}
                                        onClose={closeServicesModal}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                        <Typography typography="h5"> Add new service</Typography>
                                        </DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            <Typography typography="subtitle2"> For example, mens haircut with a duration of 45 min till completion.</Typography>
                                        </DialogContentText>
                                        
                                        <Box sx={{ p: 1, pt: 2}}>
                                            <Stack direction="row" spacing={2}>
                                                <TextField variant="filled" label="Title" onChange={e => setServices((prev) => ({ ...prev, title: e.target.value}))}/>
                                                <TextField variant="filled" label="Duration (in min)" type="number" onChange={e => setServices((prev) => ({ ...prev, minutes: e.target.value}))}/>
                                            </Stack>
                                        </Box>
                                    
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={closeServicesModal}>Close</Button>
                                        <Button onClick={handleNewService} autoFocus>
                                            Add
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Container>

                            </Box>
                            <Box sx={{ display: 'flex', pt: 3 ,justifyContent: 'center', alignItems: 'center'}}>
                                <Stack sx={{ pt: 3}} direction="row" spacing={2}>
                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => operationHoursInfo() }>Next</Button>
                                </Stack>
                            </Box>
                            

                        </Container>
                    ): null
                }
                {
                    step === 77.5 ? (
                        <Container className="content_container" sx={{ p: 3}}>
                                <Box sx={{ flexGrow: 1, p: 1}}>
                                    <Typography variant="h3">Add your hours of operation. </Typography>

                                    <Container sx={{ pt: 5}}>
                                        <Typography variant="subtitle2" textAlign="left"><strong>Hours *</strong></Typography>
                                        <Grid container spacing={1} justifyContent="space-between">
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ minWidth: 120 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="start_time_label">start</InputLabel>
                                                    <Select
                                                    labelId="start_time_label"
                                                    id="start_time"
                                                    variant="filled"
                                                    label="Start"
                                                    error={userErrors.schedule}
                                                    onChange={e => setOperations((prev) => ({...prev, start: e.target.value}))}
                                                    value={operationsObject.start}
                                                    >
                                                    { HOURS && HOURS.map((item, index) =>(
                                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                                        ) )}
                                                    
                                                    </Select>
                                                </FormControl>
                                                </Box>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <Box sx={{ minWidth: 120 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="end_time_label">end</InputLabel>
                                                    <Select
                                                        labelId="end_time_label"
                                                        id="end_time"
                                                        label="End"
                                                        variant="filled"
                                                        error={userErrors.schedule}
                                                        onChange={e => setOperations((prev) => ({...prev, end: e.target.value}))}
                                                        value={operationsObject.end}

                                                    >
                                                    { HOURS && HOURS.map((item, index) =>(
                                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                                    ) )}
                                                    </Select>
                                                </FormControl>
                                                </Box>
                                            </Grid>

                                            
                                        </Grid>
                                        <Typography sx={{ pt: 2}} variant="subtitle2" textAlign="left"><strong>Week</strong></Typography>

                                        <Grid container
                                            sx={{ pt: 2}}
                                            direction="row"
                                            justifyContent="space-around"
                                            alignItems="stretch"
                                            spacing={3}>
                                            
                                            { WEEK.map((item, index) => {
                                                return(
                                                    <>
                                                        <Grid item xs={6} md={4} lg={2}>
                                                            <StyledCardService id="service_cards" sx={{ p: 2}}>
                                                            <Checkbox
                                                                onClick={() => handleCheckedEvent(item) }
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                />
                                                            <Typography variant="subtitle2" textAlign="center" color="gray">{item}</Typography>

                                                            </StyledCardService>

                                                        </Grid>
                                                    </>
                                                )
                                            })}
                                        </Grid>

                                    </Container>

                                </Box>
                                <Box sx={{ display: 'flex', pt: 3 ,justifyContent: 'center', alignItems: 'center'}}>
                                    <Stack sx={{ pt: 3}} direction="row" spacing={2}>
                                        <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                        <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => operationHoursInfo() }>Next</Button>
                                    </Stack>
                                </Box>
                                

                        </Container>
                    ) : null
                }
                {
                    step === 100? (
                        <Container className='content_container'>
                            <Box sx={{ pl: 2, pr: 2}}>
                                <Typography variant="h3">Finally, Login information, Last step!</Typography>
                                {error ? (<Alert severity="error">{error}</Alert>): null}         

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4} lg={4}></Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                        <Stack direction="column" sx={{ pt: 2}} spacing={2}>
                                            <TextField error={userErrors.fullName} name="fullName" value={user.fullName} onChange={e => (setUser((prev) => ({...prev, fullName: e.target.value}) )) }
                                            label="Full name" variant="filled"></TextField>
                                            <TextField helperText="Password must container one uppercase, special character and a number." name="password" label="Password" value={user.password} onChange={handlePasswordChange} error={passwordError} type="password" pattern="/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/" variant="filled"></TextField>
                                            <TextField error={userErrors.email} name="email" label="Email" value={user.email} onChange={e => (setUser((prev) => ({...prev, email: e.target.value}) ))} type="email" variant="filled"></TextField>
                                            <Box sx={{ minWidth: 120 }}>
                                                    <Stack spacing={1}>
                                                        <Chip label={timezone} variant="outlined" />
                                                        <Tooltip placement="bottom" title="If time does not match your current time, please turn off any VPN you might be using.">
                                                            <Chip label={timestamp} variant="outlined"/>
                                                        </Tooltip>
                                                    </Stack>
                                                </Box>
                                        </Stack>

                                        <Box sx={{ display: 'flex', pt: 3 ,justifyContent: 'center', alignItems: 'center'}}>
                                            <Stack sx={{ pt: 3}} direction="row" spacing={2}>

                                                {loading ? (
                                                    <Backdrop
                                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                    open={loading}
                                                    >   
                                                            <CircularProgress color="inherit" />
                                                            <Typography variant="body2" sx={{ color: 'white'}}>Checking values...</Typography>
                                                       
                                                  </Backdrop>
                                                ):
                                                <>
                                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                                    <Button sx={{ width: '100px', borderRadius: 10}} variant="contained" color="primary" onClick={() => submitBusinessInfo() }>submit</Button>
                                                </>
                                                }
                                            </Stack>
                                        </Box>

                                        </Grid>
                                        <Grid item xs={12} md={4} lg={4}></Grid>
                                    </Grid>
                            </Box>
                        </Container>
                    ):
                    null
                }

                </Container>

            <N collapseOnSelect expand="lg" fixed="bottom">
                <Box sx={{ width: '100%', backgroundColor: 'white'}} >
                    <LinearProgress variant="determinate" value={step} />
                    <Typography sx={{ pt: 1}} textAlign='center' variant="subtitle2"><strong>Your business</strong></Typography>
                </Box>
            </N>
        </>
    )
}