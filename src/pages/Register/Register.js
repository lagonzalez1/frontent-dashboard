import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, LinearProgress, TextField, Box, Button, FormHelperText,
Tooltip, IconButton, Stack, CardActions, CardContent, CardMedia, Checkbox , FormControl, Select,
InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { Nav, Navbar as N, NavDropdown} from 'react-bootstrap';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { StyledCard, StyledCardService } from "./CardStyle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Formik } from "formik";
import * as yup from "yup";
import { DURATION_DEMO, HOURS_LIST, WEEK_LIST, WEEK_OBJ } from "../Testing/RegisterTest.js";

import LIST_IMG from "../../assets/images/listhd.png";
import CAL_IMG from "../../assets/images/calendarsd.png";
import BOTH_IMG from  "../../assets/images/bothsd.png";
import "./Register.css";



/** 
 * Option 2: 
 * COMPLETED: Here have the user choose between basic or medium with analytics, Promotions
 * TODO: Make sure to reset certain sections if back button is pressed.
 * 
 * 
 * 
*/



const getCountries = (lang = 'en') => {
    const A = 65
    const Z = 90
    const countryName = new Intl.DisplayNames([lang], { type: 'region' });
    let countries = {}
    for(let i=A; i<=Z; ++i) {
        for(let j=A; j<=Z; ++j) {
            let code = String.fromCharCode(i) + String.fromCharCode(j)
            let name = countryName.of(code)
            if (code !== name) {
                countries[code] = name
            }
        }
    }
    return countries
}


