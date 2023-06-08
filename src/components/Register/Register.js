import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, LinearProgress, TextField, Box, Button, FormHelperText,
Tooltip, IconButton, Stack, CardActions, CardContent, CardMedia, Checkbox , FormControl, Select,
InputLabel, MenuItem } from "@mui/material";
import { Nav, Navbar as N, NavDropdown} from 'react-bootstrap';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { StyledCard, StyledCardService } from "./CardStyle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { object, string, number, date, InferType } from 'yup';

import { DURATION_DEMO, HOURS_LIST, WEEK_LIST, WEEK_OBJ } from "../Testing/RegisterTest.js";

import LIST_IMG from "../../assets/images/listhd.png";
import CAL_IMG from "../../assets/images/calendarsd.png";
import BOTH_IMG from  "../../assets/images/bothsd.png";
import "./Register.css";



/** 
 * Option 2: 
 * Here have the user choose between basic or medium with analytics, Promotions
 * 
 * 
 * 
 * 
*/


export default function Register(props){

    let DEMO = DURATION_DEMO();
    let HOURS = HOURS_LIST();
    let WEEK = WEEK_LIST();
    let WEEK_OBJECT = WEEK_OBJ();

    console.log(HOURS.length)
    
    const [step, setStep] = useState(10);
    const [state, setState] = useState({
        raised:false,
        shadow:1,
    })

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
        setStep((prev) => prev+=22.5);
    }

    const handleCheckedEvent = (item) => {
        WEEK_OBJECT[item] = !WEEK_OBJECT[item];
    }



    // TO DO: 
    // Form of navigation back to product page.


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
                                <TextField id="buisness-name" variant="filled" fullWidth/>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Company website*</strong></Typography>
                                </FormHelperText>
                                <TextField id="outlined-basic" variant="filled" fullWidth/>
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
                                <TextField id="outlined-basic" variant="filled" fullWidth/>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Country*</strong></Typography>
                                </FormHelperText>
                                <TextField id="outlined-basic" variant="filled" fullWidth/>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Select your role (optional)</strong></Typography>
                                </FormHelperText>
                                <TextField id="outlined-basic" variant="filled" fullWidth/>
                            </Grid>
                            <Grid item sm={12} xs={12} md={6}>
                                <FormHelperText id="component-helper-text">
                                    <Typography variant="body2"><strong>Buisness address (optional)</strong></Typography>
                                </FormHelperText>
                                <TextField id="outlined-basic" variant="filled" fullWidth/>
                            </Grid>
                        </Grid>
                    </Box>
                    <Button sx={{ mt: 3, width: '100px'}} variant="contained" color="primary" onClick={() => buisnessInfo() }>Next</Button>
                    </Container>): null
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
                                    <StyledCard id="selection_card"
                                    >
                                            <CardContent>
                                            <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Set up waitlist</strong></Typography>
                                            <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Let my clients wait from anywhere.</Typography>

                                            <CardMedia
                                                component="img"
                                                sx={{ width: '100%', height: '100%'}}
                                                image={LIST_IMG}
                                                alt="Live from space album cover"
                                            />
                                            </CardContent>
                                            <CardActions>
                                            <ArrowCircleRightRoundedIcon fontSize="large"/>
                                            </CardActions>
                                    </StyledCard>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                    <StyledCard id="selection_card" 
                                    >
                                            <CardContent>
                                                <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Schedule appointments</strong></Typography>
                                                <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">Let my clients schedule in advance.</Typography>
                                                <CardMedia
                                                component="img"
                                                sx={{ width: '100%', height: '100%'}}
                                                image={CAL_IMG}
                                                alt="Live from space album cover"
                                                />
                                            </CardContent>
                                            <CardActions>
                                            <ArrowCircleRightRoundedIcon fontSize="large"/>
                                            </CardActions>
                                        </StyledCard>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <StyledCard id="selection_card">
                                            <CardContent>
                                                <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Both</strong></Typography>
                                                <Typography sx={{ textAlign: 'left',  pt: 2}} variant="subtitle2" color="dark">Let my clients do both.</Typography>
                                                <CardMedia
                                                component="img"
                                                sx={{ width: '100%', height: '100%'}}
                                                image={BOTH_IMG}
                                                alt="Live from space album cover"
                                                />
                                            </CardContent>
                                            <CardActions>
                                            <ArrowCircleRightRoundedIcon fontSize="large"/>
                                            </CardActions>
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
                                    <Button endIcon={ <ControlPointRoundedIcon fontSize="large" /> } size="large" variant="outlined" color="primary">
                                        Add a service
                                    </Button>
                                    <Grid container sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 2, sm: 2, md: 2, lg: 6 }}>
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
                    <>
                    <Container className="content_container" sx={{ p: 3}}>
                            <Box sx={{ flexGrow: 1, p: 1}}>
                                <Typography variant="h3">Add your hours of operation.</Typography>

                                <Container sx={{ pt: 5}}>
                                    <Typography variant="subtitle2" textAlign="left"><strong>Hours</strong></Typography>
                                    <Grid container spacing={3} justifyContent="space-between">
                                        <Grid item lg={6} md={6} sm={4}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="start_time_label">Select start from</InputLabel>
                                                <Select
                                                labelId="start_time_label"
                                                id="start_time"
                                                variant="filled"
                                                label="Start"
                                                
                                                >
                                                { HOURS && HOURS.map((item, index) =>(
                                                     <MenuItem key={index} value={item}>{item}</MenuItem>
                                                     ) )}
                                                
                                                </Select>
                                            </FormControl>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={4}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="end_time_label">Select to time </InputLabel>
                                                <Select
                                                    labelId="end_time_label"
                                                    id="end_time"
                                                    label="End"
                                                    variant="filled"

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
                                                            onChange={ handleCheckedEvent(item) }
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
                    
                    </>) : null
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