export default function Register(props){

    let DEMO = DURATION_DEMO();
    let HOURS = HOURS_LIST();
    let WEEK = WEEK_LIST();
    let WEEK_OBJECT = WEEK_OBJ();
    const country_list = getCountries();

    const [step, setStep] = useState(10);
    const [mode, setMode] = useState(0);

    
    const [operationsObject, setOperations] = useState({ start: '', end: ''});
    const [servicesObject, setServices] = useState({ title: '', minutes: 0});
    const [servicesModal, setServicesModal] = useState(false);
    const [user,setUser] = useState({
        fullName: '',
        email: '',
        password: '',
        buisnessWebsite: '',
        buisnessName: '',
        publicLink: '',
        role: '',
        buisnessAddress: '',
        country: '',
        mode: 0,
        services: [],
        schedule: WEEK_OBJECT,
    })
    
    function closeServicesModal () { setServicesModal(false); }


    useEffect(() => {
        removeNavbar();
    }, [])

    /**
     * Fade navabar for Register and Login pages.
     */
    const removeNavbar = () => {
        props.setHide(true);
    }

    /**
     * Increment loader
     * Save user appointment type.
     */
    const durationInfo = () =>{
        setStep((prev) => prev += 22.5);
    }

    /**
     * Increment loadbar.
     * Save user buisness data.
     */
    const buisnessInfo = () => {
        setStep((prev) => prev += 22.5);
        // Save user buisness data
    }

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
        console.log(WEEK_OBJECT)

        setStep((prev) => prev+=22.5);
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
            services: [...prev, servicesObject]
        }));
        setServices({ title: '', minutes: 0})
        setServicesModal(false);
    }


    return(
        <>  
            
                    <Container className="container" sx={{ pt: 5, pb: 5}}>                
                    { step === 10 ?(
                        <Container className="content_container" sx={{ p: 3}}>
                        <Box sx={{ flexGrow: 1, p: 1}}>
                            <Typography variant="h3">Tell us about your business.</Typography>
                            <Grid spacing={2}
                                columnSpacing={5}
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                fullWidth
                            >
                                <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Buisness name*</strong></Typography>
                                </FormHelperText>
                                    <TextField name="buisnessName"  id="buisness-name" variant="filled" value={user.buisnessName} onChange={e => setUser((prev) => ({ ...prev, buisnessName: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>Company website*</strong></Typography>
                                    </FormHelperText>
                                    <TextField name="buisnessWebsite" variant="filled" value={user.buisnessWebsite} onChange={e => setUser((prev) => ({ ...prev, buisnessWebsite: e.target.value}))} fullWidth/>
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
                                    <TextField name="publicLink" variant="filled" value={user.publicLink} onChange={e => setUser((prev) => ({ ...prev, publicLink: e.target.value}))} fullWidth/>
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
                                        <Typography variant="body2"><strong>Select your role (optional)</strong></Typography>
                                    </FormHelperText>
                                    <TextField name="role" variant="filled" value={user.role} onChange={e => setUser((prev) => ({ ...prev, role: e.target.value}))} fullWidth/>
                                </Grid>
                                <Grid item sm={12} xs={12} md={6}>
                                    <FormHelperText id="component-helper-text">
                                        <Typography variant="body2"><strong>Buisness address (optional)</strong></Typography>
                                    </FormHelperText>
                                    <TextField name="buisnessAddress" value={user.buisnessAddress} onChange={e => setUser((prev) => ({ ...prev, buisnessAddress: e.target.value}))}  variant="filled" fullWidth/>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button sx={{ mt: 3, width: '100px'}} variant="contained" color="primary" onClick={() => buisnessInfo() }>Next</Button>
                        </Container>
                        ): null
                    }
                    {
                        step === 32.5 ?
                        (
                            <Container className="content_container" sx={{ p: 3}}>
                                <Box sx={{ flexGrow: 1, p: 1}}>
                                    <Typography variant="h3">How would you like to use LOGO?</Typography>
                                </Box>

                                <Container sx={{ pt: 5}}>
                                    <Grid 
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="stretch"
                                        spacing={2}
                                    >
                                        <Grid item xs={12} sm={12} md={4}>
                                            <StyledCard sx={{ backgroundColor: mode === 0 ? '#ffc34d': '', boxShadow: mode === 0 ? 3: 0 }} onClick={() => handleCardClick(0) } id="selection_card">
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
                                        <Grid item xs={12} sm={12} md={4}>
                                        <StyledCard sx={{ backgroundColor: mode === 1 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }} id="selection_card" onClick={() => handleCardClick(1) } >
                                                <CardContent>
                                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Analytics</strong></Typography>
                                                    <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">View buisness trends.</Typography>
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
                                        <Grid item xs={12} sm={12} md={4}>
                                            <StyledCard sx={{ backgroundColor: mode === 2 ? '#ffc34d': '',boxShadow: mode === 2 ? 3: 0 }} id="selection_card" onClick={() => handleCardClick(2) }>
                                                <CardContent>
                                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Analytics + Advertisments</strong></Typography>
                                                    <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">View buisness trends and advertise.</Typography>
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
                                        <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                        <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => durationInfo() }>Next</Button>
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
                                        <Grid container sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 6, sm: 4, md: 4, lg: 6 }}>
                                            {
                                                DEMO.map((item, index) => {
                                                    return (
                                                        <Grid item xs={2} sm={2} md={2} key={index}>
                                                            <StyledCardService id="service_cards">
                                                                <CardContent>
                                                                    <Typography variant="subtitle1">{item.service_name}</Typography>
                                                                        <IconButton onClick={() => console.log('Remove action')}>
                                                                            <CloseRoundedIcon/>
                                                                        </IconButton>
                                                                </CardContent>
                                                            </StyledCardService>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>

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
                                        <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                        <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => operationHoursInfo() }>Next</Button>
                                    </Stack>
                                </Box>
                                

                            </Container>
                        ): null
                    }
                    {
                        step === 77.5 ? (
                            <Container className="content_container" sx={{ p: 3}}>
                                    <Box sx={{ flexGrow: 1, p: 1}}>
                                        <Typography variant="h3">Add your hours of operation.</Typography>

                                        <Container sx={{ pt: 5}}>
                                            <Typography variant="subtitle2" textAlign="left"><strong>Hours</strong></Typography>
                                            <Grid container spacing={1} justifyContent="space-between">
                                                <Grid item lg={6} md={6} sm={6}>
                                                <Box sx={{ minWidth: 120 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="start_time_label">start</InputLabel>
                                                        <Select
                                                        labelId="start_time_label"
                                                        id="start_time"
                                                        variant="filled"
                                                        label="Start"
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
                                                <Grid item lg={6} md={6} sm={6}>
                                                <Box sx={{ minWidth: 120 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="end_time_label">end</InputLabel>
                                                        <Select
                                                            labelId="end_time_label"
                                                            id="end_time"
                                                            label="End"
                                                            variant="filled"
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
                                            <Typography sx={{ pt: 2}} variant="subtitle2" textAlign="left"><strong>Hours</strong></Typography>

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
                                            <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => previous() }>Back</Button>
                                            <Button sx={{ width: '100px'}} variant="contained" color="primary" onClick={() => operationHoursInfo() }>Next</Button>
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4} lg={4}></Grid>
                                        <Grid item xs={12} md={4} lg={4}>
                                        <Stack direction="column" sx={{ pt: 2}} spacing={2}>
                                            <TextField name="fullName"  label="Full name" variant="filled"></TextField>
                                            <TextField name="password" label="Password" type="password" variant="filled"></TextField>
                                            <TextField name="email" label="Email" type="email" variant="filled"></TextField>
                                            <Button type="submit" variant="contained">Submit</Button>
                                        </Stack>
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
                    <Typography sx={{ pt: 1}} variant="subtitle2"><strong>Your business</strong></Typography>
                </Box>
            </N>
        </>
    )
